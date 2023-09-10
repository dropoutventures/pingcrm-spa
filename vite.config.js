import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import laravel from 'laravel-vite-plugin'
// import ssr from 'vite-plugin-ssr/plugin'
import AutoImport from 'unplugin-auto-import/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
  vue({
      template: {
          transformAssetUrls: {
              // The Vue plugin will re-write asset URLs, when referenced
              // in Single File Components, to point to the Laravel web
              // server. Setting this to `null` allows the Laravel plugin
              // to instead re-write asset URLs to point to the Vite
              // server instead.
              base: null,

              // The Vue plugin will parse absolute URLs and treat them
              // as absolute paths to files on disk. Setting this to
              // `false` will leave absolute URLs un-touched so they can
              // reference assets in the public directory as expected.
              includeAbsolute: false,
          },
      },
  }),
      AutoImport({
          imports: [
              'vue',
              // custom
              {
                  'momentum-trail': [
                      'route', 'current'
                  ],
              },
          ],
      }),
  ],
  resolve: {
    alias: {
        '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    target: 'esnext',
  },
  server: {
      mode: "cors",
      credentials: "include",
  },
})
