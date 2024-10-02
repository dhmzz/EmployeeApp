// src/utils/axios.ts
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import router from '../router'; // Sesuaikan path ini sesuai dengan struktur proyek Anda
import { ElMessageBox } from 'element-plus';
import { getToken } from '../stores/global';

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      ElMessageBox.confirm(
        'Please re-sign in to access the application',
        'Session Expired!',
        {
          closeOnClickModal: false,
          confirmButtonText: 'OK',
          type: 'info',
          center: true,
          showCancelButton: false,
          showClose:false,
        }
    )
      router.push('/');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
