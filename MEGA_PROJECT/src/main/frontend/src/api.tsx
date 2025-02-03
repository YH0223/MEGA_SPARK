import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080", // ✅ 백엔드 API URL을 명확히 설정
    headers: { "Content-Type": "application/json" },
    withCredentials: true, // ✅ 세션 사용 시 필요
});


export default api;
