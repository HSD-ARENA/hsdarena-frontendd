"use client";

import React from 'react';
import { useQuiz } from '@/hooks/useQuiz';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useParams } from 'next/navigation';

const QuizPage: React.FC<{ params: { sessionCode: string } }> = ({ params }) => {
    const { sessionCode } = useParams<{ sessionCode: string }>();

    // JWT token'ı auth state'inizden alın
    const token = localStorage.getItem('token') || '';
    console.log(token);
    const { isConnected, quizData, currentQuestion } = useWebSocket(token);
    const { fetch } = useQuiz();

    React.useEffect(() => {
        const getQuizData = async () => {
            if (!sessionCode) return;
            try {
                const res = await fetch(sessionCode);
                console.log('Fetched quiz data:', res);
            } catch (error) {
                console.error('Error fetching quiz data:', error);
            }
        };

        getQuizData();
    }, [fetch, sessionCode]);


    return (
        <div>
            <div>Connection Status: {isConnected ? 'Connected' : 'Disconnected'}</div>

            {quizData && (
                <div>
                    <h2>Quiz Started</h2>
                    <pre>{JSON.stringify(quizData, null, 2)}</pre>
                </div>
            )}

            {currentQuestion && (
                <div>
                    <h3>Current Question</h3>
                    <pre>{JSON.stringify(currentQuestion, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default QuizPage;