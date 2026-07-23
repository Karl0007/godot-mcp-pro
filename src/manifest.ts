export interface ToolManifestEntry {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  cli?: {
    path: string[];
    summary: string;
  };
  risk?: 'read' | 'write' | 'destructive' | 'code';
}

export { GENERATED_TOOL_MANIFEST as TOOL_MANIFEST } from './generated-manifest.js';

import { GENERATED_TOOL_MANIFEST } from './generated-manifest.js';

export function findTool(name: string): ToolManifestEntry | undefined {
  return GENERATED_TOOL_MANIFEST.find((tool) => tool.name === name);
}
