"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import OverlaySpinner from "@/components/ui/OverlaySpinner";
import QuizList from "@/components/admin/QuizList";
import Link from "next/link";

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
    console.log('Authenticated user:', user); // Debug için
    if (!user) return null;

    return (
        <div className="h-full w-full flex flex-col justify-start">
            <Link href="/admin/quiz/create" className="pl-6">
                <Button variant="danger" className="w-40">Yeni Quiz Oluştur</Button>
            </Link>
            <QuizList />
            <div className="fixed bottom-0 left-0 m-6">
                <Button onClick={logout} variant="danger">
                    Çıkış Yap
                </Button>
            </div>
        </div>
    );
}