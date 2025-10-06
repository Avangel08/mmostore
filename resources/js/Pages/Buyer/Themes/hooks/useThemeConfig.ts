import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import { ThemeConfig, themeStorage } from "../config/theme.config";

export function useThemeConfig() {
    const { store_settings } = usePage().props;
    const [theme, setTheme] = useState<ThemeConfig | null>(null);

    useEffect(() => {
        if (store_settings) {
            // ✅ Nếu server trả về theme mới → update state + localStorage
            setTheme(store_settings as ThemeConfig);
            themeStorage.set(store_settings as ThemeConfig);    
        } else {
            // ✅ Nếu không có từ server → lấy từ localStorage
            const stored = themeStorage.get();
            if (stored) {
                setTheme(stored);
            }
        }
    }, [store_settings]);

    return theme;
}
