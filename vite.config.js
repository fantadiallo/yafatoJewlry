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
      '@': resolve(__dirname, 'src'),
      // you can keep this for JS imports if you use it, but SCSS won't rely on it anymore
      '@styles': resolve(__dirname, 'src/styles'),
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Let Sass resolve bare imports from src/styles (so "variables" works)
        loadPaths: [resolve(__dirname, 'src/styles')],
        // CRUCIAL: end with \n so it doesn't concatenate with the first line of your file
        additionalData: '@use "variables" as *;\n'
        // If you also want the new color API everywhere: '@use "sass:color";\n@use "variables" as *;\n'
      }
    }
  }
})
