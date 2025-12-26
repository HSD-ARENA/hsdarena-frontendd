"use client";

import { FC, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { socketManager } from "@/realtime/socket";
import { useRouter } from "next/navigation";

interface QRDisplayProps {
    sessionCode: string;
}

const QRDisplay: FC<QRDisplayProps> = ({ sessionCode }) => {
    const [url, setUrl] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Set join URL
        if (typeof window !== "undefined") {
            setUrl(`${window.location.origin}/team/join?sessionCode=${sessionCode}`);
        }

        // Connect WebSocket
        const token = localStorage.getItem("token") || "";
        socketManager.connect(token);

        // Join session
        socketManager.joinSession(sessionCode);

        setIsConnected(true);
        console.log("✅ WebSocket ready");

        // Cleanup on unmount
        return () => {
            // Don't disconnect - other pages might use it
        };
    }, [sessionCode]);

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        alert("Link kopyalandı!");
    };

    const startSession = async () => {
        try {
            // 1. Start session (set status to ACTIVE)
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/sessions/${sessionCode}/start`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            if (!response.ok) {
                throw new Error("Failed to start session");
            }

            console.log("✅ Session started (ACTIVE)");

            // 2. Broadcast first question
            socketManager.emit("admin:next-question", { sessionCode });
            console.log("✅ First question requested");

            // 3. Navigate to session page
            router.push(`/admin/quiz/session/${sessionCode}`);
        } catch (error) {
            console.error("❌ Failed to start session:", error);
            alert("Quiz başlatılamadı!");
        }
    };

    return (
        <>
            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">
                    QR Kod & Katılım Bilgileri
                </h2>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                    <span className="material-icons-round text-base mr-1.5">wifi</span>
                    {isConnected ? "Bağlantı Aktif" : "Bağlanıyor..."}
                </div>
            </div>

            {/* Main Card */}
            <div className="bg-[#1f0a0a] rounded-3xl shadow-2xl border border-[#451a1a] p-6 md:p-10 flex flex-col md:flex-row gap-8 md:gap-12 items-center">
                {/* QR Code Area */}
                <div className="flex-shrink-0 flex flex-col items-center justify-center">
                    <div className="bg-white p-4 rounded-2xl shadow-lg shadow-white/5 relative group">
                        <div className="w-48 h-48 md:w-56 md:h-56 bg-white flex items-center justify-center overflow-hidden">
                            <QRCode value={url} size={200} />
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
                                value={url}
                            />
                            <button
                                onClick={handleCopy}
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
                        onClick={startSession}
                        disabled={!isConnected}
                        className="w-full group relative flex items-center justify-center gap-3 bg-gradient-to-r from-[#dc2626] to-[#b91c1c] hover:from-red-500 hover:to-red-600 text-white font-bold text-lg py-4 px-6 rounded-xl shadow-lg shadow-red-900/40 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-red-900/60 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        <span className="material-icons-round text-[#dc2626] text-sm">groups</span> 12 Kişi
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
                        <span className="material-icons-round text-[#dc2626] text-sm">quiz</span> 5 Soru
                    </p>
                </div>
            </div>
        </>
    );
};

export default QRDisplay;