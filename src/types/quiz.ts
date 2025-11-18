export interface QuizQuestion {
    index: number;
    text: string;
    type: string;
    choices: { id: string; text: string; }[];
    correctAnswer: string;
    timeLimitSec: number;
    points: number;
}

export interface QuizCreateRequest {
    title: string;
    settings: {
        shuffleQuestions: boolean;
        showCorrectAnswers: boolean;
        allowRetake: boolean;
    };
    questions: QuizQuestion[];
}

export interface QuizCreateResponse {
    id: string;
    title: string;
    adminId: string;
    createdAt: string;
    questionsCount: number;
}

export interface QuizDetail {
    sessionId: string;
    sessionCode: string;
    quizId: string;
    quizTitle: string;
    questions: { id: string; index: number; text: string; type: "MCQ"; choices: { id: string; text: string; }[] }[];
}

export interface SessionCreateResponse {
    id: string;
    quizId: string;
    sessionCode: string;
    status: string;
    currentQuestionIndex: string;
    startsAt: string;
    createdAt: string;
}
