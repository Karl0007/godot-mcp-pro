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

export const TOOL_MANIFEST: readonly ToolManifestEntry[] = [];

export function findTool(name: string): ToolManifestEntry | undefined {
  return TOOL_MANIFEST.find((tool) => tool.name === name);
}
