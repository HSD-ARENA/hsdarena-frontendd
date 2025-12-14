import { useState, useEffect } from "react";
import { getScoreboard } from "@/services/scoreboard";
import { ScoreboardResponse } from "@/types/scoreboard";

export function useScoreboard(sessionCode: string, auto = true) {
    const [scoreboard, setScoreboard] = useState<ScoreboardResponse | null>(null);

    const fetchScoreboard = async () => {
        const res = await getScoreboard(sessionCode);
        setScoreboard(res);
    };

    useEffect(() => {
        if (auto && sessionCode) {
            fetchScoreboard();
        }
    }, [sessionCode, auto]);

    return { scoreboard, fetchScoreboard };
}

