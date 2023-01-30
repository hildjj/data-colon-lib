export interface DataURL {
  mediatype: {
    type?: string;
    subtype?: string;
  };
  base64: boolean;
  data: string;
}

