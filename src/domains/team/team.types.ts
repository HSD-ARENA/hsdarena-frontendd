export interface JoinTeamRequest {
    sessionCode: string;
    teamName: string;
}

export interface JoinTeamResponse {
    teamId: string;
    teamToken: string;
    quizId: string;
    sessionCode: string;
}
