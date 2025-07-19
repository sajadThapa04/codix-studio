import axios from "axios";
import conf from "../conf/conf";
// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
    maxRequests: 5, // Max requests per window
    windowMs: 60 * 1000 // 1 minute window
};

let requestCount = 0;
let lastRequestTime = Date.now();

export const adminApi = axios.create({
    baseURL: `${conf.base_url}/api/v1/admin`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

// Add request interceptor for rate limiting
adminApi.interceptors.request.use(async config => {
    const now = Date.now();
    const elapsed = now - lastRequestTime;

    // Reset counter if window has passed
    if (elapsed > RATE_LIMIT_CONFIG.windowMs) {
        requestCount = 0;
        lastRequestTime = now;
    }

    // If we've exceeded the rate limit, delay the request
    if (requestCount >= RATE_LIMIT_CONFIG.maxRequests) {
        const delay = RATE_LIMIT_CONFIG.windowMs - elapsed;
        await new Promise(resolve => setTimeout(resolve, delay));
        requestCount = 0;
        lastRequestTime = Date.now();
    }

    requestCount++;
    return config;
}, error => {
    return Promise.reject(error);
});

// Superadmin initialization
export const initSuperadmin = async (adminData) => {
    try {
        const response = await adminApi.post("/init-superadmin", adminData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Admin authentication
export const loginAdmin = async (credentials) => {
    try {
        const response = await adminApi.post("/login", credentials);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const refreshAdminToken = async (refreshToken) => {
    try {
        const response = await adminApi.post("/refresh-token", { refreshToken });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const logoutAdmin = async () => {
    try {
        const response = await adminApi.post("/logout");
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Admin management
export const createAdmin = async (adminData) => {
    try {
        const response = await adminApi.post("/create-admin", adminData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteAdmin = async (adminId) => {
    try {
        const response = await adminApi.delete(`/${adminId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Password management
export const changePassword = async (passwordData) => {
    try {
        const response = await adminApi.post("/change-password", passwordData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const requestPasswordReset = async (email) => {
    try {
        const response = await adminApi.post("/request-password-reset", { email });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const resetPassword = async (resetData) => {
    try {
        const response = await adminApi.post("/reset-password", resetData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Helper function to set auth token
export const setAuthToken = (token) => {
    if (token) {
        adminApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete adminApi.defaults.headers.common["Authorization"];
    }
};

// Helper function to handle errors
const handleApiError = (error) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        console.error("API Error:", error.response.data);
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
    } else if (error.request) {
        // The request was made but no response was received
        console.error("API Error: No response received", error.request);
    } else {
        // Something happened in setting up the request
        console.error("API Error:", error.message);
    }
    return Promise.reject(error);
};

// Add response interceptor for error handling
adminApi.interceptors.response.use(
    response => response,
    error => handleApiError(error)
);