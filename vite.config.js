import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Let Sass resolve files inside src/styles with bare names like "variables"
        loadPaths: [resolve(__dirname, 'src/styles')],
        // IMPORTANT: end with \n so it doesn't glue to the next @use in your .scss files
        additionalData: '@use "variables" as *;\n'
      }
    }
  }
})
