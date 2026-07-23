export interface BridgeConfig {
  host: string;
  port: number;
  connectionTimeoutMs: number;
  requestTimeoutMs: number;
  logLevel: 'silent' | 'error' | 'info' | 'debug';
}

const DEFAULT_CONFIG: BridgeConfig = {
  host: '127.0.0.1',
  port: 6505,
  connectionTimeoutMs: 10_000,
  requestTimeoutMs: 30_000,
  logLevel: 'error',
};

function positiveInt(value: string | undefined, fallback: number): number {
  if (value === undefined || !/^\d+$/.test(value)) return fallback;
  const parsed = Number(value);
  return parsed > 0 ? parsed : fallback;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): BridgeConfig {
  const port = positiveInt(env.GODOT_MCP_PRO_PORT, DEFAULT_CONFIG.port);
  if (port < 6505 || port > 6509) {
    throw new Error('GODOT_MCP_PRO_PORT must be between 6505 and 6509');
  }

  const logLevel = env.GODOT_MCP_PRO_LOG_LEVEL ?? DEFAULT_CONFIG.logLevel;
  if (!['silent', 'error', 'info', 'debug'].includes(logLevel)) {
    throw new Error('GODOT_MCP_PRO_LOG_LEVEL must be silent, error, info, or debug');
  }

  return {
    host: env.GODOT_MCP_PRO_HOST ?? DEFAULT_CONFIG.host,
    port,
    connectionTimeoutMs: positiveInt(env.GODOT_MCP_PRO_CONNECTION_TIMEOUT, DEFAULT_CONFIG.connectionTimeoutMs),
    requestTimeoutMs: positiveInt(env.GODOT_MCP_PRO_REQUEST_TIMEOUT, DEFAULT_CONFIG.requestTimeoutMs),
    logLevel: logLevel as BridgeConfig['logLevel'],
  };
}
