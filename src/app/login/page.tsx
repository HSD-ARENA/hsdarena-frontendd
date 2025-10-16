"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            await login(email, password);
            router.push("/dashboard");
        } catch (err: any) {
            // Daha anlaşılır hata mesajı göster
            try {
                const parsed = typeof err.message === "string" ? err.message : JSON.stringify(err);
                setError(parsed);
            } catch {
                setError("Giriş başarısız");
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <form onSubmit={handleSubmit} className="p-6 bg-white rounded-xl shadow-md w-80">
                <h2 className="text-2xl font-semibold mb-4 text-center">Giriş Yap</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 mb-3 border rounded"
                />
                <input
                    type="password"
                    placeholder="Şifre"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 mb-3 border rounded"
                />
                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Giriş Yap
                </button>
            </form>
        </div>
    );
}
