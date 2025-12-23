import { apiFetch } from "@/lib/api";
import { UpdateEmailRequest, UpdateEmailResponse, UpdatePasswordRequest } from "@/domains/user/user.types"

export const UpdateEmail = async (data: UpdateEmailRequest): Promise<UpdateEmailResponse> =>
    apiFetch("/users/me/email", { method: "PUT", body: JSON.stringify(data) });

export const UpdatePassword = async (data: UpdatePasswordRequest): Promise<void> =>
    apiFetch("/users/me/password", { method: "PUT", body: JSON.stringify(data) });

export const DeleteAccount = async (): Promise<void> =>
    apiFetch("/users/me", { method: "DELETE" });