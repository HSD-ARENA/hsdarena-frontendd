"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/hooks/useSocket";
import { useQuiz } from "@/hooks/useQuiz";
import { useScoreboard } from "@/hooks/useScoreboard";
import Button from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PageProps {
    params: Promise<{ sessionCode: string }>;
}

export default function AdminQuizSessionPage({ params }: PageProps) {
    const [sessionCode, setSessionCode] = useState("");
    const [token, setToken] = useState<string | null>(null);

    const { fetchQuestions, currentQuiz } = useQuiz();
    const { scoreboard, fetchScoreboard } = useScoreboard(sessionCode);
    const [currentQuestion, setCurrentQuestion] = useState<any>(null);
    const [questionIndex, setQuestionIndex] = useState(0);

    const [adminState, setAdminState] = useState<"question" | "answer" | "scoreboard">(
        "question"
    );
    const [stats, setStats] = useState<any>(null);

    const options = ['H', 'S', 'D', 'A'];
    const buttonVariants = [
        "button1",
        "button2",
        "button3",
        "button4",
    ] as const;

    // params çöz
    useEffect(() => {
        params.then((p) => setSessionCode(p.sessionCode));
    }, [params]);

    // token çöz
    useEffect(() => {
        const t = localStorage.getItem("token");
        setToken(t);
    }, []);

    const socket = useSocket(token ?? "");

    // Soruları API'den çek
    useEffect(() => {
        if (!sessionCode) return;
        fetchQuestions(sessionCode);
    }, [sessionCode]);

    // İlk soru
    useEffect(() => {
        if (!currentQuiz) return;
        setCurrentQuestion(currentQuiz.questions[0]);
        setQuestionIndex(0);
    }, [currentQuiz]);

    // WEBSOCKET dinleme
    useEffect(() => {
        if (!socket) return;

        socket.on("answer-stats-updated", (data) => {
            console.log("ADMIN GOT STATS:", data);
            setStats(data);
            setAdminState("answer");
        });

        socket.on("new-question", (q) => {
            setCurrentQuestion(q);
            setAdminState("question");

            const idx = currentQuiz?.questions.findIndex(
                (x: any) => x.id === q.id
            );
            if (idx !== undefined && idx !== -1) setQuestionIndex(idx);
        });

        return () => {
            socket.off("answer-stats-updated");
            socket.off("new-question");
        };
    }, [socket, currentQuiz]);


    // Admin — Sonraki Soru
    function nextQuestion() {
        if (!socket) return;
        console.log("clik");
        socket.emit("next-question", {
            sessionCode,
            questionIndex: questionIndex + 1,
        });
    }

    // Admin — Soru Cevap
    function showAnswers() {
        setAdminState("answer");
    }

    // Admin — Skor Tablosu
    function showScoreboard() {
        console.log("lik");
        if (!socket) return;
        fetchScoreboard();
        setAdminState("scoreboard");
    }

    if (!currentQuestion) return <div>Loading...</div>;


    const totalQuestions = currentQuiz?.questions.length ?? 1;

    return (
        <div className="flex flex-col items-center w-full text-white">
            <div className="flex items-center justify-between p-5 w-full">
                <ChevronLeft size={50} />
                <h2 className="text-[30px] font-bold">{questionIndex + 1}/{totalQuestions}</h2>
                <button onClick={adminState == "question" ? showAnswers : adminState == "answer" ? showScoreboard : nextQuestion}>
                    <ChevronRight size={50} />
                </button>
            </div>

            {/* --- SORU EKRANI --- */}
            {adminState === "question" && (
                <div className="flex flex-col items-center">

                    {
                        currentQuestion.imageUrl && (
                            <img src={currentQuestion.imageUrl} alt="question image" className="mb-4 max-h-[300px] object-contain" />
                        )
                    }

                    <h3 className={`text-[30px] mb-[12px] ${!currentQuestion.imageUrl && "mt-[15%]"}`}>{currentQuestion.text}</h3>

                    <div className="grid grid-cols-2 gap-[12px] w-[800px] h-[275px]">
                        {
                            currentQuestion.choices.map((c: any, index: number) => (
                                <Button className="flex items-center font-bold"
                                    variant={buttonVariants[index]} key={c.id}>
                                    <div className="px-4 text-[50px]">{options[index]}</div>
                                    <div className="text-[25px]">{c.text}</div>
                                </Button>
                            ))}
                    </div>
                </div>
            )}

            {/* --- CEVAP İSTATİSTİKLERİ --- */}
            {adminState === "answer" && (
                <div>
                    <h2>İstatistikler</h2>

                    {stats?.counts ? (() => {
                        const maxCount = Math.max(
                            1,
                            ...Object.values(stats.counts).map(Number)
                        );


                        return (
                            <div className="flex flex-col items-center">
                                {/* BAR CHART */}
                                <div className="flex gap-6 items-end h-[300px] mb-6">
                                    {currentQuestion.choices.map((c: any, index: number) => {
                                        const count = stats.counts[c.id] ?? 0;
                                        const height = maxCount ? (count / maxCount) * 100 : 0;

                                        return (
                                            <div
                                                key={c.id}
                                                className="flex flex-col items-center w-[120px]"
                                            >
                                                {/* sayı */}
                                                <div className="text-white text-[32px] font-bold mb-2">
                                                    {count}
                                                </div>

                                                {/* bar */}
                                                <div
                                                    className={`
                                            w-full rounded-t-lg transition-all duration-700
                                            ${index === 0 && "bg-[#63AEA8]"}
                                            ${index === 1 && "bg-[#E06085]"}
                                            ${index === 2 && "bg-[#C57CEA]"}
                                            ${index === 3 && "bg-[#F9C479]"}
                                        `}
                                                    style={{ height: `${height}%` }}
                                                />

                                                {/* harf */}
                                                <div className="text-white text-[28px] font-bold mt-2">
                                                    {options[index]}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* SORU */}
                                <h3
                                    className={`text-[30px] mb-[12px] ${!currentQuestion.imageUrl && "mt-[15%]"
                                        }`}
                                >
                                    {currentQuestion.text}
                                </h3>

                                {/* CEVAPLAR */}
                                <div className="grid grid-cols-2 gap-[12px] w-[800px] h-[250px]">
                                    {currentQuestion.choices.map((c: any, index: number) => {
                                        const count = stats.counts[c.id] ?? 0;
                                        const isSelected = count > 0;

                                        return (
                                            <Button
                                                key={c.id}
                                                variant={buttonVariants[index]}
                                                className={`flex items-center font-bold ${isSelected &&
                                                    "shadow-[inset_0px_0px_150px_0px_rgba(0,0,0,1)]"
                                                    }`}
                                            >
                                                <div
                                                    className={`px-4 text-[50px] ${isSelected && "opacity-50"
                                                        }`}
                                                >
                                                    {options[index]}
                                                </div>

                                                <div
                                                    className={`text-[25px] ${isSelected && "opacity-50"
                                                        }`}
                                                >
                                                    {c.text}
                                                </div>

                                                <div className="ml-auto text-[20px] opacity-80">
                                                    {count}
                                                </div>
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })() : (
                        <p>Henüz istatistik yok.</p>
                    )}
                </div>
            )}
            {/* --- SKOR TABLOSU --- */}
            {adminState === "scoreboard" && (
                <div className="w-full max-w-2xl">
                    <h2 className="text-center mb-6 text-[32px] font-bold">{JSON.stringify(scoreboard)}</h2>
                </div>
            )}

        </div>
    );
}
