import { QuizDetailResponse } from '../quiz/quiz.types';

export interface SessionCreateRequest {
    startsAt: string;
}

export interface SessionCreateResponse {
    sessionId: string;
    sessionCode: string;
    quizId: string;
    status: string;
}

export interface SessionDetailResponse {
    id: string;
    quizId: string;
    sessionCode: string;
    status: string;
    currentQuestionIndex: number;
    startsAt: string;
    createdAt: string;
    quiz: QuizDetailResponse;
    teams: {
        id: string;
        sessionId: string;
        name: string;
        disqualified: boolean;
        joinedAt: string;
    }[];
}

export interface SessionStartResponse {
    massage: string;
    sessionCode: string;
    status: string;
}

export interface SessionQuisForTeamsResponse {
    id: string;
    title: string;
    settings: {
        shuffleQuestions?: boolean;
        showCorrectAnswers?: boolean;
        allowRetake?: boolean;
    };
}

export interface SessionTeamsResponse {
    sessionCode: string;
    teams: {
        id: string;
        name: string;
        isDisqualified: boolean;
    }[];
    totalTeams: number;
}