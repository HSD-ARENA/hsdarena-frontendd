export type User = {
    id: string;
    email: string;
    role: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
}

export interface RegisterResponse {
    access_token: string;
    user: User;
};

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    user: User;
}

export interface CurrentUserResponse {
    id: string;
    email: string;
    createdAt: string;
    role: string;
}