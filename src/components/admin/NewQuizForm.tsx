"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/hooks/useQuiz";
import Input from "../ui/Input";
import RadioButton from "../ui/RadioButton";
import Link from "next/link";
import OverlaySpinner from "../ui/OverlaySpinner";
import Button from "../ui/Button";

const YeniQuizForm = () => {
    const [options, setOptions] = useState(["", "", "", ""]);
    const [correctIndex, setCorrectIndex] = useState(null as number | null);
    const [questionText, setQuestionText] = useState("");
    const [title, setTitle] = useState("");
    const { create, loading } = useQuiz();
    const router = useRouter();
    type Question = {
        question: string;
        options: string[];
        correctAnswer: number | null;
    };
    const [questions, setQuestions] = useState<Question[]>([]);
    var mYJson: Question[] = [
        {
            question: "baskent",
            options: ["Ankara", "Istanbul", "Izmir", "Bursa"],
            correctAnswer: 0
        },
        {
            question: "Başka bir soru",
            options: ["Cevap 1", "Cevap 2", "Cevap 3", "Cevap 4"],
            correctAnswer: 1
        }
    ]

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
                const res = await create({
                    title,
                    questions: [], // MVP için boş, sorular sonraki adımda eklenebilir
                });
                router.replace(`/admin/quiz/session/${res.quizId}`);
            } catch (err: any) {
                alert(err.message);
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
            const payload = {
                question: questionText,
                options,
                correctAnswer: correctIndex,
            };
            console.log("Saving question:", payload);
            setQuestions([...questions, payload]);
            console.log("All questions so far:", [...questions, payload]);
            // Reset form for next question
            setQuestionText("");
            setOptions(["", "", "", ""]);
            setCorrectIndex(null);
            // You can send this payload to your backend or store it locally
            alert("Soru kaydedildi!");
        }
    };

    const handleDeleteQuestion = (questionToDelete: string) => {
        const updatedQuestions = questions.filter(q => q.question !== questionToDelete);
        setQuestions(updatedQuestions);
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col min-w-100 w-full max-w-lg gap-2 p-6">
                {loading && <OverlaySpinner />}
                <h2 className="text-2xl text-white font-bold">Quiz Oluştur</h2>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Quiz Başlığı" />
                <h1 className="text-white text-2xl font-semibold ">
                    Yeni Soru Giriniz
                </h1>

                <Input
                    placeholder="Soru Metni"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                />

                {options.map((opt, i) => (
                    <RadioButton
                        key={i}
                        name="correctAnswer"
                        placeholder={`${i + 1}. şık`}
                        value={opt}
                        onChange={(e) => handleOptionChange(i, e.target.value)}
                        checked={correctIndex === i}
                        onSelect={() => setCorrectIndex(i)}
                    />
                ))}
                <div className="flex justify-between">
                    <Button
                        type="button"
                        onClick={handleSubmitQuestion}
                        variant="danger"
                    >
                        Soruyu Kaydet
                    </Button>
                    <Button
                        type="submit"
                        variant="danger"                    >
                        Quiz'i kaydet
                    </Button>
                </div>
            </form>
            <div className="p-6 w-75 space-y-4">
                {questions.map((quiz) => (
                    <div
                        key={quiz.question}
                        className="flex justify-between items-center bg-white rounded-lg p-4 shadow"
                    >
                        <div>
                            <h2 className="text-lg font-semibold">{quiz.question}</h2>
                            <p className="text-sm text-gray-500">{quiz.options.join(", ")} </p>
                            {quiz.correctAnswer !== null && (
                                <p className="text-sm text-[#BB0000]">Doğru Cevap: {quiz.options[quiz.correctAnswer]}</p>
                            )}
                        </div>
                        <Button
                            type="button"
                            onClick={() => handleDeleteQuestion(quiz.question)}
                            variant="danger"
                        >
                            Sil
                        </Button>
                    </div>

                ))}
            </div>
        </>
    );
};

export default YeniQuizForm;
