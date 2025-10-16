"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
    const { user, logout, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [loading, user, router]);

    if (loading) return <p>Yükleniyor...</p>;
    if (!user) return null;

    return (
        <div className="p-6">
            <h1 className="text-3xl font-semibold mb-4">
                Merhaba, {user.first_name} {user.last_name} 👋
            </h1>
            <img src={user.avatar} alt="Avatar" className="rounded-full w-24 h-24 mb-4" />
            <p className="text-gray-600 mb-4">{user.email}</p>
            <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
                Çıkış Yap
            </button>
        </div>
    );
}
