import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    solid( {input:["SW.js"]}),
    
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: null,
     
      devOptions: {
        enabled: true

      },
      manifest: {
        name: 'PWA Example',
        short_name: 'PWAEX',
        description: 'PWA example app',
        "icons": [
          {
            "src": "/pwa-example/pwa-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/pwa-example/pwa-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any"
          },
          {
            "src": "/pwa-example/pwa-maskable-192x192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "maskable"
          },
          {
            "src": "/pwa-example/pwa-maskable-512x512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
          }
        ],
        "start_url": "/pwa-example/index.html",
        "display": "standalone",
        "background_color": "#FFFFFF",
        "theme_color": "#FFFFFF",
        scope: '/pwa-example/',
      }
    })
  ],
  base: '/pwa-example',
  build:{
    target: 'esnext',
    outDir: 'docs'
  }
})
