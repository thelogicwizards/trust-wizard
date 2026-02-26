import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

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
                        src: 'trust-icon.svg',
                        sizes: 'any',
                        type: 'image/svg+xml'
                    }
                ]
            }
        })
    ],
})
