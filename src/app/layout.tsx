import "@/styles/globals.css";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-gradient-to-tr from-[#525252] to-[#FF0000] text-gray-900 overflow-hidden">
        <header className="h-[20vh] flex items-center justify-center">
          <h1 className="text-7xl text-white text-center">HSD ARENA</h1>
        </header>
        <main className="container h-[80vh] mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
