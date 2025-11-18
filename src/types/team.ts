export interface JoinTeamRequest {
    teamName: string;
    sessionCode: string;
}

export interface JoinTeamResponse {
    teamId: string;
    teamToken: string;
    quizId: string;
    sessionCode: string;
}
