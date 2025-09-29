import '../scss/themes.scss'
import './i18n'
import './bootstrap'

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { Provider } from 'react-redux';
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./slices";
import { ContextMenuProvider } from './Components/Common/ContextMenu';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './utils/queryClient';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const store = configureStore({ reducer: rootReducer, devTools: true });

createInertiaApp({
    title: (title) => `${title} - Buyer - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/Buyer/${name}.tsx`, import.meta.glob('./Pages/Buyer/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <Provider store={store}>
                <QueryClientProvider client={queryClient}>
                    <ContextMenuProvider>
                        <App {...props} />
                    </ContextMenuProvider>
                </QueryClientProvider>
            </Provider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
