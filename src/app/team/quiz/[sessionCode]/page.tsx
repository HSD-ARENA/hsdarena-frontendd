"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { useQuiz } from "@/hooks/useQuiz";
import { useAnswer } from "@/hooks/useAnswer";
import Button from "@/components/ui/Button";

interface PageProps {
    params: Promise<{ sessionCode: string }>;
}

export default function TeamQuizPage({ params }: PageProps) {
    const [sessionCode, setSessionCode] = useState("");
    const [token, setToken] = useState<string | null>(null);

    const { fetchQuestions, currentQuiz } = useQuiz();
    const { send } = useAnswer();
    const [currentQuestion, setCurrentQuestion] = useState<any>(null);
    const [questionIndex, setQuestionIndex] = useState(0);

    const [uiState, setUIState] = useState<
        "question" | "answered" | "result" | "waiting"
    >("question");

    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [resultData, setResultData] = useState<any>(null);

    // params çöz
    useEffect(() => {
        params.then((p) => setSessionCode(p.sessionCode));
    }, [params]);

    // token çöz
    useEffect(() => {
        const t = localStorage.getItem("teamToken");
        setToken(t);
    }, []);

    const socket = useSocket(token ?? "");

    // Soruları API’den çek
    useEffect(() => {
        if (!sessionCode) return;
        fetchQuestions(sessionCode);
    }, [sessionCode]);

    // İlk soruyu yükle
    useEffect(() => {
        if (!currentQuiz) return;
        setCurrentQuestion(currentQuiz.questions[0]);
        setQuestionIndex(0);
        setUIState("question");
    }, [currentQuiz]);

    // WEBSOCKET EVENTLERİ
    useEffect(() => {
        if (!socket) return;

        // Admin sonraki soruyu başlattı
        socket.on("new-question", (q) => {
            setCurrentQuestion(q);
            setSelectedAnswer(null);
            setUIState("question");

            const idx = currentQuiz?.questions.findIndex(
                (x: any) => x.id === q.id
            );
            if (idx !== undefined && idx !== -1) setQuestionIndex(idx);
        });

        // Admin soru cevap ekranını açtı
        socket.on("answer-stats-updated", (stats) => {
            setResultData(stats);
            setUIState("result");
        });

        // Admin yeni soru açana kadar bekle
        socket.on("scoreboard-updated", () => {
            setUIState("waiting");
        });

        return () => {
            socket.off("new-question");
            socket.off("answer-stats-updated");
            socket.off("scoreboard-updated");
        };
    }, [socket, currentQuiz]);

    // CEVAP GÖNDER
    async function submitAnswer() {
        if (!selectedAnswer || !currentQuestion) return;

        setUIState("answered");

        const body = {
            sessionId: currentQuiz?.sessionId,
            questionId: currentQuestion.id,
            answerPayload: { id: selectedAnswer },
            nonce: `${Date.now()}`,
        };

        const res = await fetch("http://localhost:8080/api/answer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("teamToken")}`,
            },
            body: JSON.stringify(body),
        });

        const json = await res.json();
        setResultData(json); // doğru/yanlış verisi burada
    }

    // --------------------------
    // RENDER AKIŞI
    // --------------------------

    if (!currentQuestion) return <div>Loading...</div>;

    return (
        <div style={{ padding: 20 }}>
            <h1>Team Quiz - {sessionCode}</h1>

            {/* 1 — SORU EKRANI */}
            {uiState === "question" && (
                <>
                    <h2>{currentQuestion.text}</h2>
                    {currentQuestion.choices.map((c: any) => (
                        <button
                            key={c.id}
                            style={{
                                display: "block",
                                padding: 12,
                                marginTop: 10,
                                border:
                                    selectedAnswer === c.id
                                        ? "2px solid black"
                                        : "1px solid #aaa",
                            }}
                            onClick={() => setSelectedAnswer(c.id)}
                        >
                            {c.text}
                        </button>
                    ))}

                    <Button
                        onClick={submitAnswer}
                        disabled={!selectedAnswer}
                        style={{ marginTop: 20 }}
                    >
                        Cevapla
                    </Button>
                </>
            )}

            {/* 2 — CEVAPLANDI, BEKLE */}
            {uiState === "answered" && (
                <h2>Cevabın alındı! Admin sonucu açıklayana kadar bekle…</h2>
            )}

            {/* 3 — DOĞRU/YANLIŞ SONUCU */}
            {uiState === "result" && (
                <div>
                    <h1>
                        {resultData?.isCorrect ? "🎉 Doğru!" : "❌ Yanlış!"}
                    </h1>

                    {resultData?.isCorrect && (
                        <p>+{resultData.pointsAwarded} puan</p>
                    )}

                    <p>
                        Admin yeni soruyu başlatınca otomatik geçiş
                        yapılacaktır.
                    </p>
                </div>
            )}

            {/* 4 — Admin yeni soruyu başlatana kadar */}
            {uiState === "waiting" && (
                <h2>Sonraki soruyu admin başlatıyor…</h2>
            )}
        </div>
    );
}
