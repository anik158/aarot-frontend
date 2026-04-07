import axios from "axios";
import { store } from "../redux/store/index.js";
import { getGuestToken } from "./guestToken.js";

export const axiosRequest = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://e-commerce-laravel.test/api/",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

axiosRequest.interceptors.request.use((config) => {
    const token = store.getState().user.token;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        config.headers['X-Guest-Token'] = getGuestToken();
    }

    return config;
});

export default axiosRequest;