import { Choice } from '@/types/common';

export interface AnswerRequest {
    questionId: string;
    answerPayload: Choice;
}

export interface AnswerResponse {
    answerId: string;
    isCorrect: boolean;
    pointsAwarded: number;
    submittedAt: string;
    message: string;
}