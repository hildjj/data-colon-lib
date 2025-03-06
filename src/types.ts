import {Buffer} from 'node:buffer';
import {parse} from './grammar.js';

export const SOURCE = 'dataURL source';

export interface MediaType {
  type?: string;
  subtype?: string;
  parameters?: {
    [key: string]: string;
  };
}

export interface DataParts {
  data: string;
  base64: boolean;
  mediatype?: MediaType;
}

export type StringEncoding = 'base64' | 'percent' | 'utf8';

export interface DataOptions {
  /**
   * Media type.  Defaults to 'text/plain;charset=US-ASCII' per RFC 2397.
   */
  mediatype?: MediaType | string;

  /**
   * Output formatting, defaults to false.
   */
  base64?: boolean;

  /**
   * Input encoding, if data is string.  Defaults to 'utf8'.
   */
  encoding?: StringEncoding;
}

// If <mediatype> is omitted, it defaults to text/plain;charset=US-ASCII.
const DEFAULT_MEDIA: MediaType = {
  type: 'text',
  subtype: 'plain',
  parameters: {
    charset: 'US-ASCII',
  },
};

// - alpha
// - digit
// - mark: [-_.!~*'()]
// - reserved: [;/?:@&=+$,]
const URIC = new Set<number>();
const ASMALL = 'a'.charCodeAt(0);
const ZSMALL = 'z'.charCodeAt(0);
const GAP = ASMALL - 'A'.charCodeAt(0);
for (let c = ASMALL; c <= ZSMALL; c++) {
  URIC.add(c);
  URIC.add(c - GAP);
}
for (const c of '0123456789-_.!~*\'();/?:@&=+$,') {
  URIC.add(c.charCodeAt(0));
}

export class DataURL {
  private data: Buffer;

  private base64: boolean;

  private mediatype: MediaType;

  public constructor(data: Buffer | string = '', opts: DataOptions = {}) {
    this.base64 = Boolean(opts?.base64);
    this.data = DataURL._toBuffer(data, opts.encoding);
    this.mediatype = (typeof opts.mediatype === 'string') ?
      DataURL._parseMediaType(opts.mediatype) :
      opts.mediatype ?? DEFAULT_MEDIA;
  }

  private static _parseMediaType(mt: string): MediaType {
    if (mt.length === 0) {
      return DEFAULT_MEDIA;
    }
    return parse(mt, {
      startRule: 'mediatype',
      grammarSource: SOURCE,
    });
  }

  private static _toBuffer(
    data: Buffer | string, encoding: StringEncoding
  ): Buffer {
    if (typeof data === 'string') {
      if (!encoding || encoding === 'utf8') {
        return Buffer.from(data);
      }
      if (encoding === 'base64') {
        return Buffer.from(data, 'base64');
      }
      const unescaped = data.replace(
        /%([0-9a-f]{2})/gi,
        (_, hex) => String.fromCharCode(parseInt(hex, 16))
      );
      return Buffer.from(unescaped, 'ascii');
    }
    // Ignore encoding
    return data;
  }

  public mediaTypeString(): string {
    let ret = `${this.mediatype.type}/${this.mediatype.subtype}`;
    if (this.mediatype.parameters) {
      for (const [k, v] of Object.entries(this.mediatype.parameters)) {
        ret += `;${k}=${v}`;
      }
    }
    return ret;
  }

  public toString(): string {
    return `data:${this.mediaTypeString()}${this.base64 ? ';base64' : ''},${this._dataString()}`;
  }

  private _dataString(): string {
    if (this.base64) {
      return this.data.toString('base64');
    }
    let ret = '';
    for (const b of this.data) {
      if (URIC.has(b)) {
        ret += String.fromCharCode(b);
      } else {
        ret += '%';
        ret += b.toString(16).padStart(2, '0');
      }
    }
    return ret;
  }
}
