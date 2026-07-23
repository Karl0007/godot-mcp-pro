#!/usr/bin/env node

import { loadConfig } from './config.js';
import { GodotWebSocketBridge } from './godot-websocket-bridge.js';
import { CliUsageError, formatError } from './errors.js';
import { createMcpServer } from './mcp-server.js';
import { SerialScheduler } from './serial-scheduler.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { executeCli, parseCliArgs } from './cli.js';

async function runMcpServer(): Promise<void> {
  const config = loadConfig();
  const bridge = new GodotWebSocketBridge(config);
  bridge.on('error', (error: Error) => {
    if (config.logLevel !== 'silent') {
      process.stderr.write(`godot-mcp-pro: ${formatError(error)}\n`);
    }
  });
  await bridge.start();

  const server = createMcpServer(bridge, new SerialScheduler(), { stateDir: config.stateDir, port: config.port });
  server.onclose = () => {
    void bridge.stop();
  };
  server.onerror = (error) => {
    if (config.logLevel !== 'silent') {
      process.stderr.write(`godot-mcp-pro: ${formatError(error)}\n`);
    }
  };
  await server.connect(new StdioServerTransport());
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.length > 0) {
    await executeCli(parseCliArgs(args));
    return;
  }
  await runMcpServer();
}

main().catch((error: unknown) => {
  process.stderr.write(`godot-mcp-pro: ${formatError(error)}\n`);
  process.exitCode = error instanceof CliUsageError
    ? error.exitCode
    : error instanceof Error && 'exitCode' in error && typeof error.exitCode === 'number'
      ? error.exitCode
      : 1;
});
