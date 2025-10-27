"use client";

import { FC, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import Input from "../ui/Input";
import Button from "../ui/Button";

interface QRDisplayProps {
    sessionCode: string;
}

const QRDisplay: FC<QRDisplayProps> = ({ sessionCode }) => {
    const [url, setUrl] = useState("");

    useEffect(() => {
        if (typeof window !== "undefined") {
            setUrl(`${window.location.origin}/team/join?sessionCode=${sessionCode}`);
        }
    }, [sessionCode]);

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        alert("URL kopyalandı!");
    };

    return (
        <div className="flex flex-col space-y-4 p-6 rounded shadow h-full">
            <h3 className="font-semibold">QR Kod & Katılım URL</h3>
            <div className="flex flex-col space-y-4 items-center h-full">
                {/* Gerçek QR kod */}
                <div className="bg-white p-4 rounded-md h-full">
                    {url && <QRCode value={url} className="w-full h-full" />}
                </div>

                <div className="flex-1 flex flex-col w-full">
                    <Input type="text" readOnly value={url} className="w-full" />
                    <Button onClick={handleCopy} variant="danger">
                        Kopyala
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default QRDisplay;
