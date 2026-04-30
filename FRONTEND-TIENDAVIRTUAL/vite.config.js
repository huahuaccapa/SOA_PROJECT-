import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),  // Plugin de Tailwind CSS v4
  ],
  // Configuración adicional recomendada
  server: {
    port: 5173,        // Puerto por defecto
    open: true,        // Abre el navegador automáticamente
    host: true,        // Permite acceso desde la red local
  },
  // Optimización para producción
  build: {
    outDir: 'dist',
    sourcemap: true,   // Útil para debugging
  },
  // Resolución de alias (opcional pero útil)
  resolve: {
    alias: {
      '@': '/src',     // Permite imports como '@/components/...'
    },
  },
})