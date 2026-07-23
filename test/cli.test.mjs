import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

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
