import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import solid from 'vite-plugin-solid'

export default defineConfig({
  //base: './',
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000'
      }
    }
  },
  plugins: [solid(),  VitePWA({
    registerType: 'autoUpdate',
    workbox: {
      cleanupOutdatedCaches: true,
    },
    manifest:{
      name: 'ndrs.wlkr work-diary',
      short_name: 'work-diary',
      description: 'store information about pending or executed work with pictures',
      theme_color: '#39F1A6', // jade150
      background_color: '#39F1A6', // jade150
      display: 'standalone',
      icons:[
        {
          src: '/img/icons/android-launchericon-48-48.png',
          sizes: '48x48',
          type: 'image/png'
        },
        {
          src: '/img/icons/android-launchericon-72-72.png',
          sizes: '72x72',
          type: 'image/png'
        },
        {
          src: '/img/icons/android-launchericon-96-96.png',
          sizes: '96x96',
          type: 'image/png'
        },
        {
          src: '/img/icons/android-launchericon-144-144.png',
          sizes: '144x144',
          type: 'image/png'
        },
        {
          src: '/img/icons/android-launchericon-192-192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/img/icons/android-launchericon-512-512.png',
          sizes: '512x512',
          type: 'image/png'
        },
      ]

    }
  })]
})
