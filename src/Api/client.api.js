import axios from "axios";
import conf from "../conf/conf";
// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
    maxRequests: 5, // Max requests per window
    windowMs: 60 * 1000 // 1 minute window
};

let requestCount = 0;
let lastRequestTime = Date.now();

export const clientApi = axios.create({
    baseURL: conf.node_env === "production" ? `${conf.base_url}/api/v1/client` : "/api/v1/client",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

// Add request interceptor for rate limiting
clientApi.interceptors.request.use(async config => {
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

// Client Authentication
export const registerClient = async (clientData) => {
    try {
        const response = await clientApi.post("/register", clientData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const loginClient = async (credentials) => {
    try {
        const response = await clientApi.post("/login", credentials);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const verifyClientEmail = async (token) => {
    try {
        const response = await clientApi.get("/verify-email", {
            params: { token }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const logoutClient = async () => {
    try {
        const response = await clientApi.post("/logout");
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const refreshClientToken = async (refreshToken) => {
    try {
        const response = await clientApi.post("/refresh-token", { refreshToken });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Client Profile Management
export const getCurrentClient = async () => {
    try {
        const response = await clientApi.get("/me");
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
export const updateClientDetails = async (clientData) => {
    try {
        const response = await clientApi.patch("/update-details", clientData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateClientAddress = async (addressData) => {
    try {
        const response = await clientApi.patch("/update-address", addressData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Password Management
export const changeClientPassword = async (passwordData) => {
    try {
        const response = await clientApi.post("/change-password", passwordData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const requestClientPasswordReset = async (email) => {
    try {
        const response = await clientApi.post("/request-password-reset", { email });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const resetClientPassword = async (resetData) => {
    try {
        const response = await clientApi.post("/reset-password", resetData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Profile Image Upload
export const uploadClientProfileImage = async (imageFile) => {
    try {
        const formData = new FormData();
        formData.append("profileImage", imageFile);

        const response = await clientApi.patch("/upload-profile-image", formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Helper function to set auth token
export const setClientAuthToken = (token) => {
    if (token) {
        clientApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete clientApi.defaults.headers.common["Authorization"];
    }
};

// Helper function to handle errors
const handleClientApiError = (error) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        console.error("Client API Error:", error.response.data);
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
    } else if (error.request) {
        // The request was made but no response was received
        console.error("Client API Error: No response received", error.request);
    } else {
        // Something happened in setting up the request
        console.error("Client API Error:", error.message);
    }
    return Promise.reject(error);
};

// Add response interceptor for error handling
clientApi.interceptors.response.use(
    response => response,
    error => handleClientApiError(error)
);

export default {
    registerClient,
    loginClient,
    verifyClientEmail,
    logoutClient,
    refreshClientToken,
    getCurrentClient,
    updateClientDetails,
    updateClientAddress,
    changeClientPassword,
    requestClientPasswordReset,
    resetClientPassword,
    uploadClientProfileImage,
    setClientAuthToken
};