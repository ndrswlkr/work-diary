import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    solid( ),
    
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
     
      devOptions: {
        enabled: true

      },
      manifest: {
        name: 'work diary',
        short_name: 'workdiary',
        description: 'note your worktimes',
        "icons": [
          {
            "src": "/work-diary/pwa-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/work-diary/pwa-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/work-diary/pwa-maskable-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "/work-diary/pwa-maskable-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
          }
        ],
        "start_url": "/work-diary/index.html",
        "display": "standalone",
        "background_color": "#FFFFFF",
        "theme_color": "#FFFFFF",
        scope: '/work-diary/',
      }
    })
  ],
  base: '/work-diary',
  build:{
    target: 'esnext',
    outDir: 'docs'
  }
})
