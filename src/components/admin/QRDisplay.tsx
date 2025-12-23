"use client";

import { FC, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { socketManager } from "@/realtime/socket";
import { useRouter } from "next/navigation";

interface QRDisplayProps {
    sessionCode: string;
}

const QRDisplay: FC<QRDisplayProps> = ({ sessionCode }) => {
    const [url, setUrl] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Set join URL
        if (typeof window !== "undefined") {
            setUrl(`${window.location.origin}/team/join?sessionCode=${sessionCode}`);
        }

        // Connect WebSocket
        const token = localStorage.getItem("token") || "";
        socketManager.connect(token);

        // Join session
        socketManager.joinSession(sessionCode);

        setIsConnected(true);
        console.log("✅ WebSocket ready");

        // Cleanup on unmount
        return () => {
            // Don't disconnect - other pages might use it
        };
    }, [sessionCode]);

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        alert("URL kopyalandı!");
    };

    const startSession = () => {
        // Start first question
        socketManager.emit("admin:next-question", { sessionCode });

        console.log("✅ Quiz started");
        router.push(`/admin/quiz/session/${sessionCode}`);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                QR Kod & Katılım URL
            </h2>

            {/* Connection status */}
            <div className="mb-4">
                {isConnected ? (
                    <span className="text-green-600 text-sm">● Bağlı</span>
                ) : (
                    <span className="text-red-600 text-sm">● Bağlanıyor...</span>
                )}
            </div>

            {/* QR Code */}
            <div className="flex justify-center mb-6">
                <QRCode value={url} size={200} />
            </div>

            {/* URL Input */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Katılım Linki
                </label>
                <div className="flex gap-2">
                    <Input
                        type="text"
                        value={url}
                        readOnly
                        className="flex-1"
                    />
                    <Button onClick={handleCopy} variant="secondary">
                        Kopyala
                    </Button>
                </div>
            </div>

            {/* Session Code */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Oturum Kodu
                </label>
                <Input
                    type="text"
                    value={sessionCode}
                    readOnly
                    className="text-center text-2xl font-bold"
                />
            </div>

            {/* Start Button */}
            <Button
                onClick={startSession}
                variant="primary"
                className="w-full"
                disabled={!isConnected}
            >
                Quizi Başlat
            </Button>
        </div>
    );
};

export default QRDisplay;