
import NewQuizForm from "@/components/admin/NewQuizForm";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function QuizCreatePage() {


    return (
        <div className="h-full w-full flex justify-around">
            <NewQuizForm />
            <div className="fixed bottom-0 left-0 m-6">
                <Link href="/admin">
                    <Button type="button" variant="danger">Geri</Button>
                </Link>
            </div>
        </div>
    );
}
