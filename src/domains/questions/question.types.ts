import { Choice, Type } from "@/types/common";

export interface QuizCreateQuestion {
    index: number;
    text: string;
    type: Type;
    choices: { id: Choice; text: string; }[];
    correctAnswer: Choice;
    timeLimitSec: number;
    points: number;
}

// Add Question Interfaces

export interface QuizAddQuestionRequest {
    text: string;
    type: Type;
    choices: { id: Choice; text: string; }[];
    correctAnswer: Choice;
    timeLimitSec: number;
    points: number;
    indexInQuiz: number;
}

export type QuizAddQuestionResponse = QuestionDetail;

// Update Question Interfaces

export interface QuizUpdateQuestionRequest {
    text: string;
    type: Type;
    choices: { id: Choice; text: string; }[];
    correctAnswer: Choice;
    timeLimitSec: number;
    points: number;
    indexInQuiz: number;
}

export type QuizUpdateQuestionResponse = QuestionDetail;

export interface QuestionDetail {
    id: string;
    quizId: string;
    text: string;
    type: Type;
    choices: { id: Choice; text: string; }[];
    correctAnswer: Choice | { id: Choice };
    timeLimitSec: number;
    points: number;
    indexInQuiz: number;
}

export interface CurrentQuestionResponse {
    id: string;
    text: string;
    type: Type;
    choices: { id: Choice; text: string; }[];
    timeLimitSec: number;
    points: number;
    indexInQuiz: number;
}