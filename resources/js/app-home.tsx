//import Scss
import '../scss/themes.scss'

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { Provider } from 'react-redux';
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./slices";

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const store = configureStore({ reducer: rootReducer, devTools: true });

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/Home/${name}.tsx`, import.meta.glob('./Pages/Home/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        (window as any).t = (key: string, params?: Record<string, any>) => {
            const translations = (props as any)?.initialPage?.props?.translations || (props as any)?.props?.translations || {};
            let str = translations[key] || key;
            if (params) {
                Object.keys(params).forEach((k) => {
                    const re = new RegExp(':' + k, 'g');
                    str = str.replace(re, params[k]);
                });
            }
            return str;
        };

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
