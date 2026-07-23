import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const addonPath = resolve(process.env.GODOT_MCP_PRO_ADDON_PATH ?? 'C:/Godot/MCP/godot-mcp-pro/addons/godot_mcp');
const commandsPath = join(addonPath, 'commands');
const outputPath = resolve(process.env.GODOT_MCP_PRO_MANIFEST_PATH ?? join(process.cwd(), 'src/generated-manifest.ts'));

interface PropertySchema {
  type: string;
  description?: string;
  items?: Record<string, unknown>;
  properties?: Record<string, unknown>;
}

interface ManifestEntry {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, PropertySchema>;
    required?: string[];
    additionalProperties: false;
  };
  cli?: { path: string[]; summary: string };
  risk: 'read' | 'write' | 'destructive' | 'code';
}

const cliAliases: Record<string, { path: string[]; summary: string }> = {
  get_project_info: { path: ['project', 'info'], summary: 'Show project information' },
  get_filesystem_tree: { path: ['project', 'tree'], summary: 'Show the project filesystem tree' },
  get_project_settings: { path: ['project', 'settings'], summary: 'Show project settings' },
  get_scene_tree: { path: ['scene', 'tree'], summary: 'Show the current scene tree' },
  create_scene: { path: ['scene', 'create'], summary: 'Create a scene' },
  open_scene: { path: ['scene', 'open'], summary: 'Open a scene' },
  save_scene: { path: ['scene', 'save'], summary: 'Save the current scene' },
  play_scene: { path: ['scene', 'play'], summary: 'Play a scene' },
  stop_scene: { path: ['scene', 'stop'], summary: 'Stop the running scene' },
  add_node: { path: ['node', 'add'], summary: 'Add a node to the current scene' },
  delete_node: { path: ['node', 'delete'], summary: 'Delete a node from the current scene' },
  update_property: { path: ['node', 'set-property'], summary: 'Update a node property' },
  get_node_properties: { path: ['node', 'get-property'], summary: 'Read node properties' },
  read_script: { path: ['script', 'read'], summary: 'Read a script' },
  create_script: { path: ['script', 'create'], summary: 'Create a script' },
  edit_script: { path: ['script', 'edit'], summary: 'Edit a script' },
  validate_script: { path: ['script', 'validate'], summary: 'Validate a script' },
  get_game_scene_tree: { path: ['game', 'tree'], summary: 'Show the running game scene tree' },
  get_game_node_properties: { path: ['game', 'inspect'], summary: 'Inspect a running game node' },
  get_game_screenshot: { path: ['game', 'screenshot'], summary: 'Capture the running game' },
  simulate_key: { path: ['game', 'input', 'key'], summary: 'Simulate a key event' },
  simulate_action: { path: ['game', 'input', 'action'], summary: 'Simulate an input action' },
  run_test_scenario: { path: ['test', 'run'], summary: 'Run a test scenario' },
  list_export_presets: { path: ['export', 'list'], summary: 'List export presets' },
  get_export_info: { path: ['export', 'info'], summary: 'Show export information' },
  export_project: { path: ['export', 'project'], summary: 'Prepare a project export' },
};

const exactStringFields = new Set([
  'action', 'animation', 'button', 'code', 'file_path', 'filter', 'group_filter', 'key', 'keycode', 'mode',
  'name', 'node_path', 'path', 'pattern', 'player_path', 'property', 'query', 'scene_path', 'script',
  'script_filter', 'signal_name', 'type', 'type_filter', 'uid', 'value', 'camera_path', 'resource_type',
  'shader_path', 'preset_name', 'root_type', 'root_name', 'method', 'text', 'target', 'parent_path',
]);
const objectFields = new Set(['position', 'rotation_degrees', 'look_at', 'target', 'stylebox', 'environment']);
const arrayFields = new Set(['actions', 'children', 'events', 'groups', 'nodes', 'node_paths', 'properties', 'replacements', 'signal_filter', 'steps']);
const booleanFields = new Set(['allow_unsafe_editor_io', 'alt', 'auto_release', 'debug', 'double_click', 'dry_run', 'exclude_addons', 'force', 'half_resolution', 'include_addons', 'include_builtin', 'launch', 'loop', 'named_only', 'one_shot', 'partial', 'pressed', 'recursive', 'run', 'shift', 'skip_export', 'ctrl']);
const integerFields = new Set(['alternative', 'atlas_x', 'atlas_y', 'button', 'button_mask', 'count', 'duration_ms', 'frame_count', 'frame_delay', 'frame_interval', 'index', 'layer', 'max_count', 'max_depth', 'max_lines', 'max_results', 'preset_index', 'source_id', 'surface_index', 'threshold']);
const numberSuffixes = ['_angle', '_attenuation', '_damping', '_db', '_density', '_depth', '_distance', '_easing', '_energy', '_explosiveness', '_far', '_feedback', '_fov', '_gain', '_height', '_hz', '_intensity', '_lifetime', '_length', '_mix', '_ms', '_near', '_radius', '_ratio', '_scale', '_size', '_speed', '_spread', '_strength', '_time', '_us', '_value', '_velocity', '_width', '_x', '_y', '_z'];

