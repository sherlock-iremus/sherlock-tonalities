import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  base: '/tonalities/',
  server: {
    open: true,
  },
  build: {
    outDir: './tonalities',
  },
  plugins: [react()],
})
