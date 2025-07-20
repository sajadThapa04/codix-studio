import axios from "axios";
import conf from "../conf/conf";
// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
    maxRequests: 5, // Max requests per window
    windowMs: 60 * 1000 // 1 minute window
};

let requestCount = 0;
let lastRequestTime = Date.now();

export const contactApi = axios.create({
    baseURL: conf.node_env === "production" ? `${conf.base_url}/api/v1/contact` : "/api/v1/contact",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

// Add request interceptor for rate limiting
contactApi.interceptors.request.use(async config => {
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

// Contact CRUD Operations
export const createContact = async (contactData) => {
    try {
        const response = await contactApi.post("/", contactData);
        return response.data;
    } catch (error) {
        // Structure the error response consistently
        const apiError = {
            message: error.response?.data?.message ||
                'You\'ve reached the maximum number of contact requests (3) allowed within 24 hours. Please try again later.',
            status: error.response?.status || 429,
            data: error.response?.data || null
        };
        throw apiError;
    }
};

export const createAuthenticatedContact = async (contactData) => {
    try {
        const response = await contactApi.post("/auth", contactData);
        return response.data;
    } catch (error) {
        const apiError = {
            message: error.response?.data?.message ||
                'You\'ve reached the maximum number of contact requests (3) allowed within 24 hours. Please try again later.',
            status: error.response?.status || 429,
            data: error.response?.data || null
        };
        throw apiError;
    }
};

export const getAllContacts = async (queryParams = {}) => {
    try {
        const response = await contactApi.get("/", { params: queryParams });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getContactById = async (contactId) => {
    try {
        const response = await contactApi.get(`/${contactId}`);
        return {
            statusCode: response.status,
            data: response.data.data,
            message: response.data.message,
            success: response.data.success
        };
    } catch (error) {
        console.error("API Error:", error);
        throw error.response?.data || error;
    }
};

export const updateContact = async (contactId, updateData) => {
    try {
        const response = await contactApi.patch(`/${contactId}`, updateData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteContact = async (contactId) => {
    console.log('Attempting to delete contact with ID:', contactId);
    try {
        const response = await contactApi.delete(`/${contactId}`);
        return {
            success: response.data?.success || true,
            message: response.data?.message || 'Contact deleted successfully',
            data: response.data?.data || null
        };
    } catch (error) {
        console.error('Delete API error:', error);
        throw new Error(error.response?.data?.message || 'Failed to delete contact');
    }
};

// Client-specific operations
export const getMyContacts = async (queryParams = {}) => {
    try {
        const response = await contactApi.get("/client/me", { params: queryParams });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Helper function to set auth token
export const setContactAuthToken = (token) => {
    if (token) {
        contactApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete contactApi.defaults.headers.common["Authorization"];
    }
};

// Helper function to handle errors
const handleContactApiError = (error) => {
    if (error.response) {
        console.error("Contact API Error:", error.response.data);
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
    } else if (error.request) {
        console.error("Contact API Error: No response received", error.request);
    } else {
        console.error("Contact API Error:", error.message);
    }
    return Promise.reject(error);
};

// Add response interceptor for error handling
contactApi.interceptors.response.use(
    response => response,
    error => handleContactApiError(error)
);

export default {
    createContact,
    createAuthenticatedContact,
    getAllContacts,
    getContactById,
    updateContact,
    deleteContact,
    getMyContacts,
    setContactAuthToken
};