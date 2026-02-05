export const storage = {
    set<T>(key: string, value: T) {
        try {
            localStorage.setItem(key, JSON.stringify(value))
        } catch (e) {
            console.error("Storage set error:", e)
        }
    },

    get<T>(key: string, defaultValue: T): T {
        try {
            const data = localStorage.getItem(key);
            return data ? (JSON.parse(data) as T) : defaultValue;
        } catch (e) {
            console.error("Storage get error:", e);
            return defaultValue;
        }
    },

    remove(key: string) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error("Storage remove error:", e);
        }
    },

    clear() {
        try {
            localStorage.clear();
        } catch (e) {
            console.error("Storage clear error:", e);
        }
    },
}