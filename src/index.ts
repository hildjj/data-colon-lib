import { parse } from './grammar.js'
import { DataURL, DataParts, SOURCE } from './types.js'
export { DataURL, SOURCE } from './types.js'

export function dataURL(s: string): DataURL {
  const parsed = parse(s, {
    startRule: 'dataurl',
    grammarSource: SOURCE,
  }) as DataParts

  return new DataURL(parsed.data, {
    encoding: parsed.base64 ? 'base64' : 'percent',
    mediatype: parsed.mediatype,
    base64: parsed.base64,
  })
}