function inferType(name: string): PropertySchema {
  if (objectFields.has(name)) return { type: 'object', additionalProperties: true } as PropertySchema;
  if (arrayFields.has(name)) return { type: 'array', items: {} };
  if (booleanFields.has(name) || name.startsWith('is_') || name.startsWith('use_') || name.endsWith('_enabled') || name.endsWith('_active')) return { type: 'boolean' };
  if (integerFields.has(name) || name.endsWith('_index') || name.endsWith('_count') || name.endsWith('_id') || name.endsWith('_mask')) return { type: 'integer' };
  if (numberSuffixes.some((suffix) => name.endsWith(suffix))) return { type: 'number' };
  if (exactStringFields.has(name) || name.endsWith('_path') || name.endsWith('_name') || name.endsWith('_type')) return { type: 'string' };
  return {} as PropertySchema;
}

function riskFor(name: string): ManifestEntry['risk'] {
  if (name.includes('execute_') || name.includes('script') || name.includes('shader')) return 'code';
  if (/(delete|remove|clear|stress)/.test(name)) return 'destructive';
  if (/^(get|list|read|find|search|analyze|detect|validate|compare|uid_to|project_path_to|assert)/.test(name)) return 'read';
  return 'write';
}

function descriptionFor(name: string): string {
  return name.replaceAll('_', ' ').replace(/^./, (char) => char.toUpperCase());
}

