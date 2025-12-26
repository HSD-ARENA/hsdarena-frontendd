"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { socketManager } from "@/realtime/socket";
import { useSession } from "@/domains/session/useSession";
import OverlaySpinner from "@/components/ui/OverlaySpinner";

import { QuestionStartedPayload, AnswerSubmittedPayload, AnswerStatsUpdatedPayload } from "@/realtime/realtime.types";
import { LeaderboardEntry } from "@/domains/session/scoreboard.types";

interface AnswerStats {
    stats: Record<string, number>;
}

interface PageProps {
    params: Promise<{ sessionCode: string }>;
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
    const [stats, setStats] = useState<AnswerStats | null>(null);
    const [answeredCount, setAnsweredCount] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null); // Countdown timer in seconds

    const options = ['H', 'S', 'D', 'A'];

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

                // Connect WebSocket - wait for connection
                await socketManager.connect(token);

                // Join session
                socketManager.joinSession(sessionCode);

                // Fetch initial data
                await fetchSession(sessionCode);

                // Try to fetch current question, but don't fail if it doesn't exist yet
                try {
                    await fetchCurrentQuestion(sessionCode);
                } catch (error) {
                    console.log("⏳ No question yet, waiting for question:started event...");
                }

                // Listen to events
                const unsubscribers: Array<() => void> = [];

                // New question started
                unsubscribers.push(
                    socketManager.on('question:started', async (data: QuestionStartedPayload) => {
                        console.log("❓ Question started:", data);
                        const questionData = await fetchCurrentQuestion(sessionCode);
                        setScreen("question");
                        setStats(null);
                        setAnsweredCount(0);
                        // Initialize timer from fetched question data
                        if (questionData?.timeLimitSec) {
                            setTimeRemaining(questionData.timeLimitSec);
                        } else if (data.question?.timeLimitSec) {
                            // Fallback to event data
                            setTimeRemaining(data.question.timeLimitSec);
                        }
                    })
                );

                // Team submitted answer
                unsubscribers.push(
                    socketManager.on('answer:submitted', (data: AnswerSubmittedPayload) => {
                        console.log("✅ Team answered:", data.teamId);
                        setAnsweredCount(prev => prev + 1);
                    })
                );

                // Time's up - auto navigate to scoreboard
                unsubscribers.push(
                    socketManager.on('time:up', () => {
                        console.log("⏰ Time's up!");
                        setTimeRemaining(0);
                        // Auto-navigate to scoreboard after brief delay
                        setTimeout(async () => {
                            await fetchScoreboard(sessionCode);
                            setScreen("scoreboard");
                        }, 1000);
                    })
                );

                // Answer stats updated
                unsubscribers.push(
                    socketManager.on('answer:stats-updated', (data: AnswerStatsUpdatedPayload) => {
                        console.log("📊 Stats updated:", data);
                        setStats(data);
                    })
                );

                // Scoreboard updated
                unsubscribers.push(
                    socketManager.on('scoreboard:updated', () => {
                        console.log("\ud83c\udfc6 Scoreboard updated");
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
    }, [sessionCode, fetchSession, fetchCurrentQuestion, fetchScoreboard]);

    // Countdown timer
    useEffect(() => {
        if (timeRemaining === null || timeRemaining <= 0) return;

        const interval = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev === null || prev <= 1) return 0;
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timeRemaining]);

    // Fallback: Initialize timer when currentQuestion changes (for first question)
    useEffect(() => {
        if (currentQuestion?.timeLimitSec && screen === "question" && timeRemaining === null) {
            console.log("🔧 Fallback timer init:", currentQuestion.timeLimitSec);
            setTimeRemaining(currentQuestion.timeLimitSec);
        }
    }, [currentQuestion, screen, timeRemaining]);

    // Show scoreboard
    const showScoreboard = async () => {
        await fetchScoreboard(sessionCode);
        setScreen("scoreboard");
    };

    // Go to next question
    const nextQuestion = () => {
        console.log("⏭️ Requesting next question");
        socketManager.emit("admin:next-question", { sessionCode });
        // Don't set screen here - wait for question:started event
    };

    // End session
    const endSession = () => {
        const confirm = window.confirm("Quiz'i bitirmek istediğinize emin misiniz?");
        if (!confirm) return;

        console.log("🏁 Ending session");
        socketManager.emit("admin:end-session", { sessionCode });

        alert("Quiz bitti!");
        window.location.href = "/admin";
    };

    // Right arrow navigation
    const handleRightArrow = () => {
        if (screen === "question") showScoreboard(); // Skip stats, go directly to scoreboard
        else if (screen === "scoreboard") nextQuestion();
    };

    // Start Quiz Handler
    const startQuiz = () => {
        console.log("🚀 Starting quiz");
        socketManager.emit("admin:next-question", { sessionCode });
    };

    // Copy to clipboard
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert("Link kopyalandı!");
    };

    // Loading - waiting for session details
    if (!isReady) {
        return <OverlaySpinner />;
    }

    // QR Code & Participation Info Screen (Before Quiz Starts)
    if (!currentQuestion) {
        const joinUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/team/join?sessionCode=${sessionCode}`;
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(joinUrl)}`;
        const participantCount = sessionDetail?.teams?.length ?? 0;
        const questionCount = sessionDetail?.quiz?.questions.length ?? 0;

        return (
            <div className="bg-[#0f0404] text-[#ffe4e6] h-screen flex flex-col overflow-hidden selection:bg-[#dc2626] selection:text-white">
                {/* Navigation Bar */}
                <nav className="bg-[#1f0a0a] border-b border-[#451a1a] h-16 flex-shrink-0 z-20 shadow-lg shadow-red-900/5">
                    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={endSession}
                                className="p-2 rounded-full hover:bg-[#2d0f0f] text-[#fda4af] hover:text-white transition-colors"
                            >
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
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main className="flex-1 overflow-hidden relative flex flex-col items-center justify-center p-4">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#dc2626]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#dc2626]/5 rounded-full blur-3xl pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

                    <div className="w-full max-w-4xl relative z-10">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
                                QR Kod & Katılım Bilgileri
                            </h2>
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                                <span className="material-icons-round text-base mr-1.5">wifi</span>
                                Bağlantı Aktif
                            </div>
                        </div>

                        {/* Main Card */}
                        <div className="bg-[#1f0a0a] rounded-3xl shadow-2xl border border-[#451a1a] p-6 md:p-10 flex flex-col md:flex-row gap-8 md:gap-12 items-center">
                            {/* QR Code */}
                            <div className="flex-shrink-0 flex flex-col items-center justify-center">
                                <div className="bg-white p-4 rounded-2xl shadow-lg shadow-white/5 relative group">
                                    <div className="w-48 h-48 md:w-56 md:h-56 bg-white flex items-center justify-center overflow-hidden">
                                        <img
                                            alt="QR Kod"
                                            className="w-full h-full object-contain"
                                            src={qrCodeUrl}
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-[#dc2626]/0 group-hover:bg-[#dc2626]/5 transition-colors duration-300 rounded-2xl pointer-events-none"></div>
                                </div>
                                <p className="mt-4 text-[#fda4af] text-sm font-medium">Katılmak için taratın</p>
                            </div>

                            {/* Info Section */}
                            <div className="flex-1 w-full space-y-6">
                                {/* Session Code */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[#fda4af] mb-2 ml-1">
                                        Oturum Kodu
                                    </label>
                                    <div className="bg-[#2d0f0f] border border-[#451a1a] rounded-2xl p-4 text-center">
                                        <span className="text-4xl md:text-5xl font-mono font-black text-white tracking-[0.2em] select-all">
                                            {sessionCode}
                                        </span>
                                    </div>
                                </div>

                                {/* Join Link */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-[#fda4af] mb-2 ml-1">
                                        Katılım Linki
                                    </label>
                                    <div className="flex shadow-inner bg-[#2d0f0f] rounded-xl border border-[#451a1a] overflow-hidden focus-within:ring-2 focus-within:ring-[#dc2626] focus-within:border-transparent transition-all">
                                        <input
                                            className="flex-1 bg-transparent border-none text-white placeholder-[#fda4af]/50 text-sm py-3 px-4 focus:ring-0 truncate font-mono"
                                            readOnly
                                            type="text"
                                            value={joinUrl}
                                        />
                                        <button
                                            onClick={() => copyToClipboard(joinUrl)}
                                            className="bg-[#451a1a] hover:bg-[#451a1a]/80 text-white px-5 py-2 font-medium text-sm transition-colors border-l border-[#451a1a] flex items-center gap-2 group"
                                        >
                                            <span className="material-icons-round text-base group-hover:scale-110 transition-transform">content_copy</span>
                                            <span>Kopyala</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="h-px w-full bg-[#451a1a]/50"></div>

                                {/* Start Quiz Button */}
                                <button
                                    onClick={startQuiz}
                                    className="w-full group relative flex items-center justify-center gap-3 bg-gradient-to-r from-[#dc2626] to-[#b91c1c] hover:from-red-500 hover:to-red-600 text-white font-bold text-lg py-4 px-6 rounded-xl shadow-lg shadow-red-900/40 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-red-900/60"
                                >
                                    <span className="absolute inset-0 w-full h-full bg-white/20 group-hover:bg-transparent transition-colors rounded-xl opacity-0 group-hover:opacity-100 animate-pulse"></span>
                                    <span className="material-icons-round text-2xl group-hover:rotate-12 transition-transform">rocket_launch</span>
                                    Quizi Başlat
                                </button>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <div className="bg-[#1f0a0a]/50 border border-[#451a1a]/50 rounded-lg p-3 backdrop-blur-sm">
                                <p className="text-[#fda4af] text-xs uppercase font-bold mb-1">Katılımcı Sayısı</p>
                                <p className="text-white text-lg font-bold flex items-center justify-center gap-2">
                                    <span className="material-icons-round text-[#dc2626] text-sm">groups</span> {participantCount} Kişi
                                </p>
                            </div>
                            <div className="bg-[#1f0a0a]/50 border border-[#451a1a]/50 rounded-lg p-3 backdrop-blur-sm">
                                <p className="text-[#fda4af] text-xs uppercase font-bold mb-1">Durum</p>
                                <p className="text-emerald-400 text-lg font-bold flex items-center justify-center gap-2">
                                    <span className="material-icons-round text-emerald-400 text-sm">check_circle</span> Hazır
                                </p>
                            </div>
                            <div className="bg-[#1f0a0a]/50 border border-[#451a1a]/50 rounded-lg p-3 backdrop-blur-sm">
                                <p className="text-[#fda4af] text-xs uppercase font-bold mb-1">Soru Sayısı</p>
                                <p className="text-white text-lg font-bold flex items-center justify-center gap-2">
                                    <span className="material-icons-round text-[#dc2626] text-sm">quiz</span> {questionCount} Soru
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    const totalQuestions = sessionDetail?.quiz?.questions.length ?? 1;
    const questionIndex = (currentQuestion.indexInQuiz ?? 0) + 1; // Display as 1-based

    return (
        <div className="bg-[#0f0404] text-[#ffe4e6] h-screen flex flex-col overflow-hidden selection:bg-[#dc2626] selection:text-white">
            {/* Navigation Bar */}
            <nav className="bg-[#1f0a0a] border-b border-[#451a1a] h-16 flex-shrink-0 z-20 shadow-lg shadow-red-900/5">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={endSession}
                            className="p-2 rounded-full hover:bg-[#2d0f0f] text-[#fda4af] hover:text-white transition-colors flex items-center gap-2"
                        >
                            <span className="material-icons-round">arrow_back</span>
                            <span className="text-sm hidden md:inline">Bitir</span>
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#dc2626] to-[#b91c1c] rounded-lg flex items-center justify-center text-white font-bold shadow-md shadow-red-900/20">H</div>
                            <h1 className="text-xl font-bold tracking-tight text-white">HSD <span className="text-[#dc2626] font-extrabold">ARENA</span></h1>
                        </div>
                    </div>

                    {/* Center - Question Progress */}
                    <div className="flex flex-col items-center">
                        <div className="text-white text-lg font-bold">
                            Soru {questionIndex}/{totalQuestions}
                        </div>
                        {answeredCount > 0 && (
                            <p className="text-xs text-[#fda4af]">
                                ✅ {answeredCount} takım cevapladı
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleRightArrow}
                            className="p-2 rounded-full hover:bg-[#2d0f0f] text-[#fda4af] hover:text-white transition-colors flex items-center gap-2"
                        >
                            <span className="text-sm hidden md:inline">
                                {screen === "question" ? "Skor Tablosu" : "Sonraki"}
                            </span>
                            <span className="material-icons-round">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden relative flex flex-col items-center justify-center p-4">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#dc2626]/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

                {/* QUESTION SCREEN */}
                {screen === "question" && (
                    <div className="flex flex-col items-center w-full max-w-6xl relative z-10">
                        {currentQuestion.imageUrl && (
                            <Image
                                src={currentQuestion.imageUrl}
                                alt="question"
                                width={800}
                                height={300}
                                className="mb-4 max-h-[300px] object-contain rounded-2xl"
                            />
                        )}
                        {timeRemaining !== null && timeRemaining > 0 && (
                            <div className="mb-6 text-5xl font-bold text-white bg-gradient-to-r from-[#dc2626] to-[#b91c1c] px-8 py-4 rounded-xl shadow-lg animate-pulse">
                                ⏱️ {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                            </div>
                        )}
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">{currentQuestion.text}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
                            {currentQuestion.choices.map((c, index: number) => (
                                <div
                                    key={c.id}
                                    className={`
                                        flex items-center gap-4 p-6 rounded-2xl border-2 transition-all
                                        ${index === 0 && "bg-[#63AEA8]/20 border-[#63AEA8]"}
                                        ${index === 1 && "bg-[#E06085]/20 border-[#E06085]"}
                                        ${index === 2 && "bg-[#C57CEA]/20 border-[#C57CEA]"}
                                        ${index === 3 && "bg-[#F9C479]/20 border-[#F9C479]"}
                                    `}
                                >
                                    <div className={`
                                        text-5xl font-black w-16 h-16 flex items-center justify-center rounded-xl
                                        ${index === 0 && "bg-[#63AEA8] text-white"}
                                        ${index === 1 && "bg-[#E06085] text-white"}
                                        ${index === 2 && "bg-[#C57CEA] text-white"}
                                        ${index === 3 && "bg-[#F9C479] text-white"}
                                    `}>
                                        {options[index]}
                                    </div>
                                    <div className="text-xl md:text-2xl font-semibold text-white flex-1">{c.text}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* STATS SCREEN */}
                {screen === "stats" && stats && (
                    <div className="w-full flex flex-col items-center max-w-6xl relative z-10">
                        <h2 className="text-4xl font-bold mb-8 text-white">Cevap İstatistikleri</h2>
                        {(() => {
                            const counts = Object.values(stats.stats).map(Number);
                            const maxCount = Math.max(1, ...counts);

                            return (
                                <div className="flex flex-col items-center w-full">
                                    {/* Bar Chart */}
                                    <div className="flex gap-8 items-end h-[300px] mb-8">
                                        {currentQuestion.choices.map((c, index: number) => {
                                            const count = stats.stats[c.id] ?? 0;
                                            const height = (count / maxCount) * 100;

                                            return (
                                                <div key={c.id} className="flex flex-col items-center w-[140px]">
                                                    <div className="text-4xl font-bold mb-2 text-white">{count}</div>
                                                    <div
                                                        className={`w-full rounded-t-lg transition-all duration-700
                                                            ${index === 0 && "bg-[#63AEA8]"}
                                                            ${index === 1 && "bg-[#E06085]"}
                                                            ${index === 2 && "bg-[#C57CEA]"}
                                                            ${index === 3 && "bg-[#F9C479]"}
                                                        `}
                                                        style={{ height: `${height}%` }}
                                                    />
                                                    <div className="text-3xl font-bold mt-2 text-white">
                                                        {options[index]}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Question */}
                                    <h3 className="text-3xl mb-6 text-white font-bold">{currentQuestion.text}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
                                        {currentQuestion.choices.map((c, index: number) => {
                                            const count = stats.stats[c.id] ?? 0;

                                            return (
                                                <div
                                                    key={c.id}
                                                    className={`
                                                        flex items-center gap-4 p-6 rounded-2xl border-2 transition-all
                                                        ${index === 0 && "bg-[#63AEA8]/20 border-[#63AEA8]"}
                                                        ${index === 1 && "bg-[#E06085]/20 border-[#E06085]"}
                                                        ${index === 2 && "bg-[#C57CEA]/20 border-[#C57CEA]"}
                                                        ${index === 3 && "bg-[#F9C479]/20 border-[#F9C479]"}
                                                        ${count > 0 && "opacity-60"}
                                                    `}
                                                >
                                                    <div className={`
                                                        text-5xl font-black w-16 h-16 flex items-center justify-center rounded-xl
                                                        ${index === 0 && "bg-[#63AEA8] text-white"}
                                                        ${index === 1 && "bg-[#E06085] text-white"}
                                                        ${index === 2 && "bg-[#C57CEA] text-white"}
                                                        ${index === 3 && "bg-[#F9C479] text-white"}
                                                    `}>
                                                        {options[index]}
                                                    </div>
                                                    <div className="text-xl md:text-2xl font-semibold text-white flex-1">{c.text}</div>
                                                    <div className="text-2xl font-bold text-white">{count}</div>
                                                </div>
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
                    <div className="w-full max-w-4xl px-4 relative z-10">
                        <h2 className="text-center mb-8 text-4xl font-bold text-white">🏆 Skor Tablosu</h2>
                        {scoreboard?.leaderboard && scoreboard.leaderboard.length > 0 ? (
                            <div className="space-y-4">
                                {scoreboard.leaderboard.map((team: LeaderboardEntry, index: number) => (
                                    <div
                                        key={team.teamId}
                                        className="flex items-center justify-between bg-[#1f0a0a] border border-[#451a1a] rounded-xl p-6 hover:border-[#dc2626]/50 transition-all"
                                    >
                                        <div className="flex items-center gap-6">
                                            <div className={`
                                                text-4xl font-black w-16 h-16 flex items-center justify-center rounded-xl
                                                ${index === 0 && "bg-yellow-500 text-white"}
                                                ${index === 1 && "bg-gray-300 text-gray-800"}
                                                ${index === 2 && "bg-orange-600 text-white"}
                                                ${index > 2 && "bg-[#451a1a] text-white"}
                                            `}>
                                                #{index + 1}
                                            </div>
                                            <div className="text-2xl font-semibold text-white">{team.teamName}</div>
                                        </div>
                                        <div className="text-4xl font-bold text-[#dc2626]">
                                            {team.score} <span className="text-xl text-[#fda4af]">pts</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-xl text-[#fda4af]">Henüz skor yok</div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}