import fs from 'node:fs/promises';
import {parse} from '../lib/grammar.js';
import path from 'node:path';
import test from 'ava';
import url from 'node:url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('examples', async t => {
  const examples = await fs.readFile(path.join(__dirname, 'examples.txt'), 'utf8');
  for (const ex of examples.split('\n')) {
    if (ex) {
      try {
        const _d = parse(ex, {grammarSource: 'ex'});
      } catch (e) {
        t.fail(e.format([{source: 'ex', text: ex}]));
      }
    }
  }
  t.pass();
});

test('bad', async t => {
  const bad = await fs.readFile(path.join(__dirname, 'bad.txt'), 'utf8');
  for (const ex of bad.split('\n')) {
    if (ex.startsWith('data:')) {
      t.throws(() => parse(ex));
    }
  }
});
