"use client";

import { FC, useEffect, useState } from "react";
import { getScoreboard } from "@/services/scoreboard";

interface TeamScore {
    teamName: string;
    score: number;
}

interface ScoreboardTableProps {
    sessionCode: string;
    top?: number; // kaç takım gösterilecek
}

const ScoreboardTable: FC<ScoreboardTableProps> = ({ sessionCode, top = 10 }) => {
    const [scores, setScores] = useState<TeamScore[]>([]);

    useEffect(() => {
        getScoreboard(sessionCode).then(res => {
            setScores(res.leaderboard || []);
        });
    }, [sessionCode]);

    return (
        <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold mb-2">Liderlik Tablosu</h3>
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b">
                        <th className="py-1">#</th>
                        <th>Takım</th>
                        <th>Puan</th>
                    </tr>
                </thead>
                <tbody>
                    {scores.slice(0, top).map((team, idx) => (
                        <tr key={team.teamName} className="border-b">
                            <td className="py-1">{idx + 1}</td>
                            <td>{team.teamName}</td>
                            <td>{team.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ScoreboardTable;
