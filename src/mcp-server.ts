import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type CallToolResult,
} from '@modelcontextprotocol/sdk/types.js';
import { GodotWebSocketBridge } from './godot-websocket-bridge.js';
import { formatError } from './errors.js';
import { findTool, TOOL_MANIFEST } from './manifest.js';
import { SerialScheduler } from './serial-scheduler.js';

export function createMcpServer(
  bridge: GodotWebSocketBridge,
  scheduler: SerialScheduler = new SerialScheduler(),
): Server {
  const server = new Server(
    { name: 'godot-mcp-pro', version: '0.1.0' },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: TOOL_MANIFEST.map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: { ...tool.inputSchema, type: 'object' as const },
    })),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request): Promise<CallToolResult> => {
    const tool = findTool(request.params.name);
    if (!tool) {
      return errorResult(`Unknown tool '${request.params.name}'`);
    }

    try {
      const args = request.params.arguments ?? {};
      const result = await scheduler.enqueue(() => bridge.call(tool.name, args));
      return resultToToolResult(result);
    } catch (error) {
      return errorResult(formatError(error));
    }
  });

  return server;
}

export function resultToToolResult(result: unknown): CallToolResult {
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