function extractFunctions(source: string): Map<string, string> {
  const functions = new Map<string, string>();
  const boundaries = [...source.matchAll(/^func _[A-Za-z0-9_]+\([^\n]*$/gm)];
  for (let index = 0; index < boundaries.length; index += 1) {
    const match = boundaries[index];
    const handler = match[0].match(/^func (_[A-Za-z0-9_]+)\(params: Dictionary\) -> Dictionary:/);
    if (!handler) continue;
    const start = match.index ?? 0;
    const bodyStart = start + match[0].length;
    const next = boundaries[index + 1]?.index ?? source.length;
    functions.set(handler[1], source.slice(bodyStart, next));
  }
  return functions;
}

function addProperty(properties: Record<string, PropertySchema>, name: string): void {
  if (!properties[name]) properties[name] = inferType(name);
}

function parseEntry(name: string, handler: string, body: string): ManifestEntry {
  const properties: Record<string, PropertySchema> = {};
  const required = new Set<string>();
  for (const match of body.matchAll(/params\.(?:has|get)\(\s*"([^"]+)"/g)) addProperty(properties, match[1]);
  for (const match of body.matchAll(/params\["([^"]+)"\]/g)) addProperty(properties, match[1]);

  const typeFor = (type: string): PropertySchema => {
    if (type === 'bool') return { type: 'boolean' };
    if (type === 'int') return { type: 'integer' };
    if (type === 'float') return { type: 'number' };
    if (type === 'String') return { type: 'string' };
    if (type === 'Dictionary') return { type: 'object', additionalProperties: true } as PropertySchema;
    if (type === 'Array') return { type: 'array', items: {} };
    return { type };
  };
  const inferredTypes = new Map<string, PropertySchema>();
  const setInferredType = (key: string, type: string): void => {
    inferredTypes.set(key, typeFor(type));
  };
  for (const match of body.matchAll(/_?optional_(string|bool|int|float)\(params,\s*"([^"]+)"/g)) {
    const [, type, key] = match;
    setInferredType(key, type === 'string' ? 'String' : type);
  }
  for (const match of body.matchAll(/_parse_(?:vector3|color)_param\(params,\s*"([^"]+)"/g)) setInferredType(match[1], 'Dictionary');
  for (const match of body.matchAll(/params\["([^"]+)"\]\s+is\s+(Array|Dictionary)/g)) setInferredType(match[1], match[2]);
  for (const match of body.matchAll(/(?:float|int|bool|str)\(\s*params\.(?:get|has)\(\s*"([^"]+)"/g)) {
    const cast = match[0].match(/^(float|int|bool|str)/)?.[1] ?? 'str';
    setInferredType(match[1], cast === 'str' ? 'String' : cast);
  }
  for (const match of body.matchAll(/(?:float|int|bool|str)\(\s*params\[\s*"([^"]+)"\s*\]/g)) {
    const cast = match[0].match(/^(float|int|bool|str)/)?.[1] ?? 'str';
    setInferredType(match[1], cast === 'str' ? 'String' : cast);
  }
  for (const match of body.matchAll(/(?:var|const)\s+\w+\s*:\s*(String|bool|int|float|Dictionary|Array)\s*=\s*params\.(?:get|has)\(\s*"([^"]+)"/g)) setInferredType(match[2], match[1]);
  for (const match of body.matchAll(/(?:var|const)\s+\w+\s*:\s*(String|bool|int|float|Dictionary|Array)\s*=\s*params\[\s*"([^"]+)"\s*\]/g)) setInferredType(match[2], match[1]);
  for (const match of body.matchAll(/params\.get\(\s*"([^"]+)"\s*,\s*(\{\}|\[\]|true|false|-?\d+(?:\.\d+)?)/g)) {
    const defaultValue = match[2];
    setInferredType(match[1], defaultValue === '{}' ? 'Dictionary' : defaultValue === '[]' ? 'Array' : /^(true|false)$/.test(defaultValue) ? 'bool' : defaultValue.includes('.') ? 'float' : 'int');
  }
  for (const [key, schema] of inferredTypes) properties[key] = schema;

  for (const match of body.matchAll(/require_string\(params,\s*"([^"]+)"\)/g)) {
    addProperty(properties, match[1]);
    properties[match[1]] = { type: 'string' };
    required.add(match[1]);
  }
  for (const match of body.matchAll(/_?optional_(string|bool|int|float)\(params,\s*"([^"]+)"/g)) {
    const [, type, key] = match;
    addProperty(properties, key);
    properties[key] = typeFor(type === 'string' ? 'String' : type);
  }

  const bodyLines = body.split('\n').filter((line) => line.trim().length > 0);
  const baseIndent = bodyLines.length > 0 ? Math.min(...bodyLines.map((line) => line.match(/^[ \t]*/)?.[0].length ?? 0)) : 0;
  for (const match of body.matchAll(/^([ \t]*)if not params\.has\(\s*"([^"]+)"\)/gm)) {
    if (match[1].length !== baseIndent) continue;
    addProperty(properties, match[2]);
    required.add(match[2]);
  }
  for (const match of body.matchAll(/params\["([^"]+)"\]\s+is\s+(Array|Dictionary)/g)) {
    addProperty(properties, match[1]);
    properties[match[1]] = match[2] === 'Array' ? { type: 'array', items: {} } : { type: 'object', additionalProperties: true } as PropertySchema;
  }
  const requiredList = [...required].filter((key) => properties[key]);
  return {
    name,
    description: descriptionFor(name),
    inputSchema: {
      type: 'object',
      properties,
      ...(requiredList.length > 0 ? { required: requiredList } : {}),
      additionalProperties: false,
    },
    ...(cliAliases[name] ? { cli: cliAliases[name] } : {}),
    risk: riskFor(name),
  };
}

const entries: ManifestEntry[] = [];
for (const filename of readdirSync(commandsPath).filter((item) => item.endsWith('.gd')).sort()) {
  const source = readFileSync(join(commandsPath, filename), 'utf8');
  const commandBlock = source.match(/func get_commands\(\) -> Dictionary:\s*return \{([\s\S]*?)\n\s*\}/);
  if (!commandBlock) continue;
  const functions = extractFunctions(source);
  for (const match of commandBlock[1].matchAll(/"([^"]+)"\s*:\s*(_[A-Za-z0-9_]+)/g)) {
    const [, name, handler] = match;
    entries.push(parseEntry(name, handler, functions.get(handler) ?? ''));
  }
}

const unique = new Map(entries.map((entry) => [entry.name, entry]));
const sorted = [...unique.values()].sort((a, b) => a.name.localeCompare(b.name));
const output = `// Generated from ${commandsPath.replaceAll('\\', '/')} by scripts/generate-manifest.ts.\nimport type { ToolManifestEntry } from './manifest.js';\n\nexport const GENERATED_TOOL_MANIFEST: readonly ToolManifestEntry[] = ${JSON.stringify(sorted, null, 2)} as const;\n`;
writeFileSync(outputPath, output);
console.log(`Generated ${sorted.length} tools at ${outputPath}`);
