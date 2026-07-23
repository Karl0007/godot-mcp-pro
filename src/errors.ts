export class CliUsageError extends Error {
  readonly exitCode = 2;
}

export class BridgeUnavailableError extends Error {
  readonly exitCode = 3;
}

export class BridgeTimeoutError extends Error {
  readonly exitCode = 4;
}

export function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
