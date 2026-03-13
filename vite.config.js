import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'auto',
            manifest: {
                name: 'Trust Wizard',
                short_name: 'Trust',
                description: 'Private Trust Management & Simulation',
                theme_color: '#0c0e12',
                background_color: '#0c0e12',
                display: 'standalone',
                icons: [
                    {
                        src: 'trust-icon.png',
                        sizes: 'any',
                        type: 'image/png'
                    }
                ]
            }
        })
    ],
    // Tauri expects a fixed port, fail if that port is not available
    server: {
        host: host || false,
        port: 5173,
        strictPort: true,
        hmr: host ? {
            protocol: 'ws',
            host,
            port: 5183,
        } : undefined,
        watch: {
            // tell vite to ignore watching `src-tauri`
            ignored: ["**/src-tauri/**"],
        },
    },
    // to access the Tauri environment variables set by the CLI with information about the current target
    envPrefix: ['VITE_', 'TAURI_ENV_*'],
    build: {
        // Tauri uses Chromium on Windows and WebKit on macOS and Linux
        target: process.env.TAURI_ENV_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
        // don't minify for debug builds
        minify: !process.env.TAURI_ENV_DEBUG ? 'esbuild' : false,
        // produce sourcemaps for debug builds
        sourcemap: !!process.env.TAURI_ENV_DEBUG,
    },
})
