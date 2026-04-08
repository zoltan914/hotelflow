import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
  port: 5173,               // expliciten megadható, de default is ez
  proxy: {
      // Minden /api/... kérés menjen át a Spring Boot-ra
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // secure: false,           // ha https lenne, de most nem kell
        rewrite: (path) => path.replace(/^\/api/, '/api')  // opcionális, ha nem akarsz /api-t duplázni
      }
    }
  }
})
