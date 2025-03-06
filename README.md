# data-colon-lib

Parse "data:" URLs according to [RFC 2397](https://www.rfc-editor.org/rfc/rfc2397).

## Installation

```sh
npm install data-colon-lib
```

## API

Full [API documentation](http://hildjj.github.io/data-colon-lib/) is available.

Example:

```js
import {DataURL} from 'data-colon-lib';

const parsed = DataURL.parse(
  'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='
);
// DataURL {
//   base64: true,
//   data: Uint8Array(13) [
//     72, 101, 108, 108, 111, 44,  32,  87, 111, 114, 108, 100,  33
//   ],
//   mediatype: { type: 'text', subtype: 'plain', parameters: {} }
// }
const created = new DataURL(new Uint8Array([72, 101]), 'image/gif');
created.toString(); // 'data:image/gif,He'
const created64 = new DataURL(new Uint8Array([72, 101]), {
  mediaType: 'image/gif',
  base64: true,
});
created64.toString(); // 'data:image/gif;base64,SGU='
```

---
[![Build Status](https://github.com/hildjj/data-colon-lib/workflows/Tests/badge.svg)](https://github.com/hildjj/data-colon-lib/actions?query=workflow%3ATests)
[![codecov](https://codecov.io/gh/hildjj/data-colon-lib/graph/badge.svg?token=WLAP7U9RVP)](https://codecov.io/gh/hildjj/data-colon-lib)
