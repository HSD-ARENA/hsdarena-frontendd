import "@/styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="min-h-screen bg-gradient-to-tr from-[#525252] to-[#FF0000] text-gray-900 overflow-hidden">
        {children}
      </body>
    </html>
  );
}
