"use client";

import { FC } from "react";

interface QRDisplayProps {
    sessionCode: string;
}

const QRDisplay: FC<QRDisplayProps> = ({ sessionCode }) => {
    const url = `${window.location.origin}/team/join?session=${sessionCode}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        alert("URL kopyalandı!");
    };

    return (
        <div className="bg-gray-50 p-4 rounded shadow space-y-2">
            <h3 className="font-semibold">QR Kod & Katılım URL</h3>
            <div className="flex items-center gap-4">
                {/* Placeholder QR – daha sonra react-qr-code veya benzeri paket ile gerçek QR */}
                <div className="bg-white border p-4 w-24 h-24 flex items-center justify-center">
                    QR
                </div>
                <div className="flex-1 flex flex-col gap-2">
                    <input
                        type="text"
                        readOnly
                        value={url}
                        className="border p-2 rounded w-full"
                    />
                    <button
                        onClick={handleCopy}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Kopyala
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QRDisplay;
