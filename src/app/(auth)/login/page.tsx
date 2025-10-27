"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import OverlaySpinner from "@/components/ui/OverlaySpinner";

export default function LoginPage() {
    const router = useRouter();
    const { login, loading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            const result = await login({ email, password });
            if (result.success) {
                router.replace("/admin");
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || "Giriş başarısız");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            {loading && <OverlaySpinner />}
            <form onSubmit={handleSubmit} className="p-6 bg-white shadow-md rounded-lg w-80">
                <h2 className="text-2xl font-semibold mb-4 text-center">Admin Girişi</h2>
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                <Label htmlFor="password">Şifre</Label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Şifre" />
                {error && <p className="text-red-500 mt-2">{error}</p>}
                <Button type="submit" className="w-full mt-4">Giriş Yap</Button>
            </form>
        </div>
    );
}
