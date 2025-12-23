"use client";

import QRDisplay from "@/components/admin/QRDisplay";
import AppShell from "@/components/shared/AppShell";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { useEffect, useState } from "react";

interface PageProps {
    params: Promise<{ sessionCode: string }>;
}

export default function QuizJoinPage({ params }: PageProps) {
    const [sessionCode, setSessionCode] = useState("");
    // Params çöz
    useEffect(() => {
        params.then((p) => setSessionCode(p.sessionCode));
    }, [params]);

    return (
        <AppShell>
            <div className="p-6 pt-0 h-full">
                <QRDisplay sessionCode={sessionCode} />
                <div className="fixed bottom-0 left-0 m-6">
                    <Link href="/admin">
                        <Button type="button" variant="danger">Geri</Button>
                    </Link>
                </div>
            </div>
        </AppShell>
    );
}
