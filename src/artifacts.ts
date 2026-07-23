import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

export interface FrameArtifacts {
  artifactDir: string;
  files: string[];
}

export function artifactDirectory(stateDir: string, requestId: unknown): string {
  return join(resolve(stateDir), 'artifacts', stableArtifactId(requestId));
}

export function writeFrameArtifacts(stateDir: string, requestId: unknown, frames: readonly string[]): FrameArtifacts {
  const artifactDir = artifactDirectory(stateDir, requestId);
  mkdirSync(artifactDir, { recursive: true });
  const width = Math.max(3, String(frames.length).length);
  const files = frames.map((frame, index) => {
    const file = join(artifactDir, `frame-${String(index + 1).padStart(width, '0')}.png`);
    writeFileSync(file, Buffer.from(frame.replace(/^data:[^;]+;base64,/, ''), 'base64'));
    return file;
  });
  return { artifactDir, files };
}

export function stableArtifactId(requestId: unknown): string {
  const value = String(requestId ?? '').replace(/[^A-Za-z0-9._-]+/g, '_').replace(/^\.+/, '');
  return value.slice(0, 120) || 'request';
}
