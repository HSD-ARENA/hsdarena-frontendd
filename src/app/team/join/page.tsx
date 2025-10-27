"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useTeam } from "@/hooks/useTeam";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function TeamJoinPage() {
    const { join } = useTeam();
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialSessionCode = searchParams.get("sessionCode") || "";
    const [sessionCode, setSessionCode] = useState(initialSessionCode);
    const [teamName, setTeamName] = useState("");

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await join({ teamName, sessionCode });
            router.push(`/team/quiz/${res.teamId}`);
        } catch (err: any) {
            alert(err.message);
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Takım Katılımı</h2>
            <form onSubmit={handleJoin}>
                <Input placeholder="Takım Adı" value={teamName} onChange={e => setTeamName(e.target.value)} />
                <Input placeholder="Session Kod" value={sessionCode} onChange={e => setSessionCode(e.target.value)} className="mt-2" />
                <Button type="submit" className="mt-4 w-full">Katıl</Button>
            </form>
        </div>
    );
}
