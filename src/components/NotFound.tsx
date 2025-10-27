import React from 'react';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center">
                {/* 404 Animation */}
                <div className="relative mb-8">
                    <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-pulse">
                        404
                    </h1>
                    <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-purple-400 to-pink-600"></div>
                </div>

                {/* Message */}
                <div className="space-y-4 mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">
                        Sayfa Bulunamadı
                    </h2>
                    <p className="text-lg text-gray-300 max-w-md mx-auto">
                        Aradığınız sayfa taşınmış, silinmiş veya hiç var olmamış olabilir.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        // onClick={() => window.history.back()}
                        className="group flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm border border-white/20 transition-all duration-300 hover:scale-105"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Geri Dön
                    </button>

                    <button
                        // onClick={() => window.location.href = '/'}
                        className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/50"
                    >
                        <Home className="w-5 h-5" />
                        Ana Sayfaya Git
                    </button>
                </div>

                {/* Decorative Elements */}
                <div className="mt-16 flex justify-center gap-8 text-gray-500">
                    <div className="animate-bounce" style={{ animationDelay: '0s' }}>
                        <Search className="w-6 h-6" />
                    </div>
                    <div className="animate-bounce" style={{ animationDelay: '0.2s' }}>
                        <Search className="w-6 h-6" />
                    </div>
                    <div className="animate-bounce" style={{ animationDelay: '0.4s' }}>
                        <Search className="w-6 h-6" />
                    </div>
                </div>

                {/* Help Text */}
                <p className="mt-8 text-sm text-gray-400">
                    Yardıma mı ihtiyacınız var?{' '}
                    <a href="/contact" className="text-purple-400 hover:text-purple-300 underline">
                        İletişime geçin
                    </a>
                </p>
            </div>
        </div>
    );
}