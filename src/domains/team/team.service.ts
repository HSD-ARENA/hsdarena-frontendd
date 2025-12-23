import { apiFetch } from "@/lib/api";
import { JoinTeamRequest, JoinTeamResponse } from "@/domains/team/team.types";

export const joinTeam = async (data: JoinTeamRequest): Promise<JoinTeamResponse> =>
    apiFetch("/teams/join", { method: "POST", body: JSON.stringify(data) });
