"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/domains/quiz/useQuiz";
import OverlaySpinner from "../ui/OverlaySpinner";
import { QuizCreateQuestion } from "@/domains/questions/question.types";
import { Choice, Type } from "@/types/common";

const YeniQuizForm = () => {
    const [options, setOptions] = useState(["", "", "", ""]);
    const [correctIndex, setCorrectIndex] = useState(null as number | null);
    const [questionText, setQuestionText] = useState("");
    const [timeLimitSec, setTimeLimitSec] = useState(30);
    const [title, setTitle] = useState("");
    const { createQuiz, loading } = useQuiz();
    const router = useRouter();

    const [questions, setQuestions] = useState<QuizCreateQuestion[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        if (title.trim() === "") {
            alert("Lütfen quiz başlığını giriniz.");
            return;
        } else if (questions.length === 0) {
            alert("Lütfen en az bir soru ekleyiniz.");
            return;
        } else {
            e.preventDefault();
            try {
                await createQuiz({
                    title,
                    settings: {
                        shuffleQuestions: true,
                        showCorrectAnswers: false,
                        allowRetake: true
                    },
                    questions,
                });
                router.replace(`/admin`);
            } catch (err: unknown) {
                alert(err instanceof Error ? err.message : 'Bir hata oluştu');
            }
        }
    };

    const handleOptionChange = (index: number, newValue: string) => {
        const updated = [...options];
        updated[index] = newValue;
        setOptions(updated);
    };

    const handleSubmitQuestion = (e: React.FormEvent) => {
        if (questionText.trim() === "") {
            alert("Lütfen soru metnini giriniz.");
            return;
        } else if (options.some(opt => opt.trim() === "")) {
            alert("Lütfen tüm şıkları doldurunuz.");
            return;
        } else if (correctIndex === null) {
            alert("Lütfen doğru cevabı seçiniz.");
            return;
        } else {
            e.preventDefault();
            const labels = ['A', 'B', 'C', 'D'];
            const payload = {
                index: questions.length,
                text: questionText,
                type: "MCQ" as Type,
                choices: options.map((opt, i) => ({
                    id: labels[i] as Choice,
                    text: opt,
                })),
                correctAnswer: labels[correctIndex] as Choice,
                timeLimitSec: timeLimitSec,
                points: 10
            };
            console.log("Saving question:", payload);
            setQuestions([...questions, payload]);
            console.log("All questions so far:", [...questions, payload]);
            // Reset form for next question
            setQuestionText("");
            setOptions(["", "", "", ""]);
            setCorrectIndex(null);
            setTimeLimitSec(30);
            alert("Soru kaydedildi!");
        }
    };

    const handleDeleteQuestion = (questionToDelete: number) => {
        const updatedQuestions = questions.filter(q => q.index !== questionToDelete);
        const reindexedQuestions = updatedQuestions.map((q, i) => ({ ...q, index: i }));
        setQuestions(reindexedQuestions);
    }

    const optionLabels = ['A', 'B', 'C', 'D'];

    return (
        <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 lg:p-6 relative">
            {loading && <OverlaySpinner />}
            
            {/* Left Column - Form */}
            <div className="lg:col-span-5 flex flex-col h-full overflow-y-auto pr-1 pb-4 gap-6 custom-scrollbar">
                {/* Quiz Title Card */}
                <div className="bg-[#1f0a0a] rounded-2xl shadow-xl border border-[#451a1a] p-6">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <div className="p-1.5 bg-[#dc2626]/10 rounded-lg mr-3">
                            <span className="material-icons-round text-[#dc2626] text-xl">edit_note</span>
                        </div>
                        Quiz Başlığı
                    </h2>
                    <div>
                        <input 
                            className="w-full rounded-xl border-[#451a1a] bg-[#2d0f0f] text-white placeholder-[#fda4af]/50 focus:ring-2 focus:ring-[#dc2626] focus:border-transparent shadow-inner transition-all py-3 px-4" 
                            placeholder="Örn: Javascript Temelleri" 
                            type="text" 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                </div>

                {/* New Question Card */}
                <div className="bg-[#1f0a0a] rounded-2xl shadow-xl border border-[#451a1a] p-6 flex-1 flex flex-col">
                    <h2 className="text-lg font-semibold text-white mb-6 flex items-center">
                        <div className="p-1.5 bg-[#dc2626]/10 rounded-lg mr-3">
                            <span className="material-icons-round text-[#dc2626] text-xl">add_circle_outline</span>
                        </div>
                        Yeni Soru Ekle
                    </h2>
                    <div className="space-y-6 flex-1">
                        {/* Question Text */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#fda4af] mb-2 ml-1">Soru Metni</label>
                            <textarea 
                                className="w-full rounded-xl border-[#451a1a] bg-[#2d0f0f] text-white placeholder-[#fda4af]/50 focus:ring-2 focus:ring-[#dc2626] focus:border-transparent shadow-inner resize-none py-3 px-4" 
                                placeholder="Sorunuzu buraya yazın..." 
                                rows={3}
                                value={questionText}
                                onChange={(e) => setQuestionText(e.target.value)}
                            />
                        </div>

                        {/* Options */}
                        <div className="space-y-3">
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#fda4af] mb-2 ml-1">Şıklar ve Doğru Cevap</label>
                            {options.map((opt, i) => (
                                <div key={i} className="flex items-center gap-3 group">
                                    <input 
                                        className="w-5 h-5 text-[#dc2626] bg-[#2d0f0f] border-[#451a1a] focus:ring-[#dc2626] focus:ring-offset-[#1f0a0a] cursor-pointer" 
                                        name="correctAnswer" 
                                        type="radio"
                                        checked={correctIndex === i}
                                        onChange={() => setCorrectIndex(i)}
                                    />
                                    <div className="flex-1 relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md bg-[#1f0a0a] border border-[#451a1a] flex items-center justify-center text-[#fda4af] text-xs font-bold">
                                            {optionLabels[i]}
                                        </div>
                                        <input 
                                            className="w-full pl-11 rounded-lg border-[#451a1a] bg-[#2d0f0f] text-white placeholder-[#fda4af]/50 focus:ring-2 focus:ring-[#dc2626] focus:border-transparent text-sm shadow-inner py-2.5" 
                                            placeholder="Cevap metni..." 
                                            type="text"
                                            value={opt}
                                            onChange={(e) => handleOptionChange(i, e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Time Limit */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-[#fda4af] mb-2 ml-1">Süre Limiti</label>
                            <div className="relative">
                                <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-[#dc2626] text-lg">timer</span>
                                <select 
                                    className="w-full pl-10 rounded-lg border-[#451a1a] bg-[#2d0f0f] text-white focus:ring-2 focus:ring-[#dc2626] focus:border-transparent shadow-inner py-2.5 cursor-pointer"
                                    value={timeLimitSec}
                                    onChange={(e) => setTimeLimitSec(Number(e.target.value))}
                                >
                                    <option value={5}>5 saniye</option>
                                    <option value={10}>10 saniye</option>
                                    <option value={30}>30 saniye</option>
                                    <option value={60}>60 saniye</option>
                                    <option value={120}>120 saniye</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 pt-6 border-t border-[#451a1a] grid grid-cols-2 gap-4">
                        <button 
                            type="button"
                            onClick={handleSubmitQuestion}
                            className="flex items-center justify-center gap-2 bg-transparent border border-[#451a1a] text-white hover:bg-[#2d0f0f] hover:border-[#dc2626] font-medium py-3 px-4 rounded-xl transition-all duration-200"
                        >
                            <span className="material-icons-round text-[#dc2626]">save</span>
                            Soruyu Kaydet
                        </button>
                        <button 
                            type="button"
                            onClick={handleSubmit}
                            className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#dc2626] to-[#b91c1c] hover:from-red-500 hover:to-red-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-red-900/40 transition-all duration-200 transform hover:-translate-y-0.5"
                        >
                            <span className="material-icons-round">done_all</span>
                            Quiz&apos;i Kaydet
                        </button>
                    </div>
                </div>
            </div>

            {/* Right Column - Questions List */}
            <div className="lg:col-span-7 flex flex-col h-full overflow-hidden bg-[#1f0a0a] rounded-2xl shadow-xl border border-[#451a1a]">
                <div className="p-6 border-b border-[#451a1a] flex justify-between items-center bg-[#2d0f0f]/30 backdrop-blur-sm">
                    <h2 className="text-lg font-semibold text-white flex items-center">
                        <div className="p-1.5 bg-[#dc2626]/10 rounded-lg mr-3">
                            <span className="material-icons-round text-[#dc2626] text-xl">list</span>
                        </div>
                        Eklenen Sorular
                    </h2>
                    <span className="bg-[#dc2626]/20 text-[#fee2e2] px-4 py-1.5 rounded-full text-xs font-bold border border-[#dc2626]/30 shadow-sm shadow-red-900/20">
                        {questions.length} Soru
                    </span>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                    {questions.length === 0 ? (
                        <p className="text-[#fda4af] text-center py-8">Henüz soru eklenmedi</p>
                    ) : (
                        questions.map((quiz, idx) => (
                            <div 
                                key={quiz.index}
                                className="group bg-[#2d0f0f]/40 rounded-xl border border-[#451a1a] p-5 hover:border-[#dc2626]/50 hover:bg-[#2d0f0f]/80 transition-all duration-200 hover:shadow-lg hover:shadow-red-900/10"
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="bg-[#451a1a] text-[#fda4af] text-xs font-bold px-2 py-1 rounded border border-white/5">
                                                Soru {idx + 1}
                                            </span>
                                            <span className="text-xs text-[#fda4af]/70 flex items-center gap-1">
                                                <span className="material-icons-round text-[14px]">timer</span> {quiz.timeLimitSec}s
                                            </span>
                                            <span className="text-xs text-[#fda4af]/70 flex items-center gap-1">
                                                <span className="material-icons-round text-[14px]">star</span> {quiz.points} Puan
                                            </span>
                                        </div>
                                        <h3 className="text-base font-medium text-white mb-2 leading-snug">{quiz.text}</h3>
                                        <div className="space-y-2">
                                            <p className="text-sm text-[#fda4af] font-mono text-xs opacity-70">
                                                {quiz.choices.map((c, i) => `${c.id}: ${c.text}`).join(", ")}
                                            </p>
                                            <p className="text-sm font-medium text-emerald-400 flex items-center gap-1.5">
                                                <span className="material-icons-round text-base">check_circle</span>
                                                Doğru Cevap: {quiz.correctAnswer}
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteQuestion(quiz.index)}
                                        className="opacity-100 lg:opacity-0 group-hover:opacity-100 p-2 text-[#fda4af] hover:text-white hover:bg-[#dc2626] rounded-lg transition-all" 
                                        title="Sil"
                                    >
                                        <span className="material-icons-round">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #451a1a;
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: #7f1d1d;
                }
            `}</style>
        </div>
    );
};

export default YeniQuizForm;