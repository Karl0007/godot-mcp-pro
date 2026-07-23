#!/usr/bin/env node

import { loadConfig } from './config.js';
import { GodotWebSocketBridge } from './godot-websocket-bridge.js';
import { CliUsageError, formatError } from './errors.js';
import { createMcpServer } from './mcp-server.js';
import { SerialScheduler } from './serial-scheduler.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { TOOL_MANIFEST } from './manifest.js';

const VERSION = '0.1.0';

function printHelp(): void {
  process.stdout.write(`Godot MCP Pro bridge ${VERSION}\n\n`);
  process.stdout.write('Usage:\n');
  process.stdout.write('  godot-mcp-pro                 Start the MCP stdio server\n');
  process.stdout.write('  godot-mcp-pro status           Show the editor bridge status\n');
  process.stdout.write('  godot-mcp-pro project info     Show project information\n');
  process.stdout.write('  godot-mcp-pro scene tree       Show the current scene tree\n');
  process.stdout.write('  godot-mcp-pro --help           Show this help\n');
  process.stdout.write('  godot-mcp-pro --version        Show the version\n');
}

function runCli(args: string[]): void {
  if (args.includes('call') || args.includes('invoke') || args.includes('exec')) {
    throw new CliUsageError('Dynamic call commands are not supported; use an explicit domain command.');
  }
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    printHelp();
    return;
  }
  if (args[0] === '--version' || args[0] === '-v') {
    process.stdout.write(`${VERSION}\n`);
    return;
  }
  if (args[0] === 'status') {
    const config = loadConfig();
    process.stdout.write(`${JSON.stringify({
      connected: false,
      host: config.host,
      port: config.port,
      tools: TOOL_MANIFEST.length,
      message: 'WebSocket bridge is not implemented yet',
    })}\n`);
    return;
  }
  throw new CliUsageError(`Unknown command: ${args.join(' ')}`);
}

async function runMcpServer(): Promise<void> {
  const config = loadConfig();
  const bridge = new GodotWebSocketBridge(config);
  bridge.on('error', (error: Error) => {
    if (config.logLevel !== 'silent') {
      process.stderr.write(`godot-mcp-pro: ${formatError(error)}\n`);
    }
  });
  await bridge.start();

  const server = createMcpServer(bridge, new SerialScheduler());
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
    runCli(args);
    return;
  }
  await runMcpServer();
}

main().catch((error: unknown) => {
  process.stderr.write(`godot-mcp-pro: ${formatError(error)}\n`);
  process.exitCode = error instanceof CliUsageError ? error.exitCode : 1;
});
