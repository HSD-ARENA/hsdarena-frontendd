export interface NewQuestionPayload {
    id: string;
    text: string;
    choices: { id: string; text: string }[];
}

export type SocketEvents =
    | "answer-submitted"
    | "admin:next-question"
    | "answer-stats-updated"
    | "scoreboard-updated"
    | "new-question"
    | "time-warning"
    | "question-timeout";
