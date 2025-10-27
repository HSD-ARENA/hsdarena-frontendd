import { submitAnswer } from "@/services/answer";
import { AnswerRequest, AnswerResponse } from "@/types/answer";

export function useAnswer() {
    const send = async (data: AnswerRequest): Promise<AnswerResponse> =>
        submitAnswer(data);

    return { send };
}
