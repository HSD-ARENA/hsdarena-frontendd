import { joinTeam } from "@/services/team";
import { JoinTeamRequest, JoinTeamResponse } from "@/types/team";

export function useTeam() {
    const join = async (data: JoinTeamRequest): Promise<JoinTeamResponse> =>
        joinTeam(data);

    return { join };
}
