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
import {dataURL} from 'data-colon-lib';

const parsed = dataURL('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==');
// DataURL {
//   base64: true,
//   data: Uint8Array(13) [
//     72, 101, 108, 108, 111, 44,  32,  87, 111, 114, 108, 100,  33
//   ],
//   mediatype: { type: 'text', subtype: 'plain', parameters: {} }
// }
```

---
[![Build Status](https://github.com/hildjj/data-colon-lib/workflows/Tests/badge.svg)](https://github.com/hildjj/data-colon-lib/actions?query=workflow%3ATests)
[![codecov](https://codecov.io/gh/hildjj/data-colon-lib/branch/main/graph/badge.svg?token=N7B7YLIDM4)](https://codecov.io/gh/hildjj/data-colon-lib)
