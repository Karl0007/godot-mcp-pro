import test from 'node:test';
import assert from 'node:assert/strict';
import { SerialScheduler } from '../dist/src/serial-scheduler.js';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test('scheduler executes operations in FIFO order', async () => {
  const scheduler = new SerialScheduler();
  const events = [];
  const first = scheduler.enqueue(async () => {
    events.push('first:start');
    await wait(20);
    events.push('first:end');
    return 1;
  });
  const second = scheduler.enqueue(async () => {
    events.push('second:start');
    events.push('second:end');
    return 2;
  });

  assert.deepEqual(await Promise.all([first, second]), [1, 2]);
  assert.deepEqual(events, ['first:start', 'first:end', 'second:start', 'second:end']);
});

test('scheduler continues FIFO queue after a rejected operation', async () => {
  const scheduler = new SerialScheduler();
  const events = [];
  const rejected = scheduler.enqueue(async () => {
    events.push('rejected:start');
    await wait(10);
    events.push('rejected:end');
    throw new Error('expected failure');
  });
  const continued = scheduler.enqueue(async () => {
    events.push('continued:start');
    events.push('continued:end');
    return 'continued';
  });

  await assert.rejects(rejected, /expected failure/);
  assert.equal(await continued, 'continued');
  assert.deepEqual(events, [
    'rejected:start',
    'rejected:end',
    'continued:start',
    'continued:end',
  ]);
});
