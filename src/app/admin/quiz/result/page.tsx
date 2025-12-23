"use client";

import { useEffect, useState } from "react";
import { useQuiz } from "@/domains/quiz/useQuiz";
import ScoreboardTable from "@/components/shared/ScoreboardTable";
import OverlaySpinner from "@/components/ui/OverlaySpinner";
import AppShell from "@/components/shared/AppShell";

export default function QuizResultPage({ params }: { params: { sessionCode: string } }) {
    const { sessionCode } = params;
    const { currentQuiz, fetch, loading } = useQuiz();
    const [showTop3, setShowTop3] = useState(true);

    useEffect(() => {
        fetch(sessionCode);
    }, [sessionCode, fetch]);

    if (loading || !currentQuiz) return <OverlaySpinner />;

    return (
        <AppShell>
            <div className="p-6 max-w-3xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold mb-4">Quiz Sonuçları</h1>
                <p className="text-gray-700 mb-2">Oturum Kodu: {sessionCode}</p>
                <ScoreboardTable sessionCode={sessionCode} top={3} />
                {!showTop3 && <ScoreboardTable sessionCode={sessionCode} top={10} />}
            </div>
        </AppShell>
    );
}
