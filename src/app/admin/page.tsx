"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import OverlaySpinner from "@/components/ui/OverlaySpinner";

export default function DashboardPage() {
    const { user, logout, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.replace("/login");
        }
    }, [router]);

    if (loading) return <OverlaySpinner />;
    if (!user) return null;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-semibold mb-4">
                Merhaba, {user.email} 👋
            </h1>
            <Button onClick={logout} variant="danger">
                Çıkış Yap
            </Button>
        </div>
    );
}