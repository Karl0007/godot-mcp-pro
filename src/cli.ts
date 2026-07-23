import { loadConfig, type BridgeConfig } from './config.js';
import { CliUsageError, formatError } from './errors.js';
import { GodotWebSocketBridge, type BridgeStatus } from './godot-websocket-bridge.js';
import { findTool, TOOL_MANIFEST, type ToolManifestEntry } from './manifest.js';
import { SerialScheduler } from './serial-scheduler.js';
import { RequestLogger } from './request-logger.js';

export const VERSION = '0.1.0';

export type CliRequest =
  | { kind: 'help' }
  | { kind: 'version' }
  | { kind: 'status'; json: boolean; timeoutMs?: number }
  | { kind: 'doctor'; json: boolean; timeoutMs?: number }
  | { kind: 'alias'; tool: ToolManifestEntry; params: Record<string, unknown>; json: boolean; timeoutMs?: number };

export interface CliDependencies {
  loadConfig?: () => BridgeConfig;
  createBridge?: (config: BridgeConfig) => GodotWebSocketBridge;
  createScheduler?: () => SerialScheduler;
  writeStdout?: (text: string) => void;
  writeStderr?: (text: string) => void;
}

const aliasEntries = TOOL_MANIFEST.filter((tool) => tool.cli);
const aliasByPath = new Map(aliasEntries.map((tool) => [tool.cli!.path.join(' '), tool]));

export function findCliTool(path: string[]): ToolManifestEntry | undefined {
  return aliasByPath.get(path.join(' '));
}

export function parseCliArgs(args: string[]): CliRequest {
  if (args.length === 0) return { kind: 'help' };
  if (args[0] === 'call' || args[0] === 'invoke' || args[0] === 'exec') {
    throw new CliUsageError('Dynamic call commands are not supported; use an explicit domain command.');
  }
  if (args[0] === '--help' || args[0] === '-h') {
    if (args.length !== 1) throw new CliUsageError('Unexpected arguments after --help');
    return { kind: 'help' };
  }
  if (args[0] === '--version' || args[0] === '-v') {
    if (args.length !== 1) throw new CliUsageError('Unexpected arguments after --version');
    return { kind: 'version' };
  }

  const first = args[0];
  if (first === 'status' || first === 'doctor') {
    const options = parseGlobalOptions(args.slice(1));
    return { kind: first, json: options.json, ...(options.timeoutMs === undefined ? {} : { timeoutMs: options.timeoutMs }) };
  }

  let tool: ToolManifestEntry | undefined;
  let consumed = 0;
  for (const candidate of aliasEntries) {
    const path = candidate.cli!.path;
    if (path.length <= consumed || path.length > args.length) continue;
    if (path.every((part, index) => args[index] === part) && path.length > consumed) {
      tool = candidate;
      consumed = path.length;
    }
  }
  if (!tool) throw new CliUsageError(`Unknown command: ${args.join(' ')}`);

  const parsed = parseAliasOptions(args.slice(consumed), tool);
  return {
    kind: 'alias',
    tool,
    params: parsed.params,
    json: parsed.json,
    ...(parsed.timeoutMs === undefined ? {} : { timeoutMs: parsed.timeoutMs }),
  };
}

export async function executeCli(request: CliRequest, dependencies: CliDependencies = {}): Promise<void> {
  const stdout = dependencies.writeStdout ?? ((text: string) => process.stdout.write(text));
  const configLoader = dependencies.loadConfig ?? loadConfig;

  if (request.kind === 'help') {
    stdout(helpText());
    return;
  }
  if (request.kind === 'version') {
    stdout(`${VERSION}\n`);
    return;
  }

  const config = configLoader();
  const bridge = (dependencies.createBridge ?? ((bridgeConfig) => new GodotWebSocketBridge(bridgeConfig)))(config);
  bridge.on('error', (error: Error) => {
    if (config.logLevel !== 'silent') (dependencies.writeStderr ?? ((text: string) => process.stderr.write(text)))(`godot-mcp-pro: ${formatError(error)}\n`);
  });

  await bridge.start();
  try {
    if (request.kind === 'status' || request.kind === 'doctor') {
      const status = bridge.status();
      const logger = new RequestLogger({ stateDir: config.stateDir, port: config.port });
      const result = {
        ...status,
        tool_count: TOOL_MANIFEST.length,
        state_dir: logger.stateDir,
        log_file: logger.logFile,
        artifact_dir: logger.artifactDir,
        recent_logs: logger.recent(10),
        recent_errors: logger.recentErrors(10),
      };
      stdout(`${request.json ? JSON.stringify(result) : formatStatus(result)}\n`);
      return;
    }

    const scheduler = (dependencies.createScheduler ?? (() => new SerialScheduler()))();
    const result = await scheduler.enqueue(() => bridge.call(request.tool.name, request.params, request.timeoutMs ?? config.requestTimeoutMs));
    stdout(`${request.json ? JSON.stringify(result) : formatResult(result)}\n`);
  } finally {
    await bridge.stop();
  }
}

export function helpText(): string {
  const aliases = aliasEntries
    .map((tool) => `  godot-mcp-pro ${tool.cli!.path.join(' ')}${tool.cli!.summary ? `  ${tool.cli!.summary}` : ''}`)
    .join('\n');
  return `Godot MCP Pro bridge ${VERSION}\n\nUsage:\n  godot-mcp-pro                 Start the MCP stdio server\n  godot-mcp-pro status           Show the editor bridge status\n  godot-mcp-pro doctor           Diagnose the editor bridge\n${aliases}\n  godot-mcp-pro --help           Show this help\n  godot-mcp-pro --version        Show the version\n\nOptions:\n  --json                         Print machine-readable JSON\n  --timeout <milliseconds>       Set the Godot request timeout\n`;
}

