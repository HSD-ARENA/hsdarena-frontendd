import NotFound from "@/components/NotFound";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-start pt-40">
      <Link href="/admin">
        <Button variant="secondary" className="mt-4 w-40">
          Quiz oluştur
        </Button>
      </Link>
      <Link href="/team/join">
        <Button variant="danger" className="mt-4 w-40">
          Quize katıl
        </Button>
      </Link>
    </div>
  );
}
