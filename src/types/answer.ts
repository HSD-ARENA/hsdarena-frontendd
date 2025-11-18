export interface AnswerRequest {
    teamId: string;
    sessionId: string;
    questionId: string;
    answer: string;
}

export interface AnswerResponse {
    isCorrect: boolean;
    earnedPoints: number;
    totalScore: number;
}
