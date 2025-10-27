export interface JoinTeamRequest {
    teamName: string;
    sessionCode: string;
}

export interface JoinTeamResponse {
    teamId: string;
    message: string;
    success: boolean;
}
