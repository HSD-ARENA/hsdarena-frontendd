import { io, Socket } from 'socket.io-client';

export class WebSocketService {
    private socket: Socket | null = null;

    connect(token: string) {
        this.socket = io('http://localhost:8080', {
            auth: { token }
        });

        this.socket.on('connect', () => {
            console.log('WebSocket connected');
        });

        this.socket.on('disconnect', () => {
            console.log('WebSocket disconnected');
        });

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    getSocket() {
        return this.socket;
    }
}

export const wsService = new WebSocketService();