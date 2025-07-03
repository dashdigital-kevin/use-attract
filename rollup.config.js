import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: false, // Disable source maps for smaller bundle
    },
    {
      file: 'dist/index.mjs',
      format: 'es',
      sourcemap: false, // Disable source maps for smaller bundle
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({ 
      declaration: true, 
      declarationDir: 'dist',
      sourceMap: false, // Disable TypeScript source maps
    }),
    terser(), // This should minify the code
  ],
  external: ['react'], // Make sure React stays external
};