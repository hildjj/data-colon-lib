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
    dataurl: 'DataParts',
    mediatype: 'MediaType',
  },
};
