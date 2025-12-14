import QRDisplay from "@/components/admin/QRDisplay";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function QuizJoinPage({ params }: { params: { sessionCode: string } }) {
    const { sessionCode } = params;

    return (
        <div className="p-6 pt-0 h-full">
            <QRDisplay sessionCode={sessionCode} />
            <div className="fixed bottom-0 left-0 m-6">
                <Link href="/admin">
                    <Button type="button" variant="danger">Geri</Button>
                </Link>
            </div>
        </div>
    );
}
