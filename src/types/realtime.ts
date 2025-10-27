export type RealtimeEvent =
    | "question_start"
    | "answer_submit"
    | "score_update"
    | "quiz_end";

export interface RealtimeMessage {
    event: RealtimeEvent;
    data: any;
}
