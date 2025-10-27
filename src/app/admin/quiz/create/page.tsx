"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/hooks/useQuiz";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import OverlaySpinner from "@/components/ui/OverlaySpinner";

export default function QuizCreatePage() {
    const { create, loading } = useQuiz();
    const router = useRouter();
    const [title, setTitle] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await create({
                title,
                questions: [], // MVP için boş, sorular sonraki adımda eklenebilir
            });
            router.push(`/admin/quiz/session/${res.quizId}`);
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto">
            {loading && <OverlaySpinner />}
            <h2 className="text-2xl font-bold mb-4">Quiz Oluştur</h2>
            <form onSubmit={handleSubmit}>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Quiz Başlığı" />
                <Button type="submit" className="mt-4">Oluştur</Button>
            </form>
        </div>
    );
}
