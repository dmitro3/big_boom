import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
// import react from '@vitejs/plugin-react-swc'
import {nodePolyfills} from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/big_boom',
    plugins: [react(), nodePolyfills()],
    server: process.env.NODE_ENV === "development" ? {
        watch: {
            usePolling: true,
        },
        host: true, // Here
        strictPort: true,
        port: 5173,
    } : undefined,
})