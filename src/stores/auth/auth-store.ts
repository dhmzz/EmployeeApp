import { IAuthLoginRequest, IAuthLoginResponse } from './auth-types';
import apiClient from '../../utils/apiClient';
import { removeToken } from '../global';
import router from '../../router';
import { ElNotification } from 'element-plus';

export const loginService = async (param: IAuthLoginRequest): Promise<IAuthLoginResponse | null> => {
    try {
        const url: string = '/auth/login';
        const res = await apiClient.post(url, param);

        if (res.status === 200) {
            return res.data;
        }
    } catch (error: any) {
        if (error.response) {
            return error.response.data;
        }
    }
    return null;
};

export const logoutService = async () => {
    try {
        const url: string = '/auth/logout';
        const res = await apiClient.post(url);

        if (res.status === 200) {
            router.push('/');
            removeToken();
            ElNotification({
                message: res.data.message,
                type: 'success',
            })
        }
    } catch (error: any) {
        ElNotification({
            message: error,
            type: 'error',
        });
    }
    return null;
};
