import { useState, useEffect } from "react";
import { getScoreboard } from "@/services/scoreboard";
import { ScoreboardResponse } from "@/types/scoreboard";

export function useScoreboard(sessionCode: string) {
    const [scoreboard, setScoreboard] = useState<ScoreboardResponse | null>(null);

    const fetch = async () => {
        const res = await getScoreboard(sessionCode);
        setScoreboard(res);
    };

    useEffect(() => {
        fetch();
    }, [sessionCode]);

    return { scoreboard, fetch };
}
