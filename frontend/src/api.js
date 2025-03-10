import axios from "axios";

// Base API instance
const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    headers: { "Content-Type": "application/json" },
});

// Function to refresh the token
const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refresh");
    if (!refreshToken) return null;

    try {
        const response = await axios.post("http://127.0.0.1:8000/api/auth/refresh-access/", {
            refresh: refreshToken,
        });

        if (response.status === 200) {
            localStorage.setItem("access", response.data.access);
            return response.data.access;
        }
    } catch (error) {
        console.error("Failed to refresh token:", error);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        return null;
    }
};

// API interceptor for token expiry handling
api.interceptors.request.use(
    async (config) => {
        let accessToken = localStorage.getItem("access");

        if (!accessToken) {
            accessToken = await refreshAccessToken();
        }

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
