import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  base: '/sherlock-tonalities/',
  server: {
    open: true,
  },
  plugins: [react()],
})