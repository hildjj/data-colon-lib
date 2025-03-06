export default {
  input: 'src/grammar.peggy',
  output: 'src/grammar.js',
  format: 'es',
  dts: true,
  allowedStartRules: [
    'dataurl',
    'mediatype',
  ],
  returnTypes: {
    dataurl: 'import("./types.js").DataParts',
    mediatype: 'import("./types.js").MediaType',
  },
};
