export interface LeaderboardEntry {
  teamId: string;
  teamName: string;
  score: number;
}

export interface ScoreboardResponse {
  sessionCode: string;
  leaderboard: LeaderboardEntry[];
}