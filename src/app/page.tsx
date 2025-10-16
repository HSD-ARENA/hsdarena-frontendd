import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">Hoş geldin 👋</h1>
      <p className="text-gray-600 mb-6">
        Bu Next.js frontend yalnızca backend API'sine bağlanır.
      </p>
      <Link
        href="/login"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Giriş Yap
      </Link>
    </div>
  );
}
