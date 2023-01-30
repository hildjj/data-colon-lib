import test from 'ava'
import {DataURL} from '../lib/types.js'

test('create', t => {
  t.throws(() => new DataURL())
  let d = new DataURL({ data: 'foo' })
  t.is(d.toString(), 'data:text/plain;charset=US-ASCII,foo')
  d = new DataURL({ data: 'foo', mediatype: ''})
  t.is(d.toString(), 'data:text/plain;charset=US-ASCII,foo')
  d = new DataURL({ data: 'foo%ff', mediatype: 'text/plain;k=v'})
  t.is(d.toString(), 'data:text/plain;k=v,foo%ff')
  d = new DataURL({ data: Buffer.from('foo\xff', 'ascii'), base64: true, mediatype: 'text/plain'})
  t.is(d.toString(), 'data:text/plain;base64,Zm9v/w==')
})
