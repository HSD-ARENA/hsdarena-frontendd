"use client";

import { useEffect, useState } from "react";
import { login as loginService } from "@/domains/auth/auth.service";
import { LoginRequest, LoginResponse, User } from "@/domains/auth/auth.types";

const TOKEN_KEY = "token";
const USER_KEY = "user";

export function useAuth() {
    const [loading, setLoading] = useState(false);
    const [initialized, setInitialized] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    // initial hydrate
    useEffect(() => {
        const storedUser = localStorage.getItem(USER_KEY);
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setInitialized(true);
    }, []);

    const login = async (data: LoginRequest): Promise<LoginResponse> => {
        try {
            setLoading(true);
            const res = await loginService(data);

            localStorage.setItem(TOKEN_KEY, res.access_token);
            localStorage.setItem(USER_KEY, JSON.stringify(res.user));

            setUser(res.user);
            return res;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
    };

    return {
        user,
        isAuthenticated: Boolean(user),
        login,
        logout,
        loading,
        initialized
    };
}
