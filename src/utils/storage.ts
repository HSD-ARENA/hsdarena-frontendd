// localStorage & sessionStorage yardımcı fonksiyonları
// Sunucu tarafında hata vermemesi için güvenli kontroller içerir.

export const storage = {
    setLocal: (key: string, value: any) => {
        if (typeof window === "undefined") return;
        localStorage.setItem(key, JSON.stringify(value));
    },

    getLocal: <T>(key: string): T | null => {
        if (typeof window === "undefined") return null;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },

    removeLocal: (key: string) => {
        if (typeof window === "undefined") return;
        localStorage.removeItem(key);
    },

    setSession: (key: string, value: any) => {
        if (typeof window === "undefined") return;
        sessionStorage.setItem(key, JSON.stringify(value));
    },

    getSession: <T>(key: string): T | null => {
        if (typeof window === "undefined") return null;
        const data = sessionStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },

    removeSession: (key: string) => {
        if (typeof window === "undefined") return;
        sessionStorage.removeItem(key);
    },
};
