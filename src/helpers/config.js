import axios from "axios";
import { store } from "../redux/store/index.js";

export const axiosRequest = axios.create({
    baseURL: "http://e-commerce-laravel.test/api/",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

// Attach token if available
axiosRequest.interceptors.request.use((config) => {
    const token = store.getState().user.token; // assuming you store it in Redux
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
