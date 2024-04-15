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
        name: 'workout timer',
        short_name: 'wt',
        description: 'timing your workouts',
        "icons": [
          {
            "src": "/workout-timer/pwa-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/workout-timer/pwa-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/workout-timer/pwa-maskable-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "/workout-timer/pwa-maskable-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
          }
        ],
        "start_url": "/workout-timer/index.html",
        "display": "standalone",
        "background_color": "#FFFFFF",
        "theme_color": "#FFFFFF",
        scope: '/workout-timer/',
      }
    })
  ],
  base: '/workout-timer',
  build:{
    target: 'esnext',
    outDir: 'docs'
  }
})
