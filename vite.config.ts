import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
    plugins: [react()],
    // Only use base path in production build (for GitHub Pages)
    base: command === 'build' ? '/Shahtabs-Trading/' : '/',
    build: {
        outDir: 'dist',
    },
    server: {
        port: 3000,
        open: true,
    },
}))
