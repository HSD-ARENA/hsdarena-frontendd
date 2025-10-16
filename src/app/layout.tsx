import "./globals.css";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <main className="container mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
