const baseApi = import.meta.env.VITE_API_URL;

const setToken = (token: string) => {
    localStorage.setItem('token', token);
};

const getToken = () => {
    return localStorage.getItem('token');
};

const removeToken = () => {
    localStorage.removeItem('token');
};

const setProfile = (profile:string) => {
    localStorage.setItem('profile', profile)
};

const getProfile = () => {
    return localStorage.getItem('profile');
};

export {baseApi, setToken, getToken, removeToken, setProfile, getProfile};
