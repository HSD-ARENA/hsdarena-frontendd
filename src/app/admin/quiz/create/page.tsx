
import NewQuizForm from "@/components/admin/NewQuizForm";
import Link from "next/link";

export default function QuizCreatePage() {
    return (
        <div className="bg-[#0f0404] text-[#ffe4e6] h-screen flex flex-col overflow-hidden selection:bg-[#dc2626] selection:text-white">
            {/* Navigation Bar */}
            <nav className="bg-[#1f0a0a] border-b border-[#451a1a] h-16 flex-shrink-0 z-20 shadow-lg shadow-red-900/5">
                <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin">
                            <button className="p-2 rounded-full hover:bg-[#2d0f0f] text-[#fda4af] hover:text-white transition-colors">
                                <span className="material-icons-round">arrow_back</span>
                            </button>
                        </Link>
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
            <main className="flex-1 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#dc2626]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                <div className="h-full max-w-[1600px] mx-auto relative z-10">
                    <NewQuizForm />
                </div>
            </main>
        </div>
    );
}
