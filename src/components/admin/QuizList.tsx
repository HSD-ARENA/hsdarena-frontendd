"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/domains/quiz/useQuiz";
import { useSession } from "@/domains/session/useSession";
import { socketManager } from "@/realtime/socket";
import OverlaySpinner from "@/components/ui/OverlaySpinner";
import Button from "@/components/ui/Button";

export default function QuizList() {
    const router = useRouter();
    const { quizzes, fetchQuizzes, loading } = useQuiz();
    const { createSession } = useSession();
    const [startingQuizId, setStartingQuizId] = useState<string | null>(null);

    useEffect(() => {
        fetchQuizzes();
    }, []);

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
            <div className="p-6 text-white">
                Henüz quiz oluşturulmadı.
            </div>
        );
    }

    return (
        <div className="p-6 w-full grid grid-cols-3 gap-4 overflow-y-auto">
            {quizzes.map((quiz) => (
                <div
                    key={quiz.id}
                    className="flex justify-between bg-white rounded-lg p-4 shadow h-24"
                >
                    <div>
                        <h2 className="text-lg font-semibold">{quiz.title}</h2>
                        <p className="text-sm text-gray-500">
                            {quiz.questionsCount ?? 0} soru
                        </p>
                    </div>

                    <Button
                        variant="danger"
                        onClick={() => handleStart(quiz.id)}
                        disabled={startingQuizId === quiz.id}
                    >
                        {startingQuizId === quiz.id ? "Başlatılıyor..." : "Başlat"}
                    </Button>
                </div>
            ))}
        </div>
    );
}