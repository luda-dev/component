import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    dts({
      insertTypesEntry: true,
      outDir: 'dist/types'
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ComponentLibrary',
      fileName: (format) => `component-library.${format}.js`
    },
    rollupOptions: {
      external: ['vue', 'vxe-table', 'xe-utils'],
      output: {
        globals: {
          vue: 'Vue',
          'vxe-table': 'VXETable',
          'xe-utils': 'XEUtils'
        }
      }
    }
  }
})
