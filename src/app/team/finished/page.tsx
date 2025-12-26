"use client";

export default function TeamFinishedPage() {
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
                {/* Congratulations Card */}
                <div className="w-full max-w-2xl">
                    <div className="group relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-green-500 rounded-2xl blur opacity-40 group-hover:opacity-70 transition duration-500"></div>
                        <div className="relative p-12 md:p-16 rounded-2xl flex flex-col items-center text-center shadow-2xl" style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}>
                            {/* Success Icon */}
                            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-emerald-900/50 animate-bounce">
                                <span className="material-icons-round text-6xl text-white">celebration</span>
                            </div>

                            {/* Title */}
                            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4" style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                background: 'linear-gradient(to right, #10b981, #34d399, #6ee7b7)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text'
                            }}>
                                🎉 Tebrikler!
                            </h1>

                            {/* Message */}
                            <p className="text-2xl md:text-3xl text-white font-semibold mb-4">
                                Quiz tamamlandı!
                            </p>

                            <p className="text-lg md:text-xl text-gray-300 opacity-90 max-w-md">
                                Final skorları için admin panelini kontrol edin.
                            </p>

                            {/* Decorative Line */}
                            <div className="mt-8 w-32 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="mt-16 text-center">
                    <p className="text-sm text-red-200/40">Katıldığınız için teşekkürler!</p>
                    <p className="mt-4 text-xs text-red-200/20 font-mono">v2.4.0 • HSD Secure System</p>
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
                @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
            `}</style>
        </div>
    );
}
