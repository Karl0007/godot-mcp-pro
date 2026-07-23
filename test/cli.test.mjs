import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { findCliTool, parseCliArgs } from '../dist/src/cli.js';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const entry = join(root, 'dist', 'src', 'main.js');

function run(args) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [entry, ...args], { cwd: root });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.on('close', (code) => resolve({ code, stdout, stderr }));
  });
}

test('help is available', async () => {
  const result = await run(['--help']);
  assert.equal(result.code, 0);
  assert.match(result.stdout, /Usage:/);
});

test('dynamic call is rejected', async () => {
  const result = await run(['call', 'get_project_info']);
  assert.equal(result.code, 2);
  assert.match(result.stderr, /Dynamic call commands are not supported/);
});

test('unknown commands are rejected', async () => {
  const result = await run(['unknown']);
  assert.equal(result.code, 2);
  assert.match(result.stderr, /Unknown command/);
});

test('all explicit aliases resolve to fixed manifest tools', () => {
  const aliases = [
    ['project', 'info'], ['project', 'tree'], ['project', 'settings'],
    ['scene', 'tree'], ['scene', 'create'], ['scene', 'open'], ['scene', 'save'], ['scene', 'play'], ['scene', 'stop'],
    ['node', 'add'], ['node', 'delete'], ['node', 'set-property'], ['node', 'get-property'],
    ['script', 'read'], ['script', 'create'], ['script', 'edit'], ['script', 'validate'],
    ['game', 'tree'], ['game', 'inspect'], ['game', 'screenshot'], ['game', 'input', 'key'], ['game', 'input', 'action'],
    ['test', 'run'], ['export', 'list'], ['export', 'info'], ['export', 'project'],
  ];
  for (const alias of aliases) {
    const tool = findCliTool(alias);
    assert.ok(tool, `${alias.join(' ')} should resolve`);
    assert.deepEqual(tool.cli.path, alias);
  }
});

test('parser converts typed options and global flags', () => {
  const request = parseCliArgs(['node', 'set-property', '--node_path', '/root', '--property', 'position', '--value', '{"x":1}', '--json', '--timeout', '2500']);
  assert.equal(request.kind, 'alias');
  assert.equal(request.tool.name, 'update_property');
  assert.deepEqual(request.params, { node_path: '/root', property: 'position', value: { x: 1 } });
  assert.equal(request.json, true);
  assert.equal(request.timeoutMs, 2500);
});

test('parser rejects unknown options and positional arguments', () => {
  assert.throws(() => parseCliArgs(['project', 'info', '--unknown', 'value']), /Unknown option/);
  assert.throws(() => parseCliArgs(['project', 'info', 'extra']), /Unexpected positional argument/);
  assert.throws(() => parseCliArgs(['scene', 'tree', '--timeout', '0']), /positive integer/);
});
