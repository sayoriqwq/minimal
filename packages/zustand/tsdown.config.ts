import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: 'src/react.ts',
    vanilla: 'src/vanilla.ts',
  },
  format: ['esm', 'cjs'],
  platform: 'browser',
  fixedExtension: true,
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react'],
})
