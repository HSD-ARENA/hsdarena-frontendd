import { apiFetch } from "@/lib/api";
import { LoginRequest, LoginResponse } from "@/types/auth";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
    return await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
    });
};

export const getUser = async () => {
    const res = await apiFetch("/users/1");

    if (!res || res.error) {
        throw new Error("Kullanıcı alınamadı");
    }

    return res;
};
