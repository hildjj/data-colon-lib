import { parse } from './grammar.js'

export interface MediaType {
  type?: string;
  subtype?: string;
  parameters?: { [key: string]: string };
}

export interface DataParts {
  mediatype?: MediaType | string;
  base64?: boolean;
  // If string, it is either base64 ot %-encoded.
  data: Buffer | string;
}

//If <mediatype> is omitted, it defaults to text/plain;charset=US-ASCII.
const DEFAULT_MEDIA: MediaType = {
  type: 'text',
  subtype: 'plain',
  parameters: {
    charset: 'US-ASCII',
  },
}

// uric:
// - alpha
// - digit
// - mark: [-_.!~*'()]
// - reserved: [;/?:@&=+$,]
const URIC = new Set<number>()
const ASMALL = 'a'.charCodeAt(0)
const ZSMALL = 'z'.charCodeAt(0)
const GAP = ASMALL - 'A'.charCodeAt(0)
for (let c = ASMALL; c <= ZSMALL; c++) {
  URIC.add(c)
  URIC.add(c - GAP)
}
for (const c of '0123456789-_.!~*\'();/?:@&=+$,') {
  URIC.add(c.charCodeAt(0))
}

export class DataURL {
  private data: Buffer

  private base64: boolean

  private mediatype: MediaType

  public constructor(input: DataParts) {
    this.base64 = Boolean(input.base64)
    this.data = DataURL._toBuffer(input.data, this.base64)
    this.mediatype = (typeof input.mediatype === 'string') ?
      DataURL._parseMediaType(input.mediatype) :
      input.mediatype ?? DEFAULT_MEDIA
  }

  private static _parseMediaType(mt: string): MediaType {
    if (mt.length === 0) {
      return DEFAULT_MEDIA
    }
    return parse(mt, { startRule: 'mediatype' })
  }

  private static _toBuffer(data: Buffer | string, base64: boolean): Buffer {
    if (typeof data === 'string') {
      if (base64) {
        return Buffer.from(data, 'base64')
      }
      const unescaped = data.replace(/%([0-9a-f]{2})/gi, (_, hex) => {
        return String.fromCharCode(parseInt(hex, 16))
      })
      return Buffer.from(unescaped, 'ascii')
    }
    return data
  }

  public mediaTypeString(): string {
    let ret = `${this.mediatype.type}/${this.mediatype.subtype}`
    if (this.mediatype.parameters) {
      for (const [k, v] of Object.entries(this.mediatype.parameters)) {
        ret += `;${k}=${v}`
      }
    }
    return ret
  }

  public toString(): string {
    return `data:${this.mediaTypeString()}${this.base64 ? ';base64' : ''},${this._dataString()}`
  }

  private _dataString(): string {
    if (this.base64) {
      return this.data.toString('base64')
    }
    let ret = ''
    for (const b of this.data) {
      if (URIC.has(b)) {
        ret += String.fromCharCode(b)
      } else {
        ret += '%'
        ret += b.toString(16).padStart(2, '0')
      }
    }
    return ret
  }
}
