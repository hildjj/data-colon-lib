import {SOURCE, dataURL} from '../lib/index.js';
import fs from 'node:fs/promises';
import test from 'ava';

test('examples', async t => {
  const examples = await fs.readFile(
    new URL('examples.txt', import.meta.url),
    'utf8'
  );
  let line = 0;
  for (const ex of examples.split('\n')) {
    line++;
    if (ex) {
      t.truthy(dataURL(ex), `Line ${line}: ${ex}`);
    }
  }
});

test('error', t => {
  const inp = 'data:';
  try {
    dataURL(inp);
  } catch (ex) {
    t.snapshot(ex.format([{source: SOURCE, text: inp}]));
  }
});
