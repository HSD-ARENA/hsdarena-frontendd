import { useEffect, useRef } from "react";
import { RealtimeMessage } from "@/types/realtime";

export function useWebSocket(url: string, onMessage: (msg: RealtimeMessage) => void) {
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        wsRef.current = new WebSocket(url);
        wsRef.current.onmessage = (event) => {
            const data: RealtimeMessage = JSON.parse(event.data);
            onMessage(data);
        };

        return () => wsRef.current?.close();
    }, [url]);

    return wsRef.current;
}
