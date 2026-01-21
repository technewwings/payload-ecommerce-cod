import { defineConfig } from 'rolldown';
import nodeResolve from '@rolldown/node-resolve';

export default defineConfig({
  input: 'src/index.ts',
  output: [
    {
      format: 'cjs',
      entryFileNames: '[name].js',
      dir: 'dist'
    },
    {
      format: 'esm',
      entryFileNames: '[name].mjs',
      dir: 'dist'
    }
  ],
  plugins: [
    nodeResolve()
  ],
  external: ['payload'],
  treeshake: true
});