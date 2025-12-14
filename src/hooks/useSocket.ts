// hooks/useSocket.ts
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { websocketService } from "../services/websocket";

export function useSocket(token: string | null) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!token) return;

    const s = websocketService.connect(token);
    setSocket(s);

    return () => {
      websocketService.disconnect();
    };
  }, [token]);

  return socket;
}
