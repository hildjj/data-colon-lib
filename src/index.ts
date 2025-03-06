import {DataURL, SOURCE} from './types.js';
import {parse} from './grammar.js';
export {DataURL, SOURCE} from './types.js';

/**
 * Parse the given data: URL.
 *
 * @param s Input URL.
 * @returns AST.
 */
export function dataURL(s: string): DataURL {
  const parsed = parse(s, {
    startRule: 'dataurl',
    grammarSource: SOURCE,
  });

  return new DataURL(parsed.data, {
    encoding: parsed.base64 ? 'base64' : 'percent',
    mediatype: parsed.mediatype,
    base64: parsed.base64,
  });
}
