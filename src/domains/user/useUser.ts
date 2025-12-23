"use client";

import { useAsync } from "@/hooks/useAsync";
import { UpdateEmail, UpdatePassword, DeleteAccount } from "@/domains/user/user.service";
import {
    UpdateEmailRequest,
    UpdateEmailResponse,
    UpdatePasswordRequest,
} from "@/domains/user/user.types";

const USER_KEY = "user";
const TOKEN_KEY = "token";

export function useUser() {
    const { loading, run } = useAsync();

    // UPDATE EMAIL
    const updateEmail = (
        data: UpdateEmailRequest
    ): Promise<UpdateEmailResponse> =>
        run(async () => {
            const response = await UpdateEmail(data);

            // localStorage user sync
            const storedUser = localStorage.getItem(USER_KEY);
            if (storedUser) {
                const user = JSON.parse(storedUser);
                const updatedUser = {
                    ...user,
                    email: response.user.email,
                };
                localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
            }

            return response;
        });

    // UPDATE PASSWORD
    const updatePassword = (
        data: UpdatePasswordRequest
    ): Promise<void> =>
        run(() => UpdatePassword(data));

    // DELETE ACCOUNT
    const deleteAccount = (): Promise<void> =>
        run(async () => {
            await DeleteAccount();

            // hard cleanup
            localStorage.removeItem(USER_KEY);
            localStorage.removeItem(TOKEN_KEY);
        });

    return {
        updateEmail,
        updatePassword,
        deleteAccount,
        loading,
    };
}
