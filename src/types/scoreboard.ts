export interface LeaderboardEntry {
    teamName: string;
    score: number;
}

export interface ScoreboardResponse {
    sessionCode: string;
    leaderboard: LeaderboardEntry[];
}
