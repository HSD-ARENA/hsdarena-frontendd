"use client";

import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { wsService } from '../services/webSocket.service';

export const useWebSocket = (token: string) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [quizData, setQuizData] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(null);

    useEffect(() => {
        const socket = wsService.connect(token);

        socket.on('connect', () => {
            setIsConnected(true);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        socket.on('quizStarted', (data) => {
            setQuizData(data);
        });

        socket.on('questionReceived', (question) => {
            setCurrentQuestion(question);
        });

        setSocket(socket);

        return () => {
            wsService.disconnect();
        };
    }, [token]);

    return {
        socket,
        isConnected,
        quizData,
        currentQuestion
    };
};