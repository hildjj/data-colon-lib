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
  mediaType?: MediaType;
}

export type StringEncoding = 'base64' | 'percent' | 'utf8';

export interface DataOptions {
  /**
   * Media type.  Defaults to 'text/plain;charset=US-ASCII' per RFC 2397.
   */
  mediaType?: MediaType | string;

  /**
   * Output formatting, defaults to false.
   */
  base64?: boolean;

  /**
   * Input encoding, if data is string.  Defaults to 'utf8'.
   */
  encoding?: StringEncoding;
}
