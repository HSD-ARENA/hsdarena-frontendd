import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login as loginService } from "@/services/auth";
import { LoginRequest } from "@/types/auth";

export function useAuth() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const login = async (data: LoginRequest) => {
        setLoading(true);
        try {
            const res = await loginService(data);
            console.log('Raw login response:', res); // Debug için

            // API yanıtında token olmadığı için geçici bir token oluşturuyoruz
            const token = btoa(JSON.stringify({
                email: data.email,
                timestamp: new Date().getTime()
            }));

            localStorage.setItem("token", token);
            console.log('Token saved:', token); // Debug için

            setUser({
                email: data.email
            });

            return { success: true };
        } catch (error) {
            console.error('Login error:', error);
            localStorage.removeItem("token");
            setUser(null);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        router.replace("/login");
        setUser(null);
    };

    // Check authentication status on mount
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = JSON.parse(atob(token));
                setUser({ email: decoded.email });
            } catch (e) {
                localStorage.removeItem("token");
            }
        }
    }, []);

    return { user, login, logout, loading };
}