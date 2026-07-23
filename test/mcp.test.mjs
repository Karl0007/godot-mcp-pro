import test from 'node:test';
import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { TOOL_MANIFEST } from '../dist/src/manifest.js';
import { createMcpServer, resultToToolResult, stableJson } from '../dist/src/mcp-server.js';
import { SerialScheduler } from '../dist/src/serial-scheduler.js';

async function connectedPair(bridge) {
  const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
  const server = createMcpServer(bridge, new SerialScheduler());
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

test('stableJson sorts ordinary results recursively', () => {
  assert.equal(
    stableJson({ z: { b: 2, a: 1 }, a: [{ d: 4, c: 3 }] }),
    '{"a":[{"c":3,"d":4}],"z":{"a":1,"b":2}}',
  );
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
