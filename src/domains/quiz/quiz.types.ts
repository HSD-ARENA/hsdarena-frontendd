import { QuizCreateQuestion, QuestionDetail } from '../questions/question.types';

export interface QuizCreateRequest {
    title: string;
    settings: {
        shuffleQuestions?: boolean;
        showCorrectAnswers?: boolean;
        allowRetake?: boolean;
    };
    questions: QuizCreateQuestion[];
}

export interface QuizCreateResponse {
    id: string;
    title: string;
    createdBy: string;
    createdAt: string;
    questionsCount: number;
}

export interface QuizUpdateRequest {
    title?: string;
    settings?:
    {
        shuffleQuestions?: boolean;
        showCorrectAnswers?: boolean;
        allowRetake?: boolean;
    };
}

export interface QuizUpdateResponse {
    id: string;
    title: string;
    visibility: 'private' | 'public';
    createdBy: string;
    createdAt: string;
    settings: {
        shuffleQuestions?: boolean;
        showCorrectAnswers?: boolean;
        allowRetake?: boolean;
    };
}

export interface Quiz {
    id: string;
    title: string;
    visibility: 'private' | 'public';
    createdAt: string;
    questionsCount: number;
}

export interface QuizDetailResponse {
    id: string;
    title: string;
    visibility: 'private' | 'public';
    createdBy: string;
    createdAt: string;
    settings: {
        allowRetake?: boolean;
        shuffleQuestions?: boolean;
        showCorrectAnswers?: boolean;
    };
    questions: QuestionDetail[];
}



