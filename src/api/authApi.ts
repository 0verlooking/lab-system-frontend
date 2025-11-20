import http from './http';

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    email: string;
    role?: 'STUDENT' | 'ADMIN';
}

export interface AuthResponse {
    token: string;
    role: string;
    username: string;
}

export const authApi = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const res = await http.post<AuthResponse>('/auth/login', data);
        return res.data;
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const res = await http.post<AuthResponse>('/auth/register', data);
        return res.data;
    },
};
