import assert from 'node:assert';
import fs from 'node:fs/promises';
import {parse} from '../lib/grammar.js';
import test from 'node:test';

test('examples', async() => {
  const examples = await fs.readFile(
    new URL('./examples.txt', import.meta.url),
    'utf8'
  );
  for (const ex of examples.split('\n')) {
    if (ex) {
      try {
        const _d = parse(ex, {grammarSource: 'ex'});
      } catch (e) {
        e.message = e.format([{source: 'ex', text: ex}]);
        throw e;
      }
    }
  }
});

test('bad', async() => {
  const bad = await fs.readFile(new URL('bad.txt', import.meta.url), 'utf8');
  for (const ex of bad.split('\n')) {
    if (ex.startsWith('data:')) {
      assert.throws(() => parse(ex));
    }
  }
});
