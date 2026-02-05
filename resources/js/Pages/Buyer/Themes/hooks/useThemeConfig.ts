import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import { ThemeConfig, themeStorage } from "../config/theme.config";

export function useThemeConfig() {
    const { settings }= usePage().props as any;
    const [theme, setTheme] = useState<ThemeConfig | null>(null);

    useEffect(() => {
        if (settings && typeof settings === 'object' && !Array.isArray(settings)) {
            // ✅ Nếu server trả về theme mới → update state + localStorage
            setTheme(settings as ThemeConfig);
            themeStorage.set(settings as ThemeConfig);    
        } else {
            // ✅ Nếu không có từ server → lấy từ localStorage
            const stored = themeStorage.get();
            if (stored) {
                setTheme(stored);
            }
        }
    }, [settings]);

    return theme;
}
