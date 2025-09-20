// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // --- Shopify envs ---
  const HOST = (env.VITE_SHOPIFY_DOMAIN || env.VITE_SHOPIFY_STORE_DOMAIN || '')
    .replace(/^https?:\/\//, '')
    .split('/')[0];
  const API_VERSION = env.VITE_SHOPIFY_API_VERSION || '2024-10';
  const TOKEN = env.VITE_SHOPIFY_STOREFRONT_TOKEN || '';

  return {
    plugins: [react()],

    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@styles': resolve(__dirname, 'src/styles'), // for JS imports; SCSS uses loadPaths below
      },
    },

    css: {
      preprocessorOptions: {
        scss: {
          // lets you do @use "variables"; from anywhere
          loadPaths: [resolve(__dirname, 'src/styles')],
          // IMPORTANT: end with \n so it doesn't glue to the first line of your file
          // includes the new Sass color API everywhere too
          additionalData: '@use "sass:color";\n@use "variables" as *;\n',
        },
      },
    },

    // Dev-only proxy to avoid CORS in localhost
    server: {
      proxy: HOST
        ? {
            '/sf': {
              target: `https://${HOST}`,
              changeOrigin: true,
              secure: true,
              headers: {
                'X-Shopify-Storefront-Access-Token': TOKEN,
              },
              rewrite: (p) => p.replace(/^\/sf/, `/api/${API_VERSION}/graphql.json`),
            },
          }
        : undefined,
    },
  };
});
