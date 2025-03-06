import {asciiToUint8Array} from '../lib/utils.js';
import assert from 'node:assert';
import test from 'node:test';

test('asciiToUint8Array', () => {
  assert.throws(() => asciiToUint8Array('\u{256}'));
});
