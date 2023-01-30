import { parse } from './grammar.js'
import { DataURL, DataParts } from './types.js'
export { DataURL } from './types.js'

export function dataURL(s: string): DataURL {
  return new DataURL(parse(s, { startRule: 'dataurl' }) as DataParts)
}
