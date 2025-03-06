import {SOURCE, dataURL} from '../lib/index.js';
import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'ava';
import url from 'node:url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('examples', async t => {
  const examples = await fs.readFile(path.join(__dirname, 'examples.txt'), 'utf8');
  for (const ex of examples.split('\n')) {
    if (ex) {
      t.truthy(dataURL(ex), ex);
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
