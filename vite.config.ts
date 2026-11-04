import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// AiCA is a Progressive Web App: one codebase that installs on iPhone (Add to Home Screen)
// and on Mac (Safari: File > Add to Dock, Chrome: Install).
export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: { importScripts: ['push-sw.js'] },
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'AiCA',
        short_name: 'AiCA',
        description: 'Your calm little life planner: calendar, lists, rituals and an AI helper.',
        theme_color: '#FCF8F5',
        background_color: '#FCF8F5',
        display: 'standalone',
        start_url: './',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
