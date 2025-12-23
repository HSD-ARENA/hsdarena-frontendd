
export interface UpdateEmailRequest {
    newEmail: string;
    currentPassword: string;
}

export interface UpdateEmailResponse {
    message: string;
    user: {
        id: string;
        email: string;
        createdAt: string;
    };
}

export interface UpdatePasswordRequest {
    currentPassword: string;
    newPassword: string;
}
