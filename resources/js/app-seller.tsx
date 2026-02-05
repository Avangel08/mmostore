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

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';
const store = configureStore({ reducer: rootReducer, devTools: true });

createInertiaApp({
    resolve: (name) => resolvePageComponent(`./Pages/Seller/${name}.tsx`, import.meta.glob('./Pages/Seller/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <Provider store={store}>
                <ContextMenuProvider>
                    <App {...props} />
                </ContextMenuProvider>
            </Provider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
