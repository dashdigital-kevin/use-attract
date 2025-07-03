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
      sourcemap: false,
      exports: 'named', // Optimize exports
    },
    {
      file: 'dist/index.mjs',
      format: 'es',
      sourcemap: false,
      exports: 'named', // Optimize exports
    },
  ],
  plugins: [
    resolve({
      browser: true, // Optimize for browser
      preferBuiltins: false, // Don't include Node.js polyfills
    }),
    commonjs(),
    typescript({ 
      declaration: true, 
      declarationDir: 'dist',
      sourceMap: false,
      removeComments: true, // Remove comments to save space
      target: 'es2015', // More efficient target
    }),
    terser({
      compress: {
        drop_console: true, // Remove console.logs
        drop_debugger: true, // Remove debugger statements
        pure_funcs: ['console.log'], // Remove specific functions
      },
      mangle: {
        reserved: ['useAttract', 'useMobile'], // Keep hook names
      },
    }),
  ],
  external: ['react', 'react-dom'], // Keep React external
  treeshake: {
    moduleSideEffects: false, // Enable better tree-shaking
  },
};