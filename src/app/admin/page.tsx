"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useAuth } from "@/domains/auth/useAuth";

import OverlaySpinner from "@/components/ui/OverlaySpinner";
import QuizList from "@/components/admin/QuizList";

export default function DashboardPage() {
    const { user, logout, loading, initialized } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (initialized && !user) {
            router.replace("/login");
        }
    }, [user, loading, router, initialized]);

    if (loading) return <OverlaySpinner />;
    if (!user) return null;

    // Get user initials for avatar
    const getUserInitial = () => {
        return user?.email?.charAt(0).toUpperCase() || 'A';
    };

    return (
        <div className="bg-[#0f0404] text-[#ffe4e6] h-screen flex flex-col overflow-hidden selection:bg-[#dc2626] selection:text-white">
            {/* Navigation Bar */}
            <nav className="bg-[#1f0a0a] border-b border-[#451a1a] h-16 flex-shrink-0 z-20 shadow-lg shadow-red-900/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-full hover:bg-[#2d0f0f] text-[#fda4af] hover:text-white transition-colors">
                            <span className="material-icons-round">arrow_back</span>
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#dc2626] to-[#b91c1c] rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-red-900/20">H</div>
                            <h1 className="text-xl font-bold tracking-tight text-white">HSD <span className="text-[#dc2626] font-extrabold">ARENA</span></h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center text-sm text-[#fda4af] bg-[#2d0f0f]/50 px-3 py-1.5 rounded-full border border-[#451a1a]/50">
                            <span className="material-icons-round text-base mr-2 text-[#dc2626]">person</span>
                            Admin User
                        </div>
                        <button className="flex md:hidden items-center justify-center p-2 rounded-full hover:bg-[#2d0f0f] text-white">
                            <span className="material-icons-round">menu</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 relative flex flex-col items-center p-4 md:p-8 overflow-hidden">
                {/* Blur Effects */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#dc2626]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#dc2626]/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

                {/* Content Wrapper */}
                <div className="w-full max-w-7xl relative z-10 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                        <div>
                            <h2 className="text-3xl font-extrabold text-white tracking-tight">Quiz Yönetimi</h2>
                            <p className="text-[#fda4af] mt-1 text-sm">Mevcut quizleri yönetin veya yeni bir yarışma oluşturun.</p>
                        </div>
                        <Link href="/admin/quiz/create">
                            <button className="group relative flex items-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-red-900/30 transition-all duration-200 transform hover:-translate-y-0.5">
                                <span className="material-icons-round text-xl group-hover:rotate-90 transition-transform duration-300">add</span>
                                <span>Yeni Quiz Oluştur</span>
                            </button>
                        </Link>
                    </div>

                    {/* Quiz List */}
                    <QuizList />

                    {/* Logout Button - Bottom Left */}
                    <div className="mt-4 flex justify-center md:justify-start">
                        <button className="flex md:hidden fixed bottom-6 right-6 z-50 bg-[#dc2626] text-white p-4 rounded-full shadow-xl shadow-red-900/50 hover:bg-[#b91c1c] transition-colors">
                            <span className="material-icons-round text-2xl">add</span>
                        </button>
                        <div className="absolute bottom-4 left-0">
                            <button
                                onClick={logout}
                                className="bg-[#2d0f0f] hover:bg-[#ef4444] hover:text-white text-[#fda4af] border border-[#451a1a] px-4 py-2 rounded-full font-semibold text-sm transition-all flex items-center gap-2 group"
                            >
                                <span className="w-6 h-6 rounded-full bg-[#0f0404] flex items-center justify-center text-xs group-hover:text-[#ef4444]">
                                    {getUserInitial()}
                                </span>
                                <span>Çıkış Yap</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
