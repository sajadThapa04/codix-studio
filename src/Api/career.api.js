import axios from "axios";
import conf from "../conf/conf";

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
    maxRequests: 5, // Max requests per window
    windowMs: 60 * 1000 // 1 minute window
};

let requestCount = 0;
let lastRequestTime = Date.now();

export const careerApi = axios.create({
    baseURL: conf.node_env === "production" ? `${conf.base_url}/career` : "/api/v1/career", // Changed from /api/v1/careers to /career
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});
// Add request interceptor for rate limiting
careerApi.interceptors.request.use(async config => {
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

// Career Application Operations
export const createCareerApplication = async ({ applicationData, file }) => {
    try {
        const formData = new FormData();

        // Append all fields from applicationData
        Object.entries(applicationData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                formData.append(key, value);
            }
        });

        // Append the file if it exists
        if (file) {
            formData.append('resume', file);
        }

        const response = await careerApi.post("/", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (error) {
        const apiError = {
            message: error.response?.data?.message,
            status: error.response?.status || 429,
            data: error.response?.data || null
        };
        throw apiError;
    }
};
export const getAllCareerApplications = async (queryParams = {}) => {
    try {
        const response = await careerApi.get("/", { params: queryParams });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateApplicationStatus = async (applicationId, statusData) => {
    try {
        const response = await careerApi.patch(`/${applicationId}/status`, statusData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteCareerApplication = async (applicationId) => {
    try {
        const response = await careerApi.delete(`/${applicationId}`);
        return {
            success: response.data?.success || true,
            message: response.data?.message || 'Application deleted successfully',
            data: response.data?.data || null
        };
    } catch (error) {
        throw error.response?.data || error;
    }
};


// Helper function to set auth token
export const setCareerAuthToken = (token) => {
    if (token) {
        careerApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete careerApi.defaults.headers.common["Authorization"];
    }
};

// Helper function to handle errors
const handleCareerApiError = (error) => {
    if (error.response) {
        console.error("Career API Error:", error.response.data);
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
    } else if (error.request) {
        console.error("Career API Error: No response received", error.request);
    } else {
        console.error("Career API Error:", error.message);
    }
    return Promise.reject(error);
};

// Add response interceptor for error handling
careerApi.interceptors.response.use(
    response => response,
    error => handleCareerApiError(error)
);

export default {
    createCareerApplication,
    getAllCareerApplications,
    updateApplicationStatus,
    deleteCareerApplication,
    setCareerAuthToken
};