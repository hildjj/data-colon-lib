import {DataURL, dataURL} from '../lib/index.js';
import {asciiToUint8Array} from '../lib/utils.js';
import assert from 'node:assert';
import fs from 'node:fs/promises';
import test from 'node:test';

test('examples', async() => {
  const examples = await fs.readFile(
    new URL('examples.txt', import.meta.url),
    'utf8'
  );
  let line = 0;
  for (const ex of examples.split('\n')) {
    line++;
    if (ex) {
      assert.ok(dataURL(ex), `Line ${line}: ${ex}`);
    }
  }
});

test('error', () => {
  const inp = 'data:';
  try {
    dataURL(inp);
    assert.fail('Cannot reach');
  } catch (ex) {
    assert.equal(ex.message, `\
Error: Expected ",", ";", ";base64", "application", "audio", "example", "font", "image", "message", "model", "multipart", "text", "video", or "x-" but end of input found.
 --> dataURL source:1:6
  |
1 | data:
  |      ^`);
  }
});

test('create', () => {
  let d = new DataURL();
  assert.equal(d.toString(), 'data:text/plain;charset=US-ASCII,');
  d = new DataURL('foo');
  assert.equal(d.toString(), 'data:text/plain;charset=US-ASCII,foo');
  d = new DataURL('foo', {mediatype: ''});
  assert.equal(d.toString(), 'data:text/plain;charset=US-ASCII,foo');
  d = new DataURL('foo%ff', {encoding: 'percent', mediatype: 'text/plain;k=v'});
  assert.equal(d.toString(), 'data:text/plain;k=v,foo%ff');
  d = new DataURL(asciiToUint8Array('foo\xff'), {base64: true, mediatype: 'text/plain'});
  assert.equal(d.toString(), 'data:text/plain;base64,Zm9v/w==');
  d = new DataURL('foo', '');
  assert.equal(d.toString(), 'data:text/plain;charset=US-ASCII,foo');
});
