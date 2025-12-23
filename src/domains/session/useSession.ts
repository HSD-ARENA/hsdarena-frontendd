"use client";

import { useState } from "react";
import {
    createSession,
    fetchSession,
    fetchScoreboard,
    startSession,
    fetchSessionQuiz,
    fetchCurrentQuestion,
    submitAnswer,
    fetchTeams,
} from "@/domains/session/session.service";

import { useAsync } from "@/hooks/useAsync";
import { AnswerRequest, AnswerResponse } from "./answer.types";
import {
    SessionCreateRequest,
    SessionCreateResponse,
    SessionDetailResponse,
    SessionQuisForTeamsResponse,
    SessionStartResponse,
    SessionTeamsResponse,
} from "@/domains/session/session.types";
import { ScoreboardResponse } from "@/domains/session/scoreboard.types";
import { CurrentQuestionResponse } from "@/domains/questions/question.types";

export function useSession() {
    const { loading, run } = useAsync();

    // CREATE sonrası gelen hafif response
    const [sessionSummary, setSessionSummary] =
        useState<SessionCreateResponse | null>(null);

    // Session detayları (asıl source of truth)
    const [sessionDetail, setSessionDetail] =
        useState<SessionDetailResponse | null>(null);

    const [teams, setTeams] =
        useState<SessionTeamsResponse | null>(null);

    const [scoreboard, setScoreboard] =
        useState<ScoreboardResponse | null>(null);

    const [sessionQuiz, setSessionQuiz]
        = useState<SessionQuisForTeamsResponse | null>(null);

    const [currentQuestion, setCurrentQuestion] =
        useState<CurrentQuestionResponse | null>(null);

    // CREATE SESSION
    const create = (
        quizId: string,
        payload: SessionCreateRequest
    ): Promise<SessionCreateResponse> =>
        run(async () => {
            const created = await createSession(quizId, payload);
            setSessionSummary(created);
            return created;
        });

    // FETCH SESSION DETAIL
    const fetchByCode = (
        code: string
    ): Promise<SessionDetailResponse> =>
        run(async () => {
            const detail = await fetchSession(code);
            setSessionDetail(detail);
            return detail;
        });

    // START SESSION
    const start = (code: string): Promise<SessionStartResponse> =>
        run(async () => {
            const res = await startSession(code);

            setSessionDetail((prev) =>
                prev
                    ? {
                        ...prev,
                        status: res.status,
                    }
                    : prev
            );

            return res;
        });


    // FETCH SESSION QUIZ
    const fetchQuiz = (code: string): Promise<SessionQuisForTeamsResponse> =>
        run(async () => {
            const quiz = await fetchSessionQuiz(code);
            setSessionQuiz(quiz);
            return quiz;
        });


    // FETCH CURRENT QUESTION
    const fetchQuestion = (
        code: string
    ): Promise<CurrentQuestionResponse> =>
        run(async () => {
            const question = await fetchCurrentQuestion(code);
            setCurrentQuestion(question);
            return question;
        });

    // SUBMIT ANSWER
    const answer = (
        code: string,
        payload: AnswerRequest
    ): Promise<AnswerResponse> =>
        run(() => submitAnswer(code, payload));

    // FETCH TEAMS
    const fetchAllTeams = (
        code: string
    ): Promise<SessionTeamsResponse> =>
        run(async () => {
            const data = await fetchTeams(code);
            setTeams(data);
            return data;
        });

    // FETCH SCOREBOARD
    const fetchBoard = (
        code: string
    ): Promise<ScoreboardResponse> =>
        run(async () => {
            const board = await fetchScoreboard(code);
            setScoreboard(board);
            return board;
        });

    return {
        // state
        sessionSummary,
        sessionDetail,
        sessionQuiz,
        teams,
        scoreboard,
        currentQuestion,
        loading,

        // actions
        createSession: create,
        fetchSession: fetchByCode,
        startSession: start,
        fetchSessionQuiz: fetchQuiz,
        fetchCurrentQuestion: fetchQuestion,
        submitAnswer: answer,
        fetchTeams: fetchAllTeams,
        fetchScoreboard: fetchBoard,
    };
}
