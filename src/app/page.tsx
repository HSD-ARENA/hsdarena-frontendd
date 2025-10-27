import NotFound from "@/components/NotFound";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">HSDarena</h1>
      <Link href="/admin">
        <Button variant="primary">
          Quiz oluştur
        </Button>
      </Link>
      <Link href="/team/join">
        <Button variant="secondary" className="mt-4">
          Quize katıl
        </Button>
      </Link>
    </div>
  );
}
