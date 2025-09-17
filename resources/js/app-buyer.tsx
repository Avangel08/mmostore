import '../scss/themes.scss'
import './i18n'
import './bootstrap'

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { Provider } from 'react-redux';
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./slices";

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const store = configureStore({ reducer: rootReducer, devTools: true });

createInertiaApp({
    title: (title) => `${title} - Buyer - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/Buyer/${name}.tsx`, import.meta.glob('./Pages/Buyer/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <Provider store={store}>
                <App {...props} />
            </Provider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
