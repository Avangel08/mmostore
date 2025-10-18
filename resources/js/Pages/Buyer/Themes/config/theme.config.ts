import { storage } from "../../../../localStorage/storage";

export interface ThemeConfig {
    theme: string;
    pageHeaderImage: string;
    pageHeaderText: string;
    storeLogo: string;
    storeName: string;
    metaDescription: string;
}

const THEME_KEY = "app_theme";

const defaultTheme: ThemeConfig = {
    theme: "theme_1",
    pageHeaderImage: "",
    pageHeaderText: "Hello, welcome to MMO Store",
    storeLogo: "",
    storeName: "MMO Store",
    metaDescription: ""
};

export const themeStorage = {
    get: (): ThemeConfig => storage.get(THEME_KEY, defaultTheme),
    set: (config: ThemeConfig) => storage.set(THEME_KEY, config),
    clear: () => storage.remove(THEME_KEY),
};