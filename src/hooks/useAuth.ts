"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";

export function useAuth() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        // Varsayılan olarak ReqRes demo kullanıcı: /users/1
        apiFetch("/users/1")
            .then((data) => setUser(data.data ?? data))
            .catch(() => localStorage.removeItem("token"))
            .finally(() => setLoading(false));
    }, []);

    const login = async (email: string, password: string) => {
        const res = await apiFetch("/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        const token = res.token;
        if (!token) throw new Error("Login failed");

        localStorage.setItem("token", token);

        // Login sonrası kullanıcıyı al
        const userRes = await apiFetch("/users/1");
        setUser(userRes.data ?? userRes);

        return res;
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return { user, login, logout, loading };
}