function parseAliasOptions(args: string[], tool: ToolManifestEntry): { params: Record<string, unknown>; json: boolean; timeoutMs?: number } {
  const properties = (tool.inputSchema.properties ?? {}) as Record<string, { type?: string }>;
  const params: Record<string, unknown> = {};
  let json = false;
  let jsonSeen = false;
  let timeoutMs: number | undefined;
  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (!token.startsWith('--')) throw new CliUsageError(`Unexpected positional argument '${token}'`);
    const option = token.slice(2);
    if (!option) throw new CliUsageError('Empty option name');
    if (option === 'json') {
      if (token.includes('=')) throw new CliUsageError('--json does not take a value');
      if (jsonSeen) throw new CliUsageError('--json was specified more than once');
      jsonSeen = true;
      json = true;
      continue;
    }
    if (option === 'timeout' || option.startsWith('timeout=')) {
      if (timeoutMs !== undefined) throw new CliUsageError('--timeout was specified more than once');
      const inline = option.startsWith('timeout=') ? option.slice('timeout='.length) : undefined;
      const raw = inline ?? args[++index];
      timeoutMs = parsePositiveInteger(raw, '--timeout');
      continue;
    }
    const equals = option.indexOf('=');
    const name = equals >= 0 ? option.slice(0, equals) : option;
    if (!Object.hasOwn(properties, name)) throw new CliUsageError(`Unknown option '--${name}' for ${tool.cli!.path.join(' ')}`);
    if (Object.hasOwn(params, name)) throw new CliUsageError(`Option '--${name}' was specified more than once`);
    const schema = properties[name] as { type?: string };
    let raw: string | undefined = equals >= 0 ? option.slice(equals + 1) : undefined;
    if (raw === undefined && schema.type === 'boolean' && (args[index + 1] === undefined || args[index + 1].startsWith('--'))) {
      params[name] = true;
      continue;
    }
    if (raw === undefined) {
      raw = args[++index];
      if (raw === undefined || raw.startsWith('--')) throw new CliUsageError(`Option '--${name}' requires a value`);
    }
    params[name] = parseOptionValue(name, raw, schema.type);
  }

  const required = Array.isArray(tool.inputSchema.required) ? tool.inputSchema.required : [];
  for (const name of required) {
    if (!Object.hasOwn(params, name)) throw new CliUsageError(`Missing required option '--${name}'`);
  }
  return { params, json, ...(timeoutMs === undefined ? {} : { timeoutMs }) };
}

function parseGlobalOptions(args: string[]): { json: boolean; timeoutMs?: number } {
  let json = false;
  let jsonSeen = false;
  let timeoutMs: number | undefined;
  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token === '--json') {
      if (jsonSeen) throw new CliUsageError('--json was specified more than once');
      jsonSeen = true;
      json = true;
      continue;
    }
    if (token === '--timeout' || token.startsWith('--timeout=')) {
      if (timeoutMs !== undefined) throw new CliUsageError('--timeout was specified more than once');
      const raw = token.startsWith('--timeout=') ? token.slice('--timeout='.length) : args[++index];
      timeoutMs = parsePositiveInteger(raw, '--timeout');
      continue;
    }
    throw new CliUsageError(`Unknown option '${token}'`);
  }
  return { json, ...(timeoutMs === undefined ? {} : { timeoutMs }) };
}

function parsePositiveInteger(raw: string | undefined, option: string): number {
  if (!raw || !/^\d+$/.test(raw) || Number(raw) <= 0) throw new CliUsageError(`${option} must be a positive integer`);
  return Number(raw);
}

function parseOptionValue(name: string, raw: string, type?: string): unknown {
  if (!type) {
    try { return JSON.parse(raw); } catch { return raw; }
  }
  if (type === 'string') return raw;
  if (type === 'boolean') {
    if (raw === 'true') return true;
    if (raw === 'false') return false;
    throw new CliUsageError(`Option '--${name}' must be true or false`);
  }
  if (type === 'integer') {
    if (!/^-?\d+$/.test(raw)) throw new CliUsageError(`Option '--${name}' must be an integer`);
    return Number(raw);
  }
  if (type === 'number') {
    const value = Number(raw);
    if (!Number.isFinite(value)) throw new CliUsageError(`Option '--${name}' must be a number`);
    return value;
  }
  if (type === 'object' || type === 'array') {
    let value: unknown;
    try { value = JSON.parse(raw); } catch { throw new CliUsageError(`Option '--${name}' must be valid JSON`); }
    if (type === 'object' && (typeof value !== 'object' || value === null || Array.isArray(value))) throw new CliUsageError(`Option '--${name}' must be a JSON object`);
    if (type === 'array' && !Array.isArray(value)) throw new CliUsageError(`Option '--${name}' must be a JSON array`);
    return value;
  }
  return raw;
}

function formatStatus(status: BridgeStatus & { tool_count: number; state_dir: string; log_file: string; artifact_dir: string }): string {
  return `connected=${status.connected} session=${status.session ?? 'none'} host=${status.host} port=${status.port} pending=${status.pending} tool_count=${status.tool_count} state_dir=${status.state_dir} log_file=${status.log_file} artifact_dir=${status.artifact_dir}`;
}

function formatResult(result: unknown): string {
  if (typeof result === 'string') return result;
  return JSON.stringify(result) ?? 'null';
}
