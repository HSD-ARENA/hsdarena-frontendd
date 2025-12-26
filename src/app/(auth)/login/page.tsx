"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/domains/auth/useAuth";

import OverlaySpinner from "@/components/ui/OverlaySpinner";

export default function LoginPage() {
    const router = useRouter();
    const { login, loading } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            await login({ email, password });
            router.replace("/admin");
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Giriş başarısız");
            }
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
            {loading && <OverlaySpinner />}

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
                        Yönetim Paneli Girişi
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
                                    <span className="material-icons-round text-2xl text-white">admin_panel_settings</span>
                                </div>
                                <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                    Admin Girişi
                                </h2>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email Input */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-red-100/90 ml-1" htmlFor="admin-email">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 material-icons-round text-lg">mail</span>
                                        <input
                                            className="w-full pl-11 pr-4 py-3.5 rounded-xl text-base font-medium transition-all duration-300"
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.08)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                color: 'white'
                                            }}
                                            id="admin-email"
                                            placeholder="admin@example.com"
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
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

                                {/* Password Input */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-red-100/90 ml-1" htmlFor="admin-password">
                                        Şifre
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 material-icons-round text-lg">lock</span>
                                        <input
                                            className="w-full pl-11 pr-4 py-3.5 rounded-xl text-base font-medium font-mono tracking-wider transition-all duration-300"
                                            style={{
                                                background: 'rgba(255, 255, 255, 0.08)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                color: 'white'
                                            }}
                                            id="admin-password"
                                            placeholder="••••••••"
                                            type="password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
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
                                    disabled={loading}
                                    className="w-full mt-4 py-4 bg-gradient-to-r from-[#D90429] to-red-600 text-white font-bold rounded-xl hover:from-red-500 hover:to-red-500 transition-all duration-300 shadow-lg shadow-red-900/40 flex items-center justify-center gap-2 hover:gap-3 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span>Giriş Yap</span>
                                    <span className="material-icons-round text-lg transition-all">arrow_forward</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-16 text-center">
                    <div className="flex items-center justify-center gap-6 text-red-200/40 text-sm">
                        <a className="hover:text-white transition-colors cursor-pointer">Sistem Durumu</a>
                        <span>•</span>
                        <a className="hover:text-white transition-colors cursor-pointer">Destek</a>
                    </div>
                    <p className="mt-6 text-xs text-red-200/20 font-mono">v2.4.0 • HSD Admin System</p>
                </footer>
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
