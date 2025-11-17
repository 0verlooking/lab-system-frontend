// src/api/http.ts
import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:8080/api",
});

// автоматично підставляємо JWT у кожен запит
http.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        if (!config.headers) config.headers = {};
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
});

export default http;
