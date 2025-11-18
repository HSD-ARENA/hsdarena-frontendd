export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    if (typeof window === "undefined") {
        throw new Error("apiFetch sadece tarayıcı tarafında kullanılabilir.");
    }

    const token = localStorage.getItem("token");

    let extraHeaders: Record<string, string> = {};
    if (options.headers) {
        if (options.headers instanceof Headers) {
            options.headers.forEach((value, key) => {
                extraHeaders[key] = value;
            });
        } else if (Array.isArray(options.headers)) {
            options.headers.forEach(([key, value]) => {
                extraHeaders[key] = value;
            });
        } else {
            extraHeaders = { ...options.headers } as Record<string, string>;
        }
    }

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...extraHeaders,
    };

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`API Error: ${res.status} - ${text}`);
    }

    return res.json();
}
