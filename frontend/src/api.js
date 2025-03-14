import axios from "axios";

// Base API instance
const api = axios.create({
    baseURL: "https://gold-mine-repo.onrender.com",
    headers: { "Content-Type": "application/json" },
});

// Function to refresh the token
const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refresh");
    if (!refreshToken) {
        console.warn("⚠ No refresh token found. Redirecting to login.");
        localStorage.clear();
        window.location.href = "/";
        return null;
    }

    try {
        const response = await axios.post("http://127.0.0.1:8000/api/auth/refresh-token/", { refresh: refreshToken });

        if (response.status === 200) {
            localStorage.setItem("access", response.data.access);
            localStorage.setItem("refresh", response.data.refresh);  // Update refresh token too
            console.log("🔄 Access token refreshed successfully!");
            return response.data.access;
        }
    } catch (error) {
        console.error("❌ Failed to refresh token:", error);
        localStorage.clear();
        window.location.href = "/";
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
        } else {
            console.warn("⚠ No access token available. Redirecting to login.");
            localStorage.clear();
            window.location.href = "/";
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
