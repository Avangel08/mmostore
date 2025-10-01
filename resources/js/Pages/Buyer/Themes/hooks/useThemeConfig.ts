import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import { ThemeConfig, themeStorage } from "../config/theme.config";

export function useThemeConfig() {
    const { configTheme } = usePage().props;
    const [theme, setTheme] = useState<ThemeConfig | null>(null);

    useEffect(() => {
        if (configTheme) {
            // ✅ Nếu server trả về theme mới → update state + localStorage
            setTheme(configTheme as ThemeConfig);
            themeStorage.set(configTheme as ThemeConfig)
        } else {
            // ✅ Nếu không có từ server → lấy từ localStorage
            const stored = themeStorage.get();
            if (stored) {
                setTheme(stored);
            }
        }
    }, [configTheme]);

    return theme;
}
