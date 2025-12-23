"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useTeam } from "@/domains/team/useTeam";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Label from "@/components/ui/Label";
import Link from "next/link";
import AppShell from "@/components/shared/AppShell";

export default function TeamJoinPage() {
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
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.message || "Giriş başarısız");
        }
    };

    return (
        <AppShell>
            <div className="h-full w-full flex flex-col items-center justify-start">
                <h2 className="text-white text-2xl font-semibold text-center mt-12">Takım Katılımı</h2>
                <form onSubmit={handleJoin} className="p-6 w-100">
                    <Label htmlFor="teamName">Takım Adı</Label>
                    <Input id="teamName" placeholder="Takım Adı" value={teamName} onChange={e => setTeamName(e.target.value)} className="w-full" />
                    <Label htmlFor="sessionCode">Session Kod</Label>
                    <Input id="sessionCode" placeholder="Session Kod" value={sessionCode} onChange={e => setSessionCode(e.target.value)} className="w-full" />
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    <div className="w-full flex justify-center">
                        <Button type="submit" variant="danger" className="mt-4">Katıl</Button>
                    </div>
                </form>
                <div className="fixed bottom-0 left-0 m-6">
                    <Link href="/">
                        <Button type="button" variant="danger" className="mt-4">Ana Sayfa</Button>
                    </Link>
                </div>
            </div>
        </AppShell>
    );
}
