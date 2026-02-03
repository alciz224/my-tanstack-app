import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vite'

const config = defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    devtools(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  server: {
    proxy: {
      '/api': {
        target: process.env.BACKEND_URL || 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // Rewrite Set-Cookie headers to work with localhost:3000
            const cookies = proxyRes.headers['set-cookie']
            if (cookies) {
              const cookieList = Array.isArray(cookies) ? cookies : [cookies]

              // Rewrite cookies to be compatible with the frontend domain
              const rewrittenCookies = cookieList.map((cookie) => {
                // Remove Domain attribute if present (host-only cookies work best on localhost)
                let rewritten = cookie.replace(/;\s*Domain=[^;]+/gi, '')

                // Force Path=/ so cookies are sent on /dashboard (and not only /api/...)
                if (/;\s*Path=/i.test(rewritten)) {
                  rewritten = rewritten.replace(/;\s*Path=[^;]+/gi, '; Path=/')
                } else {
                  rewritten += '; Path=/'
                }

                // Make sure SameSite is Lax
                if (/;\s*SameSite=/i.test(rewritten)) {
                  rewritten = rewritten.replace(/;\s*SameSite=[^;]+/gi, '; SameSite=Lax')
                } else {
                  rewritten += '; SameSite=Lax'
                }

                // Remove Secure flag for http://localhost
                rewritten = rewritten.replace(/;\s*Secure/gi, '')

                return rewritten
              })
              proxyRes.headers['set-cookie'] = rewrittenCookies
            }
          })
        },
      },
    },
  },
})

export default config
