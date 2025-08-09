import assert from 'node:assert';
import {parse} from '../lib/grammar.js';
import {test} from 'node:test';

test('grammar edges', () => {
  assert.throws(() => parse('', {startRule: '___UNK___'}));

  const p = parse('data:,', {
    peg$library: true,
  });
  assert.ok(p);
});
