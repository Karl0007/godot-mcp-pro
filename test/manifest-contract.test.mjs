import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { TOOL_MANIFEST } from '../dist/src/manifest.js';

const addonPath = resolve(process.env.GODOT_MCP_PRO_ADDON_PATH ?? 'C:/Godot/MCP/godot-mcp-pro/addons/godot_mcp');
const commandsPath = join(addonPath, 'commands');

function sourceCommandNames() {
  const names = [];
  for (const filename of readdirSync(commandsPath).filter((item) => item.endsWith('.gd')).sort()) {
    const source = readFileSync(join(commandsPath, filename), 'utf8');
    for (const commandBlock of source.matchAll(/func get_commands\(\) -> Dictionary:\s*return \{([\s\S]*?)\n\s*\}/g)) {
      for (const match of commandBlock[1].matchAll(/"([^"]+)"\s*:\s*_[A-Za-z0-9_]+/g)) {
        names.push(match[1]);
      }
    }
  }
  return names;
}

const sourceNames = sourceCommandNames();
const manifestNames = TOOL_MANIFEST.map((tool) => tool.name);

function sorted(values) {
  return [...values].sort((left, right) => left.localeCompare(right));
}

test('generated manifest has exactly the get_commands tool set', () => {
  assert.ok(sourceNames.length > 0, 'No commands were found in the addon get_commands methods');
  assert.deepEqual(sorted(manifestNames), sorted(sourceNames));
});

test('source and manifest tool names are unique', () => {
  assert.equal(new Set(sourceNames).size, sourceNames.length, 'Duplicate tool name in get_commands methods');
  assert.equal(new Set(manifestNames).size, manifestNames.length, 'Duplicate tool name in generated manifest');
});

test('every manifest inputSchema is an object schema with required fields', () => {
  for (const tool of TOOL_MANIFEST) {
    assert.equal(tool.inputSchema?.type, 'object', `${tool.name} inputSchema must have type object`);
    assert.ok(Object.hasOwn(tool.inputSchema, 'properties'), `${tool.name} inputSchema must contain properties`);
    assert.ok(Object.hasOwn(tool.inputSchema, 'additionalProperties'), `${tool.name} inputSchema must contain additionalProperties`);

    if (Object.hasOwn(tool.inputSchema, 'required')) {
      assert.ok(Array.isArray(tool.inputSchema.required), `${tool.name} required must be an array`);
      for (const required of tool.inputSchema.required) {
        assert.ok(Object.hasOwn(tool.inputSchema.properties, required), `${tool.name} required field ${required} is missing from properties`);
      }
    }
  }
});
