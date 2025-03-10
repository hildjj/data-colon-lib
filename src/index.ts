import type {DataOptions, MediaType, StringEncoding} from './types.js';
import {
  base64ToUint8Array,
  stringToUint8Array,
  uint8ArrayToBase64,
} from 'uint8array-extras';
import {asciiToUint8Array} from './utils.js';
import {parse as grammarParse} from './grammar.js';

export type {DataOptions, MediaType, StringEncoding} from './types.js';

const SOURCE = 'dataURL source';

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
  public data: Uint8Array;
  public base64: boolean;
  #mediatype: MediaType;

  public constructor(data: Uint8Array | string = '', opts: string | DataOptions = {}) {
    if (typeof opts === 'string') {
      opts = {
        mediaType: opts,
      };
    }
    this.base64 = Boolean(opts.base64);
    this.data = DataURL._toBuffer(data, opts.encoding);
    this.mediaType = opts.mediaType;
  }

  public set mediaType(s: string | MediaType | null | undefined) {
    this.#mediatype = (typeof s === 'string') ?
      DataURL._parseMediaType(s) :
      (s ?? DEFAULT_MEDIA);
    if (!this.#mediatype.type) {
      this.#mediatype.type = DEFAULT_MEDIA.type;
      this.#mediatype.subtype = DEFAULT_MEDIA.subtype;
    }
  }

  public get mediaType(): MediaType {
    return this.#mediatype;
  }

  public static parse(text: string): DataURL {
    try {
      const parsed = grammarParse(text, {
        startRule: 'dataurl',
        grammarSource: SOURCE,
      });
      return new DataURL(parsed.data, {
        encoding: parsed.base64 ? 'base64' : 'percent',
        mediaType: parsed.mediaType,
        base64: parsed.base64,
      });
    } catch (e) {
      if (typeof e.format === 'function') {
        e.message = e.format([{source: SOURCE, text}]);
      }
      throw e;
    }
  }

  private static _parseMediaType(mt: string): MediaType {
    if (mt.length === 0) {
      return DEFAULT_MEDIA;
    }
    return grammarParse(mt, {
      startRule: 'mediatype',
      grammarSource: SOURCE,
    });
  }

  private static _toBuffer(
    data: Uint8Array | string, encoding: StringEncoding
  ): Uint8Array {
    if (data instanceof Uint8Array) {
      // Ignore encoding, convert Buffer inputs to plain Uint8Array.
      return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
    }

    if (!encoding || encoding === 'utf8') {
      return stringToUint8Array(data);
    }
    if (encoding === 'base64') {
      return base64ToUint8Array(data);
    }
    const unescaped = data.replace(
      /%([0-9a-f]{2})/gi,
      (_, hex) => String.fromCodePoint(parseInt(hex, 16))
    );
    // This string is NOT utf8-encoded. It is "ASCII" encoded, which means
    // each code unit in the string should be 0-255 and represent a single
    // byte at this point.
    return asciiToUint8Array(unescaped);
  }

  public mediaTypeString(): string {
    let ret = `${this.#mediatype.type}/${this.#mediatype.subtype}`;
    if (this.#mediatype.parameters) {
      for (const [k, v] of Object.entries(this.#mediatype.parameters)) {
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
      return uint8ArrayToBase64(this.data);
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

/**
 * Parse the given text as a data: URL.
 *
 * @param text String to parse.
 * @returns Parsed results.
 */
export function dataURL(text: string): DataURL {
  return DataURL.parse(text);
}
