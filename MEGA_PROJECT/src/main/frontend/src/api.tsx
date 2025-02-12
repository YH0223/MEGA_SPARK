import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // 환경 변수 사용

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // 세션 유지
});

export default api;