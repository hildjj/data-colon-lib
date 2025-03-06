import {DataURL, dataURL} from '../lib/index.js';
import {asciiToUint8Array} from '../lib/utils.js';
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
    t.snapshot(ex.message);
  }
});

test('create', t => {
  let d = new DataURL();
  t.is(d.toString(), 'data:text/plain;charset=US-ASCII,');
  d = new DataURL('foo');
  t.is(d.toString(), 'data:text/plain;charset=US-ASCII,foo');
  d = new DataURL('foo', {mediatype: ''});
  t.is(d.toString(), 'data:text/plain;charset=US-ASCII,foo');
  d = new DataURL('foo%ff', {encoding: 'percent', mediatype: 'text/plain;k=v'});
  t.is(d.toString(), 'data:text/plain;k=v,foo%ff');
  d = new DataURL(asciiToUint8Array('foo\xff'), {base64: true, mediatype: 'text/plain'});
  t.is(d.toString(), 'data:text/plain;base64,Zm9v/w==');
  d = new DataURL('foo', '');
  t.is(d.toString(), 'data:text/plain;charset=US-ASCII,foo');
});
