"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuth } from "@/domains/auth/useAuth";

import Button from "@/components/ui/Button";
import OverlaySpinner from "@/components/ui/OverlaySpinner";
import QuizList from "@/components/admin/QuizList";
import AppShell from "@/components/shared/AppShell";

export default function DashboardPage() {
    const { user, logout, loading, initialized } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (initialized && !user) {
            router.replace("/login");
        }
    }, [user, loading, router]);

    if (loading) return <OverlaySpinner />;
    if (!user) return null;

    return (
        <AppShell>
            <div className="h-full w-full flex flex-col justify-start">
                <div className="pl-6 pt-4">
                    <Link href="/admin/quiz/create">
                        <Button variant="danger" className="w-48">
                            Yeni Quiz Oluştur
                        </Button>
                    </Link>
                </div>

                <QuizList />

                <div className="fixed bottom-0 left-0 m-6">
                    <Button onClick={logout} variant="danger">
                        Çıkış Yap
                    </Button>
                </div>
            </div>
        </AppShell>
    );
}
