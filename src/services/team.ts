import { apiFetch } from "@/lib/api";
import { JoinTeamRequest, JoinTeamResponse } from "@/types/team";

export const joinTeam = async (data: JoinTeamRequest): Promise<JoinTeamResponse> =>
    apiFetch("/team/join", { method: "POST", body: JSON.stringify(data) });
