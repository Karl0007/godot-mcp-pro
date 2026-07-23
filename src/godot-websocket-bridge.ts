import { randomUUID } from 'node:crypto';
import { EventEmitter } from 'node:events';
import { WebSocket, WebSocketServer } from 'ws';
import type { BridgeConfig } from './config.js';
import { BridgeTimeoutError, BridgeUnavailableError } from './errors.js';

interface JsonRpcResponse {
  jsonrpc: '2.0';
  id: string;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
}

interface PendingRequest {
  session: string;
  timer: NodeJS.Timeout;
  resolve: (value: unknown) => void;
  reject: (error: Error) => void;
}

export interface BridgeStatus {
  host: string;
  port: number;
  connected: boolean;
  session: string | null;
  pending: number;
}

export class GodotRpcError extends Error {
  constructor(
    readonly code: number,
    message: string,
    readonly data?: unknown,
  ) {
    super(message);
    this.name = 'GodotRpcError';
  }
}

export class GodotWebSocketBridge extends EventEmitter {
  private readonly config: BridgeConfig;
  private server: WebSocketServer | null = null;
  private socket: WebSocket | null = null;
  private session: string | null = null;
  private sequence = 0;
  private heartbeat: NodeJS.Timeout | null = null;
  private readonly pending = new Map<string, PendingRequest>();
  private readonly connectionWaiters = new Set<{
    resolve: (socket: WebSocket) => void;
    reject: (error: Error) => void;
    timer: NodeJS.Timeout;
  }>();

  constructor(config: BridgeConfig) {
    super();
    this.config = config;
  }

  async start(): Promise<void> {
    if (this.server) return;
    this.server = new WebSocketServer({ host: this.config.host, port: this.config.port });
    this.server.on('connection', (socket) => this.acceptConnection(socket));
    this.server.on('error', (error) => this.emit('error', error));
    await new Promise<void>((resolve, reject) => {
      const server = this.server;
      if (!server) return reject(new Error('WebSocket server was not created'));
      const onListening = () => {
        server.off('error', onError);
        resolve();
      };
      const onError = (error: Error) => {
        server.off('listening', onListening);
        reject(error);
      };
      server.once('listening', onListening);
      server.once('error', onError);
    });
  }

  async stop(): Promise<void> {
    if (this.heartbeat) clearInterval(this.heartbeat);
    this.heartbeat = null;
    this.rejectPending(new BridgeUnavailableError('Godot bridge stopped'));
    this.rejectConnectionWaiters(new BridgeUnavailableError('Godot bridge stopped'));
    const socket = this.socket;
    this.socket = null;
    this.session = null;
    if (socket) socket.close(1000, 'Bridge stopped');
    const server = this.server;
    this.server = null;
    if (server) await new Promise<void>((resolve) => server.close(() => resolve()));
  }

  status(): BridgeStatus {
    return {
      host: this.config.host,
      port: this.config.port,
      connected: this.socket?.readyState === WebSocket.OPEN,
      session: this.session,
      pending: this.pending.size,
    };
  }

  async waitForConnection(timeoutMs = this.config.connectionTimeoutMs): Promise<WebSocket> {
    if (this.socket?.readyState === WebSocket.OPEN) return this.socket;
    return new Promise<WebSocket>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.connectionWaiters.delete(waiter);
        reject(new BridgeUnavailableError(`No Godot editor connected on ${this.config.host}:${this.config.port}`));
      }, timeoutMs);
      const waiter = { resolve, reject, timer };
      this.connectionWaiters.add(waiter);
    });
  }

  async call(method: string, params: Record<string, unknown> = {}, timeoutMs = this.config.requestTimeoutMs): Promise<unknown> {
    const socket = await this.waitForConnection(timeoutMs);
    const session = this.session;
    if (!session) throw new BridgeUnavailableError('Godot editor session is not available');
    const id = `gmp-${session}-${this.sequence += 1}-${randomUUID()}`;
    const request = JSON.stringify({ jsonrpc: '2.0', id, method, params });
    return new Promise<unknown>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new BridgeTimeoutError(`Godot command '${method}' timed out after ${timeoutMs}ms`));
      }, timeoutMs);
      this.pending.set(id, { session, timer, resolve, reject });
      try {
        socket.send(request);
      } catch (error) {
        clearTimeout(timer);
        this.pending.delete(id);
        reject(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }

  private acceptConnection(socket: WebSocket): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      socket.close(1008, 'Only one Godot editor connection is allowed');
      return;
    }
    const session = randomUUID();
    this.socket = socket;
    this.session = session;
    this.emit('connected', this.status());
    this.resolveConnectionWaiters(socket);
    socket.on('message', (data) => this.handleMessage(session, data.toString()));
    socket.on('close', () => this.handleClose(session));
    socket.on('error', (error) => this.emit('error', error));
    if (!this.heartbeat) {
      this.heartbeat = setInterval(() => this.sendHeartbeat(), 10_000);
    }
  }

  private handleMessage(session: string, text: string): void {
    let message: unknown;
    try {
      message = JSON.parse(text);
    } catch {
      this.emit('protocolError', new Error('Godot sent invalid JSON'));
      return;
    }
    if (!isRecord(message) || message.jsonrpc !== '2.0') {
      this.emit('protocolError', new Error('Godot sent an invalid JSON-RPC message'));
      return;
    }
    if (message.method === 'ping') {
      this.send({ jsonrpc: '2.0', method: 'pong', params: {} });
      return;
    }
    if (message.method === 'pong') return;
    if (typeof message.id !== 'string') {
      this.emit('protocolError', new Error('Godot response has no string id'));
      return;
    }
    const pending = this.pending.get(message.id);
    if (!pending || pending.session !== session) return;
    this.pending.delete(message.id);
    clearTimeout(pending.timer);
    const response = message as unknown as JsonRpcResponse;
    if (response.error) {
      pending.reject(new GodotRpcError(response.error.code, response.error.message, response.error.data));
    } else {
      pending.resolve(response.result ?? {});
    }
  }

  private handleClose(session: string): void {
    if (this.session !== session) return;
    this.socket = null;
    this.session = null;
    this.rejectPending(new BridgeUnavailableError('Godot editor connection closed'));
    this.emit('disconnected');
  }

  private sendHeartbeat(): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.send({ jsonrpc: '2.0', method: 'ping', params: {} });
    }
  }

  private send(message: Record<string, unknown>): void {
    if (this.socket?.readyState === WebSocket.OPEN) this.socket.send(JSON.stringify(message));
  }

  private rejectPending(error: Error): void {
    for (const [id, pending] of this.pending) {
      clearTimeout(pending.timer);
      pending.reject(error);
      this.pending.delete(id);
    }
  }

  private resolveConnectionWaiters(socket: WebSocket): void {
    for (const waiter of this.connectionWaiters) {
      clearTimeout(waiter.timer);
      waiter.resolve(socket);
      this.connectionWaiters.delete(waiter);
    }
  }

  private rejectConnectionWaiters(error: Error): void {
    for (const waiter of this.connectionWaiters) {
      clearTimeout(waiter.timer);
      waiter.reject(error);
      this.connectionWaiters.delete(waiter);
    }
  }
}

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
