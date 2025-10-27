import { apiFetch } from "@/lib/api";
import { ScoreboardResponse } from "@/types/scoreboard";

export const getScoreboard = async (sessionCode: string): Promise<ScoreboardResponse> =>
    apiFetch(`/scoreboard/${sessionCode}`);
