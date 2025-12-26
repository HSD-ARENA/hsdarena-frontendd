"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { socketManager } from "@/realtime/socket";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { QuestionStartedPayload, QuestionTimeWarningPayload } from "@/realtime/realtime.types";
import { CurrentQuestionResponse } from "@/domains/questions/question.types";

interface PageProps {
    params: Promise<{ sessionCode: string }>;
}

export default function TeamQuizPage({ params }: PageProps) {
    const [sessionCode, setSessionCode] = useState("");
    const [screen, setScreen] = useState<"waiting" | "question" | "answered" | "result">("waiting");
    const [currentQuestion, setCurrentQuestion] = useState<CurrentQuestionResponse | null>(null);
    const [timeWarning, setTimeWarning] = useState<number | null>(null);
    const [result, setResult] = useState<{ isCorrect: boolean; points: number; isTimeout?: boolean } | null>(null);
    const [pendingResult, setPendingResult] = useState<{ isCorrect: boolean; points: number; isTimeout?: boolean } | null>(null);
    const pendingResultRef = useRef<{ isCorrect: boolean; points: number; isTimeout?: boolean } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
    const setupDone = useRef(false);
    const router = useRouter();

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

        // Check team token
        const teamToken = localStorage.getItem("teamToken");
        if (!teamToken) {
            alert("Takım token'ı bulunamadı!");
            router.push(`/team/join?sessionCode=${sessionCode}`);
            return;
        }

        setupDone.current = true;

        async function setup() {
            try {
                console.log("🚀 Team setup for:", sessionCode);

                // Connect WebSocket - wait for connection
                await socketManager.connect(teamToken!);

                // Join session
                socketManager.joinSession(sessionCode);

                // Listen to events
                const unsubscribers: Array<() => void> = [];

                // Question started
                unsubscribers.push(
                    socketManager.on('question:started', (data: QuestionStartedPayload) => {
                        console.log("❓ Question started:", data);
                        // Map Question to CurrentQuestionResponse
                        setCurrentQuestion({
                            id: data.question.id,
                            text: data.question.text,
                            type: data.question.type as "MCQ" | "TF" | "TRUE_FALSE" | "OPEN_ENDED",
                            choices: (data.question.choices || []).map((c) => ({
                                id: c.id as "A" | "B" | "C" | "D",
                                text: c.text
                            })),
                            timeLimitSec: data.question.timeLimitSec,
                            points: data.question.points,
                            indexInQuiz: data.questionIndex
                        });
                        setScreen("question");
                        setTimeWarning(null);
                        setResult(null);
                        setPendingResult(null); // Clear pending result for new question
                        pendingResultRef.current = null; // Also clear ref
                        setIsSubmitting(false);
                        // Initialize timer
                        if (data.question?.timeLimitSec) {
                            setTimeRemaining(data.question.timeLimitSec);
                        }
                    })
                );

                // Time warning
                unsubscribers.push(
                    socketManager.on('question:time-warning', (data: QuestionTimeWarningPayload) => {
                        console.log("⏰ Time warning:", data.remainingSeconds);
                        setTimeWarning(data.remainingSeconds);
                    })
                );

                // Time's up - show result
                unsubscribers.push(
                    socketManager.on('time:up', () => {
                        console.log("⏰ Time's up!");
                        setTimeRemaining(0);
                        setScreen("result");

                        // If answer was submitted, show the actual result
                        // Otherwise show "time expired" message
                        const answerResult = pendingResultRef.current;
                        if (answerResult) {
                            setResult(answerResult);
                            setPendingResult(null);
                            pendingResultRef.current = null;
                        } else {
                            setResult({ isCorrect: false, points: 0, isTimeout: true });
                        }
                    })
                );

                // Session ended
                unsubscribers.push(
                    socketManager.on('session:ended', () => {
                        console.log("🏁 Session ended");
                        alert("Quiz bitti!");
                        router.push("/team/finished");
                    })
                );

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
    }, [sessionCode, router, screen]);

    // Submit answer
    const handleSubmit = async (choiceId: string) => {
        if (!currentQuestion || isSubmitting) return; // Prevent if already submitting

        // Lock question ID at submit time to prevent race conditions
        const questionIdAtSubmit = currentQuestion.id;

        try {
            setIsSubmitting(true);
            setScreen("answered"); // Stay in "answered" screen until timer expires

            // Submit via HTTP POST
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sessions/${sessionCode}/answer`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("teamToken")}`
                },
                body: JSON.stringify({
                    sessionCode,
                    questionId: questionIdAtSubmit, // Use locked ID
                    answerPayload: { choiceId }
                })
            });

            if (!response.ok) {
                throw new Error("Answer submission failed");
            }

            const data = await response.json();

            // Store result but don't show it yet - wait for timer to expire
            const answerResult = {
                isCorrect: data.isCorrect,
                points: data.points
            };
            setPendingResult(answerResult);
            pendingResultRef.current = answerResult; // Also store in ref for WebSocket handler
            // Screen stays "answered" until time:up event

            console.log("✅ Answer submitted, waiting for timer:", data);
        } catch (error) {
            console.error("❌ Submit failed:", error);
            alert("Cevap gönderilemedi!");
            setScreen("question");
            setIsSubmitting(false); // Reset on error
        }
    };

    return (
        <div className="min-h-screen text-white flex flex-col relative overflow-hidden selection:bg-[#D90429] selection:text-white" style={{
            backgroundColor: '#1a0505',
            backgroundImage: `
                radial-gradient(at 0% 0%, hsla(353,96%,29%,0.4) 0px, transparent 50%),
                radial-gradient(at 100% 0%, hsla(353,90%,30%,0.3) 0px, transparent 50%),
                radial-gradient(at 100% 100%, hsla(350,100%,20%,0.4) 0px, transparent 50%),
                radial-gradient(at 0% 100%, hsla(0,0%,10%,1) 0px, transparent 50%)
            `
        }}>
            {/* Animated Blur Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#D90429]/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-float"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-900/40 rounded-full blur-[120px] pointer-events-none mix-blend-screen animate-float" style={{ animationDelay: '2s' }}></div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
                {/* WAITING SCREEN */}
                {screen === "waiting" && (
                    <div className="text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-[#dc2626] to-[#b91c1c] rounded-full flex items-center justify-center mb-8 shadow-lg shadow-red-900/50 mx-auto animate-pulse">
                            <span className="material-icons-round text-5xl text-white">hourglass_empty</span>
                        </div>
                        <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Soru Bekleniyor...</h2>
                        <p className="text-xl text-gray-300">Quiz başlatıldığında soru görünecek</p>
                    </div>
                )}

                {/* QUESTION SCREEN */}
                {screen === "question" && currentQuestion && (
                    <div className="flex flex-col items-center w-full max-w-4xl">
                        {/* Time Warning */}
                        {timeWarning && (
                            <div className="mb-6 px-6 py-3 bg-yellow-500/20 border border-yellow-500/40 rounded-xl text-yellow-300 text-xl font-bold animate-pulse inline-flex items-center gap-2">
                                <span className="material-icons-round">schedule</span>
                                {timeWarning} saniye kaldı!
                            </div>
                        )}

                        {/* Question Card */}
                        <div className="w-full bg-[#1f0a0a]/80 border border-[#451a1a] rounded-2xl p-8 shadow-2xl backdrop-blur-sm mb-8">
                            {/* Question Image */}
                            {currentQuestion.imageUrl && (
                                <Image
                                    src={currentQuestion.imageUrl}
                                    alt="question"
                                    width={800}
                                    height={300}
                                    className="mb-6 max-h-[300px] object-contain rounded-xl mx-auto"
                                />
                            )}

                            {/* Question Text */}
                            <h3 className="text-3xl md:text-4xl font-bold text-center text-white mb-2">{currentQuestion.text}</h3>
                            <p className="text-center text-[#fda4af] text-sm">Cevabınızı seçin</p>
                        </div>

                        {/* Choices */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            {currentQuestion.choices.map((choice, index: number) => (
                                <button
                                    key={choice.id}
                                    onClick={() => handleSubmit(choice.id)}
                                    className={`
                                        flex items-center gap-4 p-6 rounded-2xl border-2 transition-all transform hover:scale-[1.02]
                                        ${index === 0 && "bg-[#63AEA8]/20 border-[#63AEA8] hover:bg-[#63AEA8]/30"}
                                        ${index === 1 && "bg-[#E06085]/20 border-[#E06085] hover:bg-[#E06085]/30"}
                                        ${index === 2 && "bg-[#C57CEA]/20 border-[#C57CEA] hover:bg-[#C57CEA]/30"}
                                        ${index === 3 && "bg-[#F9C479]/20 border-[#F9C479] hover:bg-[#F9C479]/30"}
                                    `}
                                >
                                    <div className={`
                                        text-4xl md:text-5xl font-black w-16 h-16 flex items-center justify-center rounded-xl
                                        ${index === 0 && "bg-[#63AEA8] text-white"}
                                        ${index === 1 && "bg-[#E06085] text-white"}
                                        ${index === 2 && "bg-[#C57CEA] text-white"}
                                        ${index === 3 && "bg-[#F9C479] text-white"}
                                    `}>
                                        {options[index]}
                                    </div>
                                    <div className="text-lg md:text-xl font-semibold text-white flex-1 text-left">{choice.text}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ANSWERED SCREEN */}
                {screen === "answered" && (
                    <div className="text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-blue-900/50 mx-auto animate-pulse">
                            <span className="material-icons-round text-5xl text-white">check_circle</span>
                        </div>
                        <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Cevabınız Gönderildi!</h2>
                        <p className="text-xl text-gray-300">Sonuç bekleniyor...</p>
                        <div className="mt-8 inline-flex items-center gap-3 px-6 py-3 bg-blue-500/20 border border-blue-500/40 rounded-full">
                            <div className="animate-spin">
                                <span className="material-icons-round text-blue-400">sync</span>
                            </div>
                            <span className="text-blue-300 font-medium">İşleniyor...</span>
                        </div>
                    </div>
                )}

                {/* RESULT SCREEN */}
                {screen === "result" && result && (
                    <div className="text-center">
                        {result.isCorrect ? (
                            <>
                                <div className="w-32 h-32 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-emerald-900/50 mx-auto">
                                    <span className="material-icons-round text-8xl text-white">check_circle</span>
                                </div>
                                <h2 className="text-5xl font-bold mb-4 text-emerald-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Doğru!</h2>
                                <div className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl">
                                    <span className="material-icons-round text-emerald-400">star</span>
                                    <p className="text-3xl font-bold text-emerald-300">+{result.points} puan</p>
                                </div>
                            </>
                        ) : result.isTimeout ? (
                            <>
                                <div className="w-32 h-32 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-gray-900/50 mx-auto">
                                    <span className="material-icons-round text-8xl text-white">schedule</span>
                                </div>
                                <h2 className="text-5xl font-bold mb-4 text-gray-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Süre Doldu!</h2>
                                <p className="text-2xl text-gray-300">Soruyu boş bıraktınız</p>
                            </>
                        ) : (
                            <>
                                <div className="w-32 h-32 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-red-900/50 mx-auto">
                                    <span className="material-icons-round text-8xl text-white">cancel</span>
                                </div>
                                <h2 className="text-5xl font-bold mb-4 text-red-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Yanlış!</h2>
                                <p className="text-2xl text-gray-300">Puan kazanamadınız</p>
                            </>
                        )}

                        <p className="mt-8 text-xl text-gray-400 flex items-center justify-center gap-2">
                            <span className="material-icons-round animate-pulse">pending</span>
                            Bir sonraki soru bekleniyor...
                        </p>
                    </div>
                )}
            </div>

            {/* Keyframe Animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}