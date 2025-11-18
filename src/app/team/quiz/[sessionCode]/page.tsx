"use client";

import { useState, useEffect } from "react";
import { useQuiz } from "@/hooks/useQuiz";
import { useAnswer } from "@/hooks/useAnswer";
import OverlaySpinner from "@/components/ui/OverlaySpinner";
import Button from "@/components/ui/Button";
import { useParams } from "next/navigation";

export default function TeamQuizPage({ params }: { params: { sessionCode: string; } }) {
    const { sessionCode } = useParams<{ sessionCode: string }>();
    const { currentQuiz, fetchQuestions, loading } = useQuiz();
    const { send } = useAnswer();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);


    useEffect(() => {
        const getQuestions = async () => {
            if (sessionCode) {
                const res = await fetchQuestions(sessionCode);
                console.log(res);
            }
        }
        getQuestions();
    }, [sessionCode, fetch]);

    // if (loading || !currentQuiz) return <OverlaySpinner />;

    // const question = currentQuiz.questions[currentQuestionIndex];

    // const handleSubmit = async () => {
    //     if (!selectedAnswer) return;
    //     await send({
    //         teamId,
    //         sessionCode,
    //         questionId: question.id,
    //         answer: selectedAnswer
    //     });
    //     setSelectedAnswer(null);
    //     if (currentQuestionIndex < currentQuiz.questions.length - 1) {
    //         setCurrentQuestionIndex(prev => prev + 1);
    //     }
    // };

    return (
        <div className="p-6 max-w-lg mx-auto space-y-4">
            {/* <h2 className="text-xl font-bold">{currentQuiz.title}</h2>
            <div className="bg-white p-4 rounded shadow space-y-2">
                <p className="font-semibold">{question.text}</p>
                <ul className="list-disc pl-6">
                    {question.options.map(opt => (
                        <li key={opt}>
                            <label className="cursor-pointer">
                                <input
                                    type="radio"
                                    name="answer"
                                    value={opt}
                                    checked={selectedAnswer === opt}
                                    onChange={() => setSelectedAnswer(opt)}
                                    className="mr-2"
                                />
                                {opt}
                            </label>
                        </li>
                    ))}
                </ul>
                <Button onClick={handleSubmit} className="mt-2">Cevabı Gönder</Button>
            </div> */}
        </div>
    );
}
