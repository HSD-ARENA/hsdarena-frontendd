// ===========================
// EVENT NAMES - Backend'den gelen tam isimler
// ===========================

export enum RealtimeEvent {
    // Connection
    CONNECTION = 'connection',
    DISCONNECT = 'disconnect',

    // Session
    SESSION_STARTED = 'session:started',
    SESSION_ENDED = 'session:ended',

    // Question
    QUESTION_STARTED = 'question:started',
    QUESTION_TIME_WARNING = 'question:time-warning',
    QUESTION_ENDED = 'question:ended',

    // Answer
    ANSWER_SUBMITTED = 'answer:submitted',
    ANSWER_STATS_UPDATED = 'answer:stats-updated',

    // Scoreboard
    SCOREBOARD_UPDATED = 'scoreboard:updated',

    // Admin
    ADMIN_NEXT_QUESTION = 'admin:next-question',
    ADMIN_END_SESSION = 'admin:end-session',
}

// ===========================
// PAYLOADS - Backend'den gelen data tipleri
// ===========================

// Session
export interface SessionStartedPayload {
    sessionCode: string;
    timestamp: string;
}

export interface SessionEndedPayload {
    sessionCode: string;
    timestamp: string;
}

// Question
export interface QuestionChoice {
    id: string;
    text: string;
    isCorrect?: boolean;
}

export interface Question {
    id: string;
    text: string;
    type: 'MCQ' | 'TRUE_FALSE' | 'OPEN_ENDED';
    choices?: QuestionChoice[];
    timeLimitSec: number;
    points: number;
}

export interface QuestionStartedPayload {
    sessionCode: string;
    questionIndex: number;
    question: Question;
}

export interface QuestionTimeWarningPayload {
    sessionCode: string;
    questionIndex: number;
    remainingSeconds: number;
}

export interface QuestionEndedPayload {
    sessionCode: string;
    questionIndex: number;
    timestamp: string;
}

// Answer
export interface AnswerSubmittedPayload {
    sessionCode: string;
    teamId: string;
    timestamp: string;
}

export interface AnswerStatsUpdatedPayload {
    sessionCode: string;
    stats: {
        totalAnswers: number;
        correctAnswers: number;
    };
}

// Scoreboard
export interface LeaderboardEntry {
    teamName: string;
    score: number;
    rank: number;
}

export interface ScoreboardUpdatedPayload {
    sessionCode: string;
    leaderboard: LeaderboardEntry[];
    timestamp: string;
}

// Admin
export interface AdminNextQuestionPayload {
    sessionCode: string;
}

export interface AdminEndSessionPayload {
    sessionCode: string;
}