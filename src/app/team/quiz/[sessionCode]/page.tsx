"use client";

import { useEffect, useState, useRef } from "react";
import { socketManager } from "@/realtime/socket";
import Button from "@/components/ui/Button";
import { useRouter } from "next/navigation";

interface PageProps {
    params: { sessionCode: string } | Promise<{ sessionCode: string }>;
}

export default function TeamQuizPage({ params }: PageProps) {
    const [sessionCode, setSessionCode] = useState("");
    const [screen, setScreen] = useState<"waiting" | "question" | "answered" | "result">("waiting");
    const [currentQuestion, setCurrentQuestion] = useState<any>(null);
    const [timeWarning, setTimeWarning] = useState<number | null>(null);
    const [result, setResult] = useState<{ isCorrect: boolean; points: number } | null>(null);
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

                // Connect WebSocket
                socketManager.connect(teamToken!);

                // Join session
                socketManager.joinSession(sessionCode);

                // Listen to events
                const unsubscribers: Array<() => void> = [];

                // Question started
                unsubscribers.push(
                    socketManager.on('question:started', (data: any) => {
                        console.log("❓ Question started:", data);
                        setCurrentQuestion(data.question);
                        setScreen("question");
                        setTimeWarning(null);
                        setResult(null);
                    })
                );

                // Time warning
                unsubscribers.push(
                    socketManager.on('question:time-warning', (data: any) => {
                        console.log("⏰ Time warning:", data.remainingSeconds);
                        setTimeWarning(data.remainingSeconds);
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
    }, [sessionCode, router]);

    // Submit answer
    const handleSubmit = async (choiceId: string) => {
        if (!currentQuestion) return;

        try {
            setScreen("answered");

            // Submit via HTTP POST
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/answer`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("teamToken")}`
                },
                body: JSON.stringify({
                    sessionCode,
                    questionId: currentQuestion.id,
                    answerPayload: { choiceId }
                })
            });

            if (!response.ok) {
                throw new Error("Answer submission failed");
            }

            const data = await response.json();

            // Show result
            setResult({
                isCorrect: data.isCorrect,
                points: data.points
            });
            setScreen("result");

            console.log("✅ Answer submitted:", data);
        } catch (error) {
            console.error("❌ Submit failed:", error);
            alert("Cevap gönderilemedi!");
            setScreen("question");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-white p-4">
            {/* WAITING SCREEN */}
            {screen === "waiting" && (
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Soru Bekleniyor...</h2>
                    <p className="text-xl opacity-70">Quiz başlatıldığında soru görünecek</p>
                </div>
            )}

            {/* QUESTION SCREEN */}
            {screen === "question" && currentQuestion && (
                <div className="flex flex-col items-center w-full max-w-4xl">
                    {/* Time Warning */}
                    {timeWarning && (
                        <div className="mb-4 text-yellow-400 text-xl font-bold animate-pulse">
                            ⏰ {timeWarning} saniye kaldı!
                        </div>
                    )}

                    {/* Question Image */}
                    {currentQuestion.imageUrl && (
                        <img
                            src={currentQuestion.imageUrl}
                            alt="question"
                            className="mb-4 max-h-[300px]"
                        />
                    )}

                    {/* Question Text */}
                    <h3 className="text-[30px] mb-6 text-center">{currentQuestion.text}</h3>

                    {/* Choices */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        {currentQuestion.choices.map((choice: any, index: number) => (
                            <Button
                                key={choice.id}
                                onClick={() => handleSubmit(choice.id)}
                                variant={buttonVariants[index]}
                                className="flex items-center justify-start p-6 text-left"
                            >
                                <div className="px-4 text-[40px] font-bold">{options[index]}</div>
                                <div className="text-[20px]">{choice.text}</div>
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {/* ANSWERED SCREEN */}
            {screen === "answered" && (
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Cevabınız Gönderildi!</h2>
                    <p className="text-xl opacity-70">Sonuç bekleniyor...</p>
                    <div className="mt-6 animate-spin text-5xl">⏳</div>
                </div>
            )}

            {/* RESULT SCREEN */}
            {screen === "result" && result && (
                <div className="text-center">
                    {result.isCorrect ? (
                        <>
                            <div className="text-8xl mb-4">✅</div>
                            <h2 className="text-4xl font-bold mb-2 text-green-400">Doğru!</h2>
                            <p className="text-2xl">+{result.points} puan kazandınız</p>
                        </>
                    ) : (
                        <>
                            <div className="text-8xl mb-4">❌</div>
                            <h2 className="text-4xl font-bold mb-2 text-red-400">Yanlış!</h2>
                            <p className="text-2xl">Puan kazanamadınız</p>
                        </>
                    )}

                    <p className="mt-6 text-xl opacity-70">Bir sonraki soru bekleniyor...</p>
                </div>
            )}
        </div>
    );
}