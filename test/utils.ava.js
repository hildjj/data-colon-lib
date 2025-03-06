import {asciiToUint8Array} from '../lib/utils.js';
import test from 'ava';

test('asciiToUint8Array', t => {
  t.throws(() => asciiToUint8Array('\u{256}'));
});
