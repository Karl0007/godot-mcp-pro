import { appendFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

export type LogDirection = 'request' | 'response' | 'error';

export interface LogEntry {
  timestamp: string;
  direction: LogDirection;
  request_id: string | number | null;
  method: string;
  duration_ms: number;
  params?: unknown;
  result?: unknown;
  error?: unknown;
  bytes: number;
}

export interface RequestLoggerOptions {
  stateDir: string;
  port: number;
}

const OMIT_KEYS = /^(?:image_base64|frames|code|execute_editor_script|data)$/i;
const MAX_STRING_LENGTH = 512;
const MAX_ARRAY_ITEMS = 20;
const MAX_OBJECT_KEYS = 50;

export class RequestLogger {
  readonly stateDir: string;
  readonly logFile: string;
  readonly artifactDir: string;

  constructor(options: RequestLoggerOptions) {
    this.stateDir = resolve(options.stateDir);
    this.logFile = join(this.stateDir, 'logs', `bridge-${options.port}.jsonl`);
    this.artifactDir = join(this.stateDir, 'artifacts');
  }

  request(requestId: unknown, method: string, params: unknown): void {
    this.write({
      timestamp: new Date().toISOString(),
      direction: 'request',
      request_id: normalizeRequestId(requestId),
      method,
      duration_ms: 0,
      params: summarize(params),
      bytes: byteLength(summarize(params)),
    });
  }

  response(requestId: unknown, method: string, durationMs: number, result: unknown): void {
    const summary = summarize(result);
    this.write({
      timestamp: new Date().toISOString(),
      direction: 'response',
      request_id: normalizeRequestId(requestId),
      method,
      duration_ms: Math.max(0, Math.round(durationMs)),
      result: summary,
      bytes: byteLength(result),
    });
  }

  error(requestId: unknown, method: string, durationMs: number, error: unknown): void {
    const summary = summarize(error instanceof Error ? { name: error.name, message: error.message } : error);
    this.write({
      timestamp: new Date().toISOString(),
      direction: 'error',
      request_id: normalizeRequestId(requestId),
      method,
      duration_ms: Math.max(0, Math.round(durationMs)),
      error: summary,
      bytes: byteLength(summary),
    });
  }

  recent(limit = 10): LogEntry[] {
    try {
      const lines = readFileSync(this.logFile, 'utf8').trim().split('\n').filter(Boolean);
      return lines.slice(-limit).flatMap((line) => {
        try { return [JSON.parse(line) as LogEntry]; } catch { return []; }
      });
    } catch {
      return [];
    }
  }

  recentErrors(limit = 10): LogEntry[] {
    return this.recent(100).filter((entry) => entry.direction === 'error').slice(-limit);
  }

  private write(entry: LogEntry): void {
    mkdirSync(join(this.stateDir, 'logs'), { recursive: true });
    appendFileSync(this.logFile, `${JSON.stringify(entry)}\n`, 'utf8');
  }
}

export function summarize(value: unknown, depth = 0): unknown {
  if (value === null || typeof value === 'boolean' || typeof value === 'number') return value;
  if (typeof value === 'string') {
    if (value.length <= MAX_STRING_LENGTH) return value;
    return { omitted: true, length: value.length };
  }
  if (depth >= 4) return { omitted: true, type: Array.isArray(value) ? 'array' : 'object' };
  if (Array.isArray(value)) {
    const items = value.slice(0, MAX_ARRAY_ITEMS).map((item) => summarize(item, depth + 1));
    if (value.length > MAX_ARRAY_ITEMS) items.push({ omitted: true, count: value.length - MAX_ARRAY_ITEMS });
    return items;
  }
  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const output: Record<string, unknown> = {};
    for (const key of Object.keys(record).slice(0, MAX_OBJECT_KEYS)) {
      const item = record[key];
      if (OMIT_KEYS.test(key)) {
        output[key] = { omitted: true, ...(Array.isArray(item) ? { count: item.length } : typeof item === 'string' ? { length: item.length } : {}) };
      } else {
        output[key] = summarize(item, depth + 1);
      }
    }
    if (Object.keys(record).length > MAX_OBJECT_KEYS) output._omitted_keys = Object.keys(record).length - MAX_OBJECT_KEYS;
    return output;
  }
  return String(value);
}

function normalizeRequestId(value: unknown): string | number | null {
  if (typeof value === 'string' || typeof value === 'number') return value;
  return value === undefined || value === null ? null : String(value);
}

function byteLength(value: unknown): number {
  return Buffer.byteLength(JSON.stringify(value) ?? 'null', 'utf8');
}
