import { joinTeam } from "@/services/team";
import { JoinTeamRequest, JoinTeamResponse } from "@/types/team";
import { useState } from "react";

export function useTeam() {
    const [loading, setLoading] = useState(false);

    const join = async (data: JoinTeamRequest): Promise<JoinTeamResponse> => {
        setLoading(true);
        try {
            const response = await joinTeam(data);
            return {
                success: true,
                teamId: response.teamId,
                message: response.message
            };
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }
    return { join, loading };
}