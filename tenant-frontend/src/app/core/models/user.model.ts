export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
    is_admin: boolean;
    last_login_at?: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}
