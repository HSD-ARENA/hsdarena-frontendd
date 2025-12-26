"use client";

import { useState, useCallback } from "react";
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
    const create = useCallback((
        quizId: string,
        payload: SessionCreateRequest
    ): Promise<SessionCreateResponse> =>
        run(async () => {
            const created = await createSession(quizId, payload);
            setSessionSummary(created);
            return created;
        }), [run]);

    // FETCH SESSION DETAIL
    const fetchByCode = useCallback((
        code: string
    ): Promise<SessionDetailResponse> =>
        run(async () => {
            const detail = await fetchSession(code);
            setSessionDetail(detail);
            return detail;
        }), [run]);

    // START SESSION
    const start = useCallback((code: string): Promise<SessionStartResponse> =>
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
        }), [run]);


    // FETCH SESSION QUIZ
    const fetchQuiz = useCallback((code: string): Promise<SessionQuisForTeamsResponse> =>
        run(async () => {
            const quiz = await fetchSessionQuiz(code);
            setSessionQuiz(quiz);
            return quiz;
        }), [run]);


    // FETCH CURRENT QUESTION
    const fetchQuestion = useCallback((
        code: string
    ): Promise<CurrentQuestionResponse> =>
        run(async () => {
            const question = await fetchCurrentQuestion(code);
            setCurrentQuestion(question);
            return question;
        }), [run]);

    // SUBMIT ANSWER
    const answer = useCallback((
        code: string,
        payload: AnswerRequest
    ): Promise<AnswerResponse> =>
        run(() => submitAnswer(code, payload)), [run]);

    // FETCH TEAMS
    const fetchAllTeams = useCallback((
        code: string
    ): Promise<SessionTeamsResponse> =>
        run(async () => {
            const data = await fetchTeams(code);
            setTeams(data);
            return data;
        }), [run]);

    // FETCH SCOREBOARD
    const fetchBoard = useCallback((
        code: string
    ): Promise<ScoreboardResponse> =>
        run(async () => {
            const board = await fetchScoreboard(code);
            setScoreboard(board);
            return board;
        }), [run]);

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
