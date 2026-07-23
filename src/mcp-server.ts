import { randomUUID } from 'node:crypto';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type CallToolResult,
} from '@modelcontextprotocol/sdk/types.js';
import { writeFrameArtifacts } from './artifacts.js';
import { GodotWebSocketBridge } from './godot-websocket-bridge.js';
import { formatError } from './errors.js';
import { findTool, TOOL_MANIFEST } from './manifest.js';
import { RequestLogger } from './request-logger.js';
import { SerialScheduler } from './serial-scheduler.js';

export interface McpServerOptions {
  stateDir?: string;
  port?: number;
  logger?: RequestLogger;
}

export function createMcpServer(
  bridge: GodotWebSocketBridge,
  scheduler: SerialScheduler = new SerialScheduler(),
  options: McpServerOptions = {},
): Server {
  const logger = options.logger ?? new RequestLogger({ stateDir: options.stateDir ?? '.godot-mcp', port: options.port ?? 6505 });
  const server = new Server(
    { name: 'godot-mcp-pro', version: '0.1.0' },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async (request) => {
    const requestId = (request as { id?: string | number }).id ?? randomUUID();
    const started = performance.now();
    logger.request(requestId, 'tools/list', request.params ?? {});
    const result = {
      tools: TOOL_MANIFEST.map((tool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: { ...tool.inputSchema, type: 'object' as const },
      })),
    };
    logger.response(requestId, 'tools/list', performance.now() - started, result);
    return result;
  });

  server.setRequestHandler(CallToolRequestSchema, async (request): Promise<CallToolResult> => {
    const requestId = (request as { id?: string | number }).id ?? randomUUID();
    const method = 'tools/call';
    const started = performance.now();
    logger.request(requestId, method, request.params);
    const tool = findTool(request.params.name);
    if (!tool) {
      const message = `Unknown tool '${request.params.name}'`;
      logger.error(requestId, method, performance.now() - started, message);
      const result = errorResult(message);
      logger.response(requestId, method, performance.now() - started, result);
      return result;
    }

    try {
      const args = request.params.arguments ?? {};
      const result = await scheduler.enqueue(() => bridge.call(tool.name, args));
      const converted = resultToToolResult(result, { stateDir: logger.stateDir, requestId });
      logger.response(requestId, method, performance.now() - started, converted);
      return converted;
    } catch (error) {
      logger.error(requestId, method, performance.now() - started, error);
      const result = errorResult(formatError(error));
      logger.response(requestId, method, performance.now() - started, result);
      return result;
    }
  });

  return server;
}

export interface ResultConversionOptions {
  stateDir?: string;
  requestId?: unknown;
}

export function resultToToolResult(result: unknown, options: ResultConversionOptions = {}): CallToolResult {
  if (isRecord(result) && Array.isArray(result.frames) && result.frames.every((frame) => typeof frame === 'string')) {
    const stateDir = options.stateDir ?? '.godot-mcp';
    const requestId = options.requestId ?? randomUUID();
    const artifacts = writeFrameArtifacts(stateDir, requestId, result.frames);
    const summary: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(result)) {
      if (key !== 'frames' && key !== 'image_base64' && key !== 'data') summary[key] = value;
    }
    summary.frame_count = result.frames.length;
    summary.artifact_dir = artifacts.artifactDir;
    summary.files = artifacts.files;
    const mimeType = typeof result.mime_type === 'string'
      ? result.mime_type
      : typeof result.mimeType === 'string'
        ? result.mimeType
        : 'image/png';
    return {
      content: [
        { type: 'text', text: stableJson(summary) },
        ...result.frames.map((data) => ({ type: 'image' as const, data, mimeType })),
      ],
    };
  }

  if (isRecord(result) && typeof result.image_base64 === 'string') {
    const mimeType = typeof result.mime_type === 'string'
      ? result.mime_type
      : typeof result.mimeType === 'string'
        ? result.mimeType
        : 'image/png';
    return {
      content: [{ type: 'image', data: result.image_base64, mimeType }],
    };
  }

  return {
    content: [{ type: 'text', text: stableJson(result) }],
  };
}

function errorResult(message: string): CallToolResult {
  return {
    isError: true,
    content: [{ type: 'text', text: message }],
  };
}

export function stableJson(value: unknown): string {
  const serialized = JSON.stringify(sortKeys(value));
  return serialized === undefined ? 'null' : serialized;
}

function sortKeys(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (!isRecord(value)) return value;
  return Object.fromEntries(
    Object.keys(value)
      .sort()
      .map((key) => [key, sortKeys(value[key])]),
  );
}

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
