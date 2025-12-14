import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <div>
            <header className="h-[20vh] flex items-center justify-center">
                <h1 className="text-7xl text-white text-center">HSD ARENA</h1>
            </header>
            <main className="container h-[80vh] mx-auto p-6">{children}</main>
        </div>
    );
}