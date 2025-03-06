import {Buffer} from 'node:buffer';
import {DataURL} from '../lib/types.js';
import test from 'ava';

test('create', t => {
  let d = new DataURL();
  t.is(d.toString(), 'data:text/plain;charset=US-ASCII,');
  d = new DataURL('foo');
  t.is(d.toString(), 'data:text/plain;charset=US-ASCII,foo');
  d = new DataURL('foo', {mediatype: ''});
  t.is(d.toString(), 'data:text/plain;charset=US-ASCII,foo');
  d = new DataURL('foo%ff', {encoding: 'percent', mediatype: 'text/plain;k=v'});
  t.is(d.toString(), 'data:text/plain;k=v,foo%ff');
  d = new DataURL(Buffer.from('foo\xff', 'ascii'), {base64: true, mediatype: 'text/plain'});
  t.is(d.toString(), 'data:text/plain;base64,Zm9v/w==');
});
