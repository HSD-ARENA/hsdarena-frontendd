import { RealtimeMessage } from "@/types/realtime";

export const connectWebSocket = (url: string, onMessage: (msg: RealtimeMessage) => void) => {
    const ws = new WebSocket(url);
    ws.onmessage = (event) => onMessage(JSON.parse(event.data));
    return ws;
};
