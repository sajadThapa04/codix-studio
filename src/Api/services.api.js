import axios from "axios";

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
    maxRequests: 5, // Max requests per window
    windowMs: 60 * 1000 // 1 minute window
};

let requestCount = 0;
let lastRequestTime = Date.now();

export const servicesApi = axios.create({
    baseURL: "/api/v1/services",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

// Add request interceptor for rate limiting
servicesApi.interceptors.request.use(async config => {
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

// Service CRUD Operations
export const createService = async (serviceData) => {
    try {
        const response = await servicesApi.post("/", serviceData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getAllServices = async (queryParams = {}) => {
    try {
        const response = await servicesApi.get("/", { params: queryParams });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getServiceById = async (serviceId) => {
    try {
        const response = await servicesApi.get(`/${serviceId}`);

        // Ensure consistent response structure
        return {
            statusCode: response.status,
            data: response.data.data, // Extract the nested data
            message: response.data.message,
            success: response.data.success
        };
    } catch (error) {
        console.error("API Error:", error);
        throw error.response?.data || error;
    }
};

export const updateService = async (serviceId, updateData) => {
    try {
        const response = await servicesApi.patch(`/${serviceId}`, updateData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const deleteService = async (serviceId) => {
    console.log('Attempting to delete service with ID:', serviceId);
    try {
        const response = await servicesApi.delete(`/${serviceId}`);
        console.log('Delete response:', response);

        // Ensure consistent response structure
        return {
            success: response.data?.success || true,
            message: response.data?.message || 'Service deleted successfully',
            data: response.data?.data || null
        };
    } catch (error) {
        console.error('Delete API error:', error);
        throw new Error(error.response?.data?.message || 'Failed to delete service');
    }
};

// Service Status Operations
export const toggleServiceStatus = async (serviceId) => {
    try {
        const response = await servicesApi.patch(`/${serviceId}/toggle-status`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Thumbnail Operations
export const uploadThumbnail = async (serviceId, imageFile) => {
    try {
        const formData = new FormData();
        formData.append("thumbnail", imageFile);

        const response = await servicesApi.post(`/${serviceId}/thumbnail`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateThumbnail = async (serviceId, imageFile) => {
    // Uses the same endpoint as upload since it replaces the existing thumbnail
    return uploadThumbnail(serviceId, imageFile);
};

// Helper function to set auth token
export const setServicesAuthToken = (token) => {
    if (token) {
        servicesApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete servicesApi.defaults.headers.common["Authorization"];
    }
};

// Helper function to handle errors
const handleServicesApiError = (error) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        console.error("Services API Error:", error.response.data);
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
    } else if (error.request) {
        // The request was made but no response was received
        console.error("Services API Error: No response received", error.request);
    } else {
        // Something happened in setting up the request
        console.error("Services API Error:", error.message);
    }
    return Promise.reject(error);
};

// Add response interceptor for error handling
servicesApi.interceptors.response.use(
    response => response,
    error => handleServicesApiError(error)
);

export default {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService,
    toggleServiceStatus,
    uploadThumbnail,
    updateThumbnail,
    setServicesAuthToken
};