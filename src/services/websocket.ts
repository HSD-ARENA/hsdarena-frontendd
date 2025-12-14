// services/websocket.ts
import { io, Socket } from "socket.io-client";

class WebSocketService {
    private socket: Socket | null = null;

    connect(token: string) {
        if (this.socket) return this.socket; // ikinci kez bağlanmasın

        this.socket = io("http://localhost:8080", {
            auth: { token }
        });

        this.socket.on("connect", () => {
            console.log("WS connected:", this.socket?.id);
        });

        this.socket.on("disconnect", () => {
            console.log("WS disconnected");
        });

        return this.socket;
    }

    getSocket() {
        return this.socket;
    }

    disconnect() {
        this.socket?.disconnect();
        this.socket = null;
    }
}

export const websocketService = new WebSocketService();
