"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/domains/quiz/useQuiz";
import { useSession } from "@/domains/session/useSession";
import { socketManager } from "@/realtime/socket";
import OverlaySpinner from "@/components/ui/OverlaySpinner";

export default function QuizList() {
    const router = useRouter();
    const { quizzes, fetchQuizzes, loading } = useQuiz();
    const { createSession } = useSession();
    const [startingQuizId, setStartingQuizId] = useState<string | null>(null);

    useEffect(() => {
        fetchQuizzes();
    }, [fetchQuizzes]);

    /**
     * Quiz başlat:
     * 1. Session oluştur
     * 2. WebSocket'e bağlan
     * 3. QR sayfasına git (orada SESSION_STARTED emit edilecek)
     */
    const handleStart = async (quizId: string) => {
        try {
            setStartingQuizId(quizId);

            // 1. Session oluştur
            const session = await createSession(quizId, {
                startsAt: new Date().toISOString()
            });

            // 2. WebSocket'e bağlan
            const token = localStorage.getItem("token");
            if (token)
                await socketManager.connect(token);

            // 3. QR sayfasına git
            router.push(`/admin/quiz/join/${session.sessionCode}`);

        } catch (error) {
            console.error("❌ Quiz başlatılamadı:", error);
            alert("Session başlatılamadı. Lütfen tekrar deneyin.");
        } finally {
            setStartingQuizId(null);
        }
    };

    if (loading) return <OverlaySpinner />;

    if (!quizzes.length) {
        return (
            <div className="p-6 text-[#fda4af] text-center">
                Henüz quiz oluşturulmadı.
            </div>
        );
    }

    return (
        <>
            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(45, 15, 15, 0.3);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #451a1a;
                    border-radius: 20px;
                    border: 2px solid rgba(45, 15, 15, 0.3);
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: #7f1d1d;
                }
                .card-hover {
                    transition: all 0.3s ease;
                }
                .card-hover:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 10px 30px -10px rgba(220, 38, 38, 0.2);
                    border-color: #7f1d1d;
                }
            `}</style>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 pb-8">
                    {quizzes.map((quiz) => (
                        <div
                            key={quiz.id}
                            className="bg-[#1f0a0a] border border-[#451a1a] rounded-2xl p-6 flex flex-col justify-between h-full min-h-[180px] card-hover relative group overflow-hidden"
                        >
                            {/* Three Dot Menu - Top Right */}
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-[#fda4af] hover:text-white p-1 rounded-full hover:bg-[#2d0f0f] transition-colors">
                                    <span className="material-icons-round text-lg">more_vert</span>
                                </button>
                            </div>

                            <div>
                                {/* Status Badge */}
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="bg-[#dc2626]/10 text-[#dc2626] text-xs font-bold px-2 py-1 rounded-md border border-[#dc2626]/20 uppercase tracking-wide">
                                        Taslak
                                    </span>
                                </div>

                                {/* Quiz Title */}
                                <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                                    {quiz.title}
                                </h3>

                                {/* Question Count */}
                                <p className="text-[#fda4af] text-sm flex items-center gap-1">
                                    <span className="material-icons-round text-base">format_list_numbered</span>
                                    {quiz.questionsCount ?? 0} Soru
                                </p>
                            </div>

                            {/* Action Button */}
                            <div className="mt-6 flex items-center justify-end">
                                <button
                                    onClick={() => handleStart(quiz.id)}
                                    disabled={startingQuizId === quiz.id}
                                    className="bg-[#dc2626] hover:bg-[#b91c1c] text-white border border-transparent font-medium py-2 px-5 rounded-lg transition-all duration-200 flex items-center gap-2 shadow-lg shadow-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span>{startingQuizId === quiz.id ? "Başlatılıyor..." : "Başlat"}</span>
                                    <span className="material-icons-round text-sm">rocket_launch</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
