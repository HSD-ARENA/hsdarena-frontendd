"use client";

import { useEffect, useState } from "react";
import { joinTeam } from "@/domains/team/team.service";
import { JoinTeamRequest, JoinTeamResponse } from "@/domains/team/team.types";
import { useAsync } from "@/hooks/useAsync";

const TEAM_TOKEN_KEY = "teamToken";
const TEAM_KEY = "team";

export function useTeam() {
    const { loading, run } = useAsync();
    const [team, setTeam] = useState<JoinTeamResponse | null>(null);
    const [initialized, setInitialized] = useState(false);

    // hydrate
    useEffect(() => {
        const stored = localStorage.getItem(TEAM_KEY);
        if (stored) {
            setTeam(JSON.parse(stored));
        }
        setInitialized(true);
    }, []);

    const join = (data: JoinTeamRequest): Promise<JoinTeamResponse> =>
        run(async () => {
            const response = await joinTeam(data);

            localStorage.setItem(TEAM_TOKEN_KEY, response.teamToken);
            localStorage.setItem(TEAM_KEY, JSON.stringify(response));

            setTeam(response);
            return response;
        });

    const leave = () => {
        localStorage.removeItem(TEAM_TOKEN_KEY);
        localStorage.removeItem(TEAM_KEY);
        setTeam(null);
    };

    return {
        team,
        isJoined: Boolean(team),
        join,
        leave,
        loading,
        initialized,
    };
}
