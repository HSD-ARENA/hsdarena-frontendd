export interface QuizQuestion {
    text: string;
    options: string[];
    correct: string;
}

export interface QuizCreateRequest {
    title: string;
    questions: QuizQuestion[];
}

export interface QuizCreateResponse {
    quizId: string;
    message: string;
}

export interface QuizDetail {
    quizId: string;
    title: string;
    questions: { questionId: string; text: string; options: string[] }[];
}
