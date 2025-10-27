// WebSocket bağlantısı için basit bir yardımcı sınıf
// Otomatik reconnect, event listener kaydı gibi işlevler içeriyor.

type MessageHandler = (msg: any) => void;

export class WebSocketClient {
    private socket: WebSocket | null = null;
    private url: string;
    private handlers: Set<MessageHandler> = new Set();
    private reconnectDelay = 3000; // ms

    constructor(url: string) {
        this.url = url;
    }

    connect() {
        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => console.log("[WS] Connected:", this.url);
        this.socket.onclose = () => {
            console.warn("[WS] Disconnected, retrying...");
            setTimeout(() => this.connect(), this.reconnectDelay);
        };

        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.handlers.forEach((h) => h(data));
            } catch (e) {
                console.error("[WS] Message parse error:", e);
            }
        };
    }

    send(data: any) {
        if (this.socket?.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        } else {
            console.warn("[WS] Connection not ready, message dropped");
        }
    }

    onMessage(handler: MessageHandler) {
        this.handlers.add(handler);
    }

    offMessage(handler: MessageHandler) {
        this.handlers.delete(handler);
    }

    close() {
        this.socket?.close();
    }
}
