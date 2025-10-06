import { storage } from "../../../../localStorage/storage";

export interface ThemeConfig {
    theme: string;
    pageHeaderImage: string;
    pageHeaderText: string;
    storeLogo: string;
    storeName: string;
}

const THEME_KEY = "app_theme";

const defaultTheme: ThemeConfig = {
    theme: "Theme_1",
    pageHeaderImage: "/images/default-header.png",
    pageHeaderText: "Hello, welcome to MMO Store",
    storeLogo: "/images/default-logo.png",
    storeName: "MMO Store"
};

export const themeStorage = {
    get: (): ThemeConfig => storage.get(THEME_KEY, defaultTheme),
    set: (config: ThemeConfig) => storage.set(THEME_KEY, config),
    clear: () => storage.remove(THEME_KEY),
};