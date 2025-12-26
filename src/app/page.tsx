"use client";

import Link from "next/link";

export default function HomePage() {
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
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-4" style={{
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
            Bilgini test et, rekabete katıl.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
          {/* Quiz Oluştur Card */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative p-8 rounded-2xl flex flex-col items-center text-center h-full transition-all duration-300 transform group-hover:-translate-y-1" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-red-900/50 group-hover:scale-110 transition-transform duration-300">
                <span className="material-icons-round text-3xl text-white">add_circle</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Quiz Oluştur
              </h2>
              <p className="text-gray-300 mb-8 text-sm leading-relaxed">
                Yeni bir meydan okuma tasarla ve katılımcılarını beklemeye başla.
              </p>
              <Link href="/admin" className="mt-auto">
                <button className="px-8 py-3 bg-white text-[#8D0801] font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg flex items-center gap-2 group-hover:gap-3">
                  <span>Oluştur</span>
                  <span className="material-icons-round text-sm transition-all">arrow_forward</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Quize Katıl Card */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-800 to-red-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative p-8 rounded-2xl flex flex-col items-center text-center h-full transition-all duration-300 transform group-hover:-translate-y-1" style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-black/50 group-hover:scale-110 transition-transform duration-300">
                <span className="material-icons-round text-3xl text-white">login</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Quize Katıl
              </h2>
              <p className="text-gray-300 mb-8 text-sm leading-relaxed">
                Mevcut bir odaya katıl ve rakiplerinle yarışmaya başla.
              </p>
              <Link href="/team/join" className="mt-auto">
                <button className="px-8 py-3 bg-[#D90429] text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-900/30 flex items-center gap-2 group-hover:gap-3">
                  <span>Katıl</span>
                  <span className="material-icons-round text-sm transition-all">play_arrow</span>
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center">
          <div className="flex items-center justify-center gap-6 text-red-200/40 text-sm">
            <a className="hover:text-white transition-colors cursor-pointer">Nasıl Çalışır?</a>
            <span>•</span>
            <a className="hover:text-white transition-colors cursor-pointer">Lider Tablosu</a>
            <span>•</span>
            <a className="hover:text-white transition-colors cursor-pointer">Destek</a>
          </div>
          <p className="mt-8 text-xs text-red-200/20 font-mono">v2.4.0 • HSD Secure System</p>
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
          <div className="w-full h-full rounded-full border-2 border-black/50 bg-gray-800 flex items-center justify-center text-white font-bold">
            A
          </div>
        </div>
        <div className="hidden md:block">
          <p className="text-sm font-bold text-white">Admin</p>
          <p className="text-xs text-red-200/60">Çevrimiçi</p>
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
