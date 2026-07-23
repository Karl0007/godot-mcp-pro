import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { TOOL_MANIFEST } from '../dist/src/manifest.js';
import { createMcpServer, resultToToolResult, stableJson } from '../dist/src/mcp-server.js';
import { RequestLogger } from '../dist/src/request-logger.js';
import { SerialScheduler } from '../dist/src/serial-scheduler.js';

async function connectedPair(bridge, options = {}) {
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const server = createMcpServer(bridge, new SerialScheduler(), options);
  const client = new Client({ name: 'mcp-test-client', version: '1.0.0' }, { capabilities: {} });
  await server.connect(serverTransport);
  await client.connect(clientTransport);
  return { client, server };
}

test('MCP lists manifest tools and forwards tool calls', async () => {
  const calls = [];
  const { client, server } = await connectedPair({
    call: async (name, args) => {
      calls.push({ name, args });
      return { z: 1, a: 'ok' };
    },
  });

  const listed = await client.listTools();
  assert.equal(TOOL_MANIFEST.length, 174);
  assert.equal(listed.tools.length, 174);
  assert.ok(listed.tools.every((tool) => tool.inputSchema.type === 'object'));

  const result = await client.callTool({ name: 'get_project_info', arguments: { include: true } });
  assert.deepEqual(result.content, [{ type: 'text', text: '{"a":"ok","z":1}' }]);
  assert.deepEqual(calls, [{ name: 'get_project_info', args: { include: true } }]);

  await client.close();
  await server.close();
});

test('MCP calls persist request and response logs', async () => {
  const stateDir = join(tmpdir(), `godot-mcp-test-${process.pid}-mcp-logs`);
  rmSync(stateDir, { recursive: true, force: true });
  const { client, server } = await connectedPair({ call: async () => ({ ok: true }) }, { stateDir, port: 6505 });
  await client.callTool({ name: 'get_project_info', arguments: {} });
  const logFile = join(stateDir, 'logs', 'bridge-6505.jsonl');
  assert.equal(existsSync(logFile), true);
  const entries = readFileSync(logFile, 'utf8').trim().split('\n').map((line) => JSON.parse(line));
  assert.ok(entries.some((entry) => entry.direction === 'request' && entry.method === 'tools/call'));
  assert.ok(entries.some((entry) => entry.direction === 'response' && entry.method === 'tools/call'));
  await client.close();
  await server.close();
  rmSync(stateDir, { recursive: true, force: true });
});

test('unknown MCP tools return an error result', async () => {
  const { client, server } = await connectedPair({ call: async () => ({}) });
  const result = await client.callTool({ name: 'not_a_tool', arguments: {} });
  assert.equal(result.isError, true);
  assert.match(result.content[0].text, /Unknown tool/);
  await client.close();
  await server.close();
});

test('resultToToolResult converts image_base64 to image content', () => {
  assert.deepEqual(
    resultToToolResult({ image_base64: 'YWJj', mime_type: 'image/webp' }),
    { content: [{ type: 'image', data: 'YWJj', mimeType: 'image/webp' }] },
  );
});

test('capture_frames becomes artifacts and image contents', () => {
  const stateDir = join(tmpdir(), `godot-mcp-test-${process.pid}-frames`);
  rmSync(stateDir, { recursive: true, force: true });
  const result = resultToToolResult({ frames: ['YWJj', 'ZGVm'], count: 2, width: 10, height: 10 }, { stateDir, requestId: 'req-1' });
  assert.equal(result.content[0].type, 'text');
  assert.match(result.content[0].text, /frame_count/);
  assert.deepEqual(result.content.slice(1), [
    { type: 'image', data: 'YWJj', mimeType: 'image/png' },
    { type: 'image', data: 'ZGVm', mimeType: 'image/png' },
  ]);
  const summary = JSON.parse(result.content[0].text);
  assert.equal(summary.files.length, 2);
  assert.equal(existsSync(summary.files[0]), true);
  assert.deepEqual(readFileSync(summary.files[0]), Buffer.from('abc'));
  rmSync(stateDir, { recursive: true, force: true });
});

test('stableJson sorts ordinary results recursively', () => {
  assert.equal(
    stableJson({ z: { b: 2, a: 1 }, a: [{ d: 4, c: 3 }] }),
    '{"a":[{"c":3,"d":4}],"z":{"a":1,"b":2}}',
  );
});

test('request logger persists redacted JSONL entries', () => {
  const stateDir = join(tmpdir(), `godot-mcp-test-${process.pid}-logs`);
  rmSync(stateDir, { recursive: true, force: true });
  const logger = new RequestLogger({ stateDir, port: 6505 });
  logger.request('req-2', 'tools/call', { code: 'secret', frames: ['YWJj'], name: 'get_output_log' });
  logger.response('req-2', 'tools/call', 12, { frames: ['YWJj'], count: 1 });
  const entries = logger.recent();
  assert.equal(entries.length, 2);
  assert.equal(entries[0].params.code.omitted, true);
  assert.equal(entries[1].result.frames.omitted, true);
  assert.equal(logger.recentErrors().length, 0);
  assert.equal(existsSync(logger.logFile), true);
  assert.equal(readFileSync(logger.logFile, 'utf8').split('\n').filter(Boolean).length, 2);
  rmSync(stateDir, { recursive: true, force: true });
});

test('image_base64 results become image content over MCP transport', async () => {
  const { client, server } = await connectedPair({
    call: async () => ({ image_base64: 'YWJj', mime_type: 'image/webp' }),
  });
  const result = await client.callTool({ name: 'get_project_info', arguments: {} });
  assert.deepEqual(result.content, [{ type: 'image', data: 'YWJj', mimeType: 'image/webp' }]);
  await client.close();
  await server.close();
});
