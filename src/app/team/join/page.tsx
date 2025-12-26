"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useTeam } from "@/domains/team/useTeam";

function TeamJoinForm() {
    const { join } = useTeam();
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialSessionCode = searchParams.get("sessionCode") || "";
    const [sessionCode, setSessionCode] = useState(initialSessionCode);
    const [teamName, setTeamName] = useState("");
    const [error, setError] = useState("");

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await join({ teamName, sessionCode });
            if (result.teamToken && result.teamToken === localStorage.getItem("teamToken")) {
                router.replace(`/team/quiz/${result.sessionCode}`);
            }
        } catch (err: unknown) {
            console.error('Login error:', err);
            setError(err instanceof Error ? err.message : "Giriş başarısız");
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
            <div className="flex-grow flex flex-col items-center justify-center p-6 relative z-10">
                {/* Title */}
                <div className="text-center mb-10">
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-2" style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        background: 'linear-gradient(to right, #ffffff, #fecaca, #fecdd3)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.25))'
                    }}>
                        HSD ARENA
                    </h1>
                    <p className="text-red-200/80 text-lg md:text-xl font-light tracking-wide max-w-md mx-auto">
                        Takımını topla, oturuma katıl.
                    </p>
                </div>

                {/* Form Card */}
                <div className="w-full max-w-md">
                    <div className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-800 to-red-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
                        <div className="relative p-8 md:p-10 rounded-2xl flex flex-col h-full shadow-2xl" style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            {/* Form Header */}
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-red-600 to-red-800 mb-4 shadow-lg shadow-red-900/40">
                                    <span className="material-icons-round text-2xl text-white">groups</span>
                                </div>
                                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                    Takım Katılımı
                                </h2>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleJoin} className="space-y-6">
                                {/* Team Name Input */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-red-100/90 ml-1" htmlFor="team-name">
                                        Takım Adı
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 material-icons-round text-lg">badge</span>
                                        <input
                                            className="w-full pl-11 pr-4 py-3.5 rounded-xl text-base font-medium transition-all duration-300"
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.08)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                color: 'white'
                                            }}
                                            id="team-name"
                                            placeholder="Efsane Takım"
                                            type="text"
                                            value={teamName}
                                            onChange={e => setTeamName(e.target.value)}
                                            onFocus={(e) => {
                                                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                                                e.target.style.borderColor = '#D90429';
                                                e.target.style.boxShadow = '0 0 0 2px rgba(217, 4, 41, 0.2)';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Session Code Input */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-red-100/90 ml-1" htmlFor="session-code">
                                        Session Kod
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 material-icons-round text-lg">vpn_key</span>
                                        <input
                                            className="w-full pl-11 pr-4 py-3.5 rounded-xl text-base font-medium font-mono tracking-wider transition-all duration-300"
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.08)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                color: 'white'
                                            }}
                                            id="session-code"
                                            placeholder="123456"
                                            type="text"
                                            value={sessionCode}
                                            onChange={e => setSessionCode(e.target.value)}
                                            onFocus={(e) => {
                                                e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                                                e.target.style.borderColor = '#D90429';
                                                e.target.style.boxShadow = '0 0 0 2px rgba(217, 4, 41, 0.2)';
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                                                e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                                e.target.style.boxShadow = 'none';
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full mt-4 py-4 bg-gradient-to-r from-[#D90429] to-red-600 text-white font-bold rounded-xl hover:from-red-500 hover:to-red-500 transition-all duration-300 shadow-lg shadow-red-900/40 flex items-center justify-center gap-2 hover:gap-3 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <span>Katıl</span>
                                    <span className="material-icons-round text-lg transition-all">login</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-16 text-center">
                    <div className="flex items-center justify-center gap-6 text-red-200/40 text-sm">
                        <a className="hover:text-white transition-colors cursor-pointer">Nasıl Çalışır?</a>
                        <span>•</span>
                        <a className="hover:text-white transition-colors cursor-pointer">Yardım</a>
                    </div>
                    <p className="mt-6 text-xs text-red-200/20 font-mono">v2.4.0 • HSD Secure System</p>
                </footer>
            </div>

            {/* Settings Button - Top Right */}
            <div className="fixed top-6 right-6 z-50">
                <button className="p-3 rounded-full text-white/80 hover:text-white transition-all shadow-lg" style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                    <span className="material-icons-round">settings</span>
                </button>
            </div>

            {/* Profile - Top Left */}
            <div className="fixed top-6 left-6 z-50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-400 to-orange-500 p-[2px]">
                    <div className="w-full h-full rounded-full border-2 border-black/50 bg-gray-800 flex items-center justify-center text-white font-bold text-sm">
                        K
                    </div>
                </div>
                <div className="hidden md:block">
                    <p className="text-sm font-bold text-white">Kullanıcı</p>
                    <p className="text-xs text-red-200/60">Misafir</p>
                </div>
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

export default function TeamJoinPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-white">Yükleniyor...</div>}>
            <TeamJoinForm />
        </Suspense>
    );
}
