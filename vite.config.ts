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
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'AiCA',
        short_name: 'AiCA',
        description: 'Your calm little life planner: calendar, lists, rituals and an AI helper.',
        theme_color: '#F7F0EC',
        background_color: '#F7F0EC',
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
