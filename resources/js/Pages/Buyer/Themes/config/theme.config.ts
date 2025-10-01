import { storage } from "../../../../localStorage/storage";

export interface ThemeConfig {
    logo: string;
    headerImage: string;
    titleHeader: string;
    nameTheme: string;
}

const THEME_KEY = "app_theme";

const defaultTheme: ThemeConfig = {
    logo: "/images/default-logo.png",
    headerImage: "/images/default-header.png",
    titleHeader: "My Website",
    nameTheme: "Theme_1"
};

export const themeStorage = {
    get: (): ThemeConfig => storage.get(THEME_KEY, defaultTheme),
    set: (config: ThemeConfig) => storage.set(THEME_KEY, config),
    clear: () => storage.remove(THEME_KEY),
};