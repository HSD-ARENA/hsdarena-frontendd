import { apiFetch } from "@/lib/api";
import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, CurrentUserResponse } from "@/domains/auth/auth.types";

export const register = async (data: RegisterRequest): Promise<RegisterResponse> =>
    apiFetch("/auth/register", { method: "POST", body: JSON.stringify(data) });

export const login = async (data: LoginRequest): Promise<LoginResponse> =>
    apiFetch("/auth/login", { method: "POST", body: JSON.stringify(data) });

export const logout = async () =>
    apiFetch("/auth/logout", { method: "POST" });

export const fetchCurrentUser = async (): Promise<CurrentUserResponse> =>
    apiFetch("/auth/me");