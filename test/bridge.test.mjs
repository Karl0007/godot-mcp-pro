import test from 'node:test';
import assert from 'node:assert/strict';
import { WebSocket } from 'ws';
import { GodotWebSocketBridge } from '../dist/src/godot-websocket-bridge.js';

const config = {
  host: '127.0.0.1',
  port: 6509,
  connectionTimeoutMs: 500,
  requestTimeoutMs: 500,
  logLevel: 'silent',
};

function connectPeer() {
  return new Promise((resolve, reject) => {
    const peer = new WebSocket(`ws://${config.host}:${config.port}`);
    peer.once('open', () => resolve(peer));
    peer.once('error', reject);
  });
}

test('bridge forwards calls and handles application heartbeat', async () => {
  const bridge = new GodotWebSocketBridge(config);
  await bridge.start();
  const peer = await connectPeer();
  peer.on('message', (raw) => {
    const message = JSON.parse(raw.toString());
    if (message.method === 'ping') {
      peer.send(JSON.stringify({ jsonrpc: '2.0', method: 'pong', params: {} }));
    }
  });
  await bridge.waitForConnection();

  const callResult = bridge.call('get_project_info', {});
  const request = await new Promise((resolve) => peer.once('message', (raw) => resolve(JSON.parse(raw.toString()))));
  assert.equal(request.method, 'get_project_info');
  peer.send(JSON.stringify({ jsonrpc: '2.0', id: request.id, result: { project_name: 'Test' } }));
  assert.deepEqual(await callResult, { project_name: 'Test' });

  const pong = new Promise((resolve) => peer.once('message', (raw) => resolve(JSON.parse(raw.toString()))));
  peer.send(JSON.stringify({ jsonrpc: '2.0', method: 'ping', params: {} }));
  assert.deepEqual(await pong, { jsonrpc: '2.0', method: 'pong', params: {} });

  peer.close();
  await bridge.stop();
});

test('bridge rejects pending calls when peer disconnects', async () => {
  const bridge = new GodotWebSocketBridge(config);
  await bridge.start();
  const peer = await connectPeer();
  await bridge.waitForConnection();
  const pending = bridge.call('slow_command', {});
  await new Promise((resolve) => peer.once('message', resolve));
  peer.close();
  await assert.rejects(pending, /connection closed/);
  await bridge.stop();
});
