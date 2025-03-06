import {defineConfig} from 'tsup';

export default defineConfig({
  clean: true,
  dts: true,
  entry: [
    'src/index.ts',
    'src/grammar.js',
    'src/types.ts',
  ],
  format: 'esm',
  minify: true,
  outDir: 'lib',
  sourcemap: false,
  splitting: false,
  target: 'es2022',
  bundle: true,
});
