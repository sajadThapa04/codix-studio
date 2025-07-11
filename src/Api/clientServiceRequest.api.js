import axios from "axios";

// Create axios instance with base configuration
const serviceRequestApi = axios.create({
    baseURL: "/api/v1/clientService",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
    maxRequests: 5,
    windowMs: 60 * 1000 // 1 minute
};

let requestCount = 0;
let lastRequestTime = Date.now();

// Request interceptor for rate limiting
serviceRequestApi.interceptors.request.use(async (config) => {
    const now = Date.now();
    const elapsed = now - lastRequestTime;

    // Reset counter if window has passed
    if (elapsed > RATE_LIMIT_CONFIG.windowMs) {
        requestCount = 0;
        lastRequestTime = now;
    }

    // If rate limit exceeded, delay the request
    if (requestCount >= RATE_LIMIT_CONFIG.maxRequests) {
        const delay = RATE_LIMIT_CONFIG.windowMs - elapsed;
        await new Promise(resolve => setTimeout(resolve, delay));
        requestCount = 0;
        lastRequestTime = Date.now();
    }

    requestCount++;
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response interceptor for error handling
serviceRequestApi.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            console.error("API Error:", {
                status: error.response.status,
                data: error.response.data,
                headers: error.response.headers
            });
        } else if (error.request) {
            console.error("No response received:", error.request);
        } else {
            console.error("Request setup error:", error.message);
        }
        return Promise.reject(error.response?.data || error);
    }
);

// Helper to set auth token
export const setServiceRequestAuthToken = (token) => {
    if (token) {
        serviceRequestApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete serviceRequestApi.defaults.headers.common["Authorization"];
    }
};

// Service Request CRUD Operations
export const createServiceRequest = (requestData) =>
    serviceRequestApi.post("/", requestData).then(response => response.data);

export const getClientServiceRequests = (queryParams = {}) =>
    serviceRequestApi.get("/", { params: queryParams }).then(response => response.data);

export const getServiceRequestById = (requestId) =>
    serviceRequestApi.get(`/${requestId}`).then(response => response.data);

export const updateServiceRequest = (requestId, updateData) =>
    serviceRequestApi.patch(`/${requestId}`, updateData).then(response => response.data);

export const deleteServiceRequest = (requestId) =>
    serviceRequestApi.delete(`/${requestId}`).then(response => response.data);

// Attachment Management
export const uploadServiceRequestAttachments = (requestId, files) => {
    const formData = new FormData();
    files.forEach(file => {
        formData.append("attachments", file);
    });

    return serviceRequestApi.post(
        `/${requestId}/attachments`,
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    ).then(response => response.data);
};

export const deleteServiceRequestAttachment = (requestId, publicId) =>
    serviceRequestApi.delete(`/${requestId}/attachments/${publicId}`).then(response => response.data);

// Admin Operations
export const getAllServiceRequests = (queryParams = {}) =>
    serviceRequestApi.get("/admin/all", { params: queryParams }).then(response => response.data);

export const updateServiceRequestStatus = (requestId, statusData) =>
    serviceRequestApi.patch(`/admin/${requestId}/status`, statusData).then(response => response.data);

export default {
    createServiceRequest,
    getClientServiceRequests,
    getServiceRequestById,
    updateServiceRequest,
    deleteServiceRequest,
    uploadServiceRequestAttachments,
    deleteServiceRequestAttachment,
    getAllServiceRequests,
    updateServiceRequestStatus,
    setServiceRequestAuthToken
};