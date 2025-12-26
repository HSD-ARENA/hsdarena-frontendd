import { io, Socket } from 'socket.io-client';

/**
 * Simple WebSocket Manager
 * Directly follows backend documentation example
 */
class SocketManager {
  private socket: Socket | null = null;
  private currentToken: string | null = null;

  /**
   * Connect to WebSocket server with auth token
   */
  connect(token: string): Promise<void> {
    // If already connected with same token, do nothing
    if (this.socket?.connected && this.currentToken === token) {
      console.log('✅ Already connected');
      return Promise.resolve();
    }

    // Disconnect old connection if token changed
    if (this.socket && this.currentToken !== token) {
      console.log('🔄 Token changed, reconnecting...');
      this.socket.disconnect();
      this.socket = null;
    }

    console.log('🔌 Connecting to WebSocket...');
    this.currentToken = token;

    // Create connection with auth token
    // removee /api from api url for socket connection
    const socketUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api$/, '') || '';
    this.socket = io(`${socketUrl}/realtime`, {
  auth: { token: token },
  transports: ['websocket', 'polling']
    });

    // Return a promise that resolves when connected
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Connection timeout'));
      }, 5000);

      this.socket!.on('connect', () => {
        clearTimeout(timeout);
        console.log('✅ Connected, Socket ID:', this.socket?.id);
        resolve();
      });

      this.socket!.on('disconnect', () => {
        console.log('👋 Disconnected');
      });

      this.socket!.on('connect_error', (error) => {
        clearTimeout(timeout);
        console.error('❌ Connection error:', error.message);
        reject(error);
      });
    });
  }

  /**
   * Join a session room
   */
  joinSession(sessionCode: string): void {
    if (!this.socket?.connected) {
      console.error('❌ Not connected. Call connect() first.');
      return;
    }

    console.log('🚪 Joining session:', sessionCode);
    this.socket.emit('join_session', { sessionCode });
  }

  /**
   * Emit an event to the server
   */
  emit(event: string, data: unknown): void {
    if (!this.socket?.connected) {
      console.error('❌ Not connected. Cannot emit event:', event);
      return;
    }

    console.log(`📤 Emitting: ${event}`, data);
    this.socket.emit(event, data);
  }

  /**
   * Listen to an event from the server
   * Returns unsubscribe function
   */
  on<T>(event: string, handler: (data: T) => void): () => void {
    if (!this.socket) {
      console.error('❌ Socket not initialized. Call connect() first.');
      return () => { };
    }

    this.socket.on(event, handler);

    // Return unsubscribe function
    return () => {
      this.socket?.off(event, handler);
    };
  }

  /**
   * Remove all listeners for an event
   */
  off(event: string): void {
    this.socket?.off(event);
  }

  /**
   * Disconnect from the server
   */
  disconnect(): void {
    if (this.socket) {
      console.log('👋 Disconnecting...');
      this.socket.disconnect();
      this.socket = null;
      this.currentToken = null;
    }
  }

  /**
   * Check if connected
   */
  get isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

// Export singleton instance
export const socketManager = new SocketManager();