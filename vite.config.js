import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: './src/main.ts',
      name: 'GoBlank',
      fileName: 'go-blank',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['axios'],
      output: {
        globals: {
          axios: 'axios'
        }
      }
    }
  },
  plugins: [dts({ insertTypesEntry: true })]
});