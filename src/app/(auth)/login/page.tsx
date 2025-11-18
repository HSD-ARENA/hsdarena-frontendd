"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import OverlaySpinner from "@/components/ui/OverlaySpinner";
import Link from "next/link";


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
            if (result.access_token && result.access_token === localStorage.getItem("token")) {
                router.replace("/admin");
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || "Giriş başarısız");
        }
    };

    return (
        <div className="h-full w-full flex flex-col items-center justify-start">
            {loading && <OverlaySpinner />}
            <h2 className="text-white text-2xl font-semibold text-center mt-12">Admin Girişi</h2>
            <form onSubmit={handleSubmit} className="p-6 w-100">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full" />
                <Label htmlFor="password">Şifre</Label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Şifre" className="w-full" />
                {error && <p className="text-red-500 mt-2">{error}</p>}
                <div className="w-full flex justify-center">
                    <Button type="submit" variant="danger" className="mt-4">Giriş Yap</Button>
                </div>
            </form>
            <div className="fixed bottom-0 left-0 m-6">
                <Link href="/">
                    <Button type="button" variant="danger">Ana Sayfa</Button>
                </Link>
            </div>
        </div>
    );
}
