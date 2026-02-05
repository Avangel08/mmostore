import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/js/app-home.tsx',
                'resources/js/app-admin.tsx',
                'resources/js/app-buyer.tsx',
                'resources/js/app-seller.tsx',
            ],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            "@assets": "resources/",
            "@": "resources/js/",
        }
    },
    server: {
        cors: {
            origin: '*',
        }
    }
});
