"use client";

import { useState, useEffect } from "react";
import { useQuiz } from "@/hooks/useQuiz";
import { useWebSocket } from "@/hooks/useWebSocket";
import OverlaySpinner from "@/components/ui/OverlaySpinner";
import Button from "@/components/ui/Button";
import QRDisplay from "@/components/admin/QRDisplay";
import ScoreboardTable from "@/components/shared/ScoreboardTable";

export default function QuizSessionPage({ params }: { params: { sessionCode: string } }) {
    const { sessionCode } = params;
    const { currentQuiz, fetch, loading } = useQuiz();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
    const [showAnswer, setShowAnswer] = useState(false);

    useWebSocket(`wss://domain/realtime`, (msg) => {
        if (msg.event === "score_update") {
            fetch(msg.data.quizId);
        }
        if (msg.event === "quiz_end") {
            setCurrentQuestionIndex(null);
        }
    });

    useEffect(() => {
        if (currentQuiz && currentQuiz.questions.length > 0 && currentQuestionIndex === null) {
            setCurrentQuestionIndex(0);
        }
    }, [currentQuiz]);

    if (loading || !currentQuiz) return <OverlaySpinner />;

    const question = currentQuestionIndex !== null ? currentQuiz.questions[currentQuestionIndex] : null;

    const handleNext = () => {
        setShowAnswer(false);
        if (currentQuestionIndex !== null && currentQuestionIndex < currentQuiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => (prev !== null ? prev + 1 : 0));
        } else {
            // quiz bitince
            setCurrentQuestionIndex(null);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold">{currentQuiz.title}</h2>

            <div>
                <QRDisplay sessionCode={sessionCode} />
            </div>

            <div>
                <p>Takımların sayısı: {currentQuiz.teams?.length || 0}</p>
                <ul className="flex flex-wrap gap-2">
                    {currentQuiz.teams?.slice(-25).map(team => (
                        <li key={team.teamId} className="bg-gray-200 px-2 py-1 rounded">
                            {team.teamName}
                        </li>
                    ))}
                </ul>
            </div>

            {question && (
                <div className="bg-white p-4 rounded shadow space-y-2">
                    <p className="font-semibold">{question.text}</p>
                    <ul className="list-disc pl-6">
                        {question.options.map(opt => <li key={opt}>{opt}</li>)}
                    </ul>
                    <div className="flex gap-2 mt-2">
                        <Button onClick={() => setShowAnswer(prev => !prev)}>Cevabı Göster</Button>
                        <Button onClick={handleNext} variant="primary">İleri</Button>
                    </div>
                    {showAnswer && <p className="mt-2 font-bold text-green-600">Doğru Cevap: {question.correct}</p>}
                </div>
            )}

            {!question && <ScoreboardTable sessionCode={sessionCode} top={10} />}
        </div>
    );
}
