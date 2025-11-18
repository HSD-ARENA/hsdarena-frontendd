import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login as loginService } from "@/services/auth";
import { LoginRequest, LoginResponse } from "@/types/auth";


export function useAuth() {
    const router = useRouter();
    const [user, setUser] = useState<object | null>(null);
    const [loading, setLoading] = useState(false);

    // Check authentication status on mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            // If there's stored user data, retrieve it
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        }
    }, []);

    const login = async (data: LoginRequest): Promise<LoginResponse> => {
        setLoading(true);
        try {
            const res = await loginService(data);
            const token = res.access_token;

            console.log('Raw login response:', res.user);
            setUser(res.user);

            // Store both token and user data. The app's API client (`apiFetch`) reads
            // the token from localStorage and will add the Authorization header.
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(res.user));
            console.log('Token saved:', token);

            return res;
        } catch (error) {
            console.error('Login error:', error);
            localStorage.removeItem("token");

            localStorage.removeItem("user");
            setUser(null);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        router.replace("/login");
    };

    useEffect(() => {
        console.log('User state updated:', user);
    }, [user]);

    return { user, login, logout, loading };
}