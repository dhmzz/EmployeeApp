export interface IAuthLoginRequest {
    email:string,
    password:string
}

export interface IAuthLoginResponse {
    status: boolean;
    message: string;
    data: {
        token: string;
        expires_in: number;
        user_data: IAuthUserData;
    };
}

export interface IAuthUserData {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
    created_at: string;
    updated_at: string;
}