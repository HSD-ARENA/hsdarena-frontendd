"use client";

import { useEffect, useState, useRef } from "react";
import { socketManager } from "@/realtime/socket";
import { useSession } from "@/domains/session/useSession";
import Button from "@/components/ui/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PageProps {
    params: { sessionCode: string } | Promise<{ sessionCode: string }>;
}

export default function AdminQuizSessionPage({ params }: PageProps) {
    const [sessionCode, setSessionCode] = useState("");
    const [isReady, setIsReady] = useState(false);
    const setupDone = useRef(false);

    const {
        sessionDetail,
        currentQuestion,
        scoreboard,
        fetchSession,
        fetchCurrentQuestion,
        fetchScoreboard
    } = useSession();

    const [screen, setScreen] = useState<"question" | "stats" | "scoreboard">("question");
    const [stats, setStats] = useState<any>(null);
    const [answeredCount, setAnsweredCount] = useState(0);

    const options = ['H', 'S', 'D', 'A'];
    const buttonVariants = ["button1", "button2", "button3", "button4"] as const;

    // Extract session code
    useEffect(() => {
        async function getParams() {
            const resolvedParams = params instanceof Promise ? await params : params;
            setSessionCode(resolvedParams.sessionCode);
        }
        getParams();
    }, [params]);

    // Setup WebSocket - ONLY ONCE
    useEffect(() => {
        if (!sessionCode || setupDone.current) return;

        setupDone.current = true;

        async function setup() {
            try {
                console.log("🚀 Admin setup for:", sessionCode);

                // Get admin token
                const token = localStorage.getItem("token") || "";

                // Connect WebSocket
                socketManager.connect(token);

                // Join session
                socketManager.joinSession(sessionCode);

                // Fetch initial data
                await Promise.all([
                    fetchSession(sessionCode),
                    fetchCurrentQuestion(sessionCode)
                ]);

                // Listen to events
                const unsubscribers: Array<() => void> = [];

                // New question started
                unsubscribers.push(
                    socketManager.on('question:started', (data: any) => {
                        console.log("❓ Question started:", data);
                        fetchCurrentQuestion(sessionCode);
                        setScreen("question");
                        setStats(null);
                        setAnsweredCount(0);
                    })
                );

                // Team submitted answer
                unsubscribers.push(
                    socketManager.on('answer:submitted', (data: any) => {
                        console.log("✅ Team answered:", data.teamId);
                        setAnsweredCount(prev => prev + 1);
                    })
                );

                // Answer stats updated
                unsubscribers.push(
                    socketManager.on('answer:stats-updated', (data: any) => {
                        console.log("📊 Stats updated:", data);
                        setStats(data);
                    })
                );

                // Scoreboard updated
                unsubscribers.push(
                    socketManager.on('scoreboard:updated', (data: any) => {
                        console.log("🏆 Scoreboard updated:", data);
                        fetchScoreboard(sessionCode);
                    })
                );

                setIsReady(true);
                console.log("✅ Setup complete");

                // Cleanup
                return () => {
                    unsubscribers.forEach(unsub => unsub());
                };
            } catch (error) {
                console.error("❌ Setup failed:", error);
            }
        }

        setup();
    }, [sessionCode]);

    // Show answer stats
    const showStats = () => {
        setScreen("stats");
    };

    // Show scoreboard
    const showScoreboard = async () => {
        await fetchScoreboard(sessionCode);
        setScreen("scoreboard");
    };

    // Go to next question
    const nextQuestion = () => {
        console.log("⏭️ Next question");
        socketManager.emit("admin:next-question", { sessionCode });
        setScreen("question");
    };

    // End session
    const endSession = () => {
        const confirm = window.confirm("Quiz'i bitirmek istediğinize emin misiniz?");
        if (!confirm) return;

        console.log("🏁 Ending session");
        socketManager.emit("admin:end-session", { sessionCode });

        alert("Quiz bitti!");
        window.location.href = "/admin/quiz/list";
    };

    // Right arrow navigation
    const handleRightArrow = () => {
        if (screen === "question") showStats();
        else if (screen === "stats") showScoreboard();
        else if (screen === "scoreboard") nextQuestion();
    };

    // Loading
    if (!isReady || !currentQuestion) {
        return (
            <div className="flex items-center justify-center min-h-screen text-white">
                <div className="text-2xl">🔄 Yükleniyor...</div>
            </div>
        );
    }

    const totalQuestions = sessionDetail?.quiz?.questions.length ?? 1;
    const questionIndex = currentQuestion.indexInQuiz ?? 0;

    return (
        <div className="flex flex-col items-center w-full text-white min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between p-5 w-full">
                <button onClick={endSession} className="text-red-500 hover:text-red-400">
                    <ChevronLeft size={50} />
                    <span className="text-sm">Bitir</span>
                </button>

                <div className="flex flex-col items-center">
                    <h2 className="text-[30px] font-bold">
                        {questionIndex}/{totalQuestions}
                    </h2>
                    {answeredCount > 0 && (
                        <p className="text-sm opacity-70">
                            ✅ {answeredCount} takım cevapladı
                        </p>
                    )}
                </div>

                <button onClick={handleRightArrow} className="hover:scale-110 transition">
                    <ChevronRight size={50} />
                </button>
            </div>

            {/* QUESTION SCREEN */}
            {screen === "question" && (
                <div className="flex flex-col items-center">
                    {currentQuestion.imageUrl && (
                        <img
                            src={currentQuestion.imageUrl}
                            alt="question"
                            className="mb-4 max-h-[300px]"
                        />
                    )}
                    <h3 className="text-[30px] mb-[12px]">{currentQuestion.text}</h3>
                    <div className="grid grid-cols-2 gap-[12px] w-[800px] h-[275px]">
                        {currentQuestion.choices.map((c: any, index: number) => (
                            <Button
                                key={c.id}
                                variant={buttonVariants[index]}
                                className="flex items-center font-bold"
                            >
                                <div className="px-4 text-[50px]">{options[index]}</div>
                                <div className="text-[25px]">{c.text}</div>
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {/* STATS SCREEN */}
            {screen === "stats" && stats && (
                <div className="w-full flex flex-col items-center">
                    <h2 className="text-[32px] font-bold mb-8">Cevap İstatistikleri</h2>
                    {(() => {
                        const counts = Object.values(stats.stats).map(Number);
                        const maxCount = Math.max(1, ...counts);

                        return (
                            <div className="flex flex-col items-center">
                                {/* Bar Chart */}
                                <div className="flex gap-6 items-end h-[300px] mb-6">
                                    {currentQuestion.choices.map((c: any, index: number) => {
                                        const count = (stats.stats as any)[c.id] ?? 0;
                                        const height = (count / maxCount) * 100;

                                        return (
                                            <div key={c.id} className="flex flex-col items-center w-[120px]">
                                                <div className="text-[32px] font-bold mb-2">{count}</div>
                                                <div
                                                    className={`w-full rounded-t-lg transition-all duration-700
                                                        ${index === 0 && "bg-[#63AEA8]"}
                                                        ${index === 1 && "bg-[#E06085]"}
                                                        ${index === 2 && "bg-[#C57CEA]"}
                                                        ${index === 3 && "bg-[#F9C479]"}
                                                    `}
                                                    style={{ height: `${height}%` }}
                                                />
                                                <div className="text-[28px] font-bold mt-2">
                                                    {options[index]}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Question */}
                                <h3 className="text-[30px] mb-[12px]">{currentQuestion.text}</h3>
                                <div className="grid grid-cols-2 gap-[12px] w-[800px] h-[250px]">
                                    {currentQuestion.choices.map((c: any, index: number) => {
                                        const count = (stats.stats as any)[c.id] ?? 0;

                                        return (
                                            <Button
                                                key={c.id}
                                                variant={buttonVariants[index]}
                                                className={`flex items-center font-bold ${count > 0 && "opacity-60"
                                                    }`}
                                            >
                                                <div className="px-4 text-[50px]">{options[index]}</div>
                                                <div className="text-[25px]">{c.text}</div>
                                                <div className="ml-auto text-[20px]">{count}</div>
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })()}
                </div>
            )}

            {/* SCOREBOARD SCREEN */}
            {screen === "scoreboard" && (
                <div className="w-full max-w-4xl px-4">
                    <h2 className="text-center mb-6 text-[32px] font-bold">Skor Tablosu</h2>
                    {scoreboard?.leaderboard?.length > 0 ? (
                        <div className="space-y-4">
                            {scoreboard.leaderboard.map((team: any, index: number) => (
                                <div
                                    key={team.teamId}
                                    className="flex items-center justify-between bg-white/10 rounded-lg p-4"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="text-3xl font-bold">#{index + 1}</div>
                                        <div className="text-xl font-semibold">{team.teamName}</div>
                                    </div>
                                    <div className="text-3xl font-bold text-yellow-400">
                                        {team.score} pts
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-xl opacity-70">Henüz skor yok</div>
                    )}
                </div>
            )}
        </div>
    );
}