import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

const proxyConf = {
  target: 'http://127.0.0.1:3000',
  changeOrigin: false,
}

export default defineConfig({
  build: {
    manifest: false,
  },

  plugins: [
    react(),
  ],

  server: {
    host: true,
    proxy: {
      // '^/$': proxyConf,
      '/api': proxyConf,
      '/callback': proxyConf,
      '/auth': proxyConf,
      '/logout': proxyConf,
    },
  },
})
