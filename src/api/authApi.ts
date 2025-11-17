import http from "./http";

export const login = async (data) => {
    const res = await http.post("/auth/login", data);

    // зберігаємо токен
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role);

    return res.data;
};

export const register = async (data) => {
    const res = await http.post("/auth/register", data);
    return res.data;
};
