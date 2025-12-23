import { Choice } from './question.types';

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