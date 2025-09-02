import { defineConfig } from 'vite'
import { VitePWA } from "vite-plugin-pwa"
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",                // Automatically check for updates
      devOptions: {
        enabled: true                            // enable SW on localhost during dev (for testing)
      },
      includeAssets: [
        "favicon.svg",
        "apple-touch-icon.png",
        "pwa-192x192.png",
        "pwa-512x512.png"
      ],
      manifest: {
        name: "Kanban PWA",
        short_name: "Kanban",
        description: "Simple Agile methodology using Kanban PWA",
        theme_color: "#06b6d4",                   // tailwind-teal-400 as Eg
        background_color: "#ffffff",
        icons: [
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          { src: "pwa-192x192-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
      },
      workbox: {
        // runtime caching strategies for different resource types
        runtimeCaching: [
          {
            // HTML: use network-first so users get latest app shell
            urlPattern: ({ request }) => request.destination === "document",
            handler: "NetworkFirst",
            options: {
              cacheName: "html-cache"
            }
          },
          {
            // Static JS/CSS: stale-while-revalidate is a good default
            urlPattern: ({ request }) => request.destination === "script" || request.destination === "style",
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "asset-cache"
            }
          },
          {
            // images: cache-first with expiry
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "image-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60               // 30 Days
              }
            }
          }
        ],
        // Optional: TO decide whether new SW should immediately take control
        // skipWaiting: true,
        // clientsClaim: true
      }
    })
  ],
});
