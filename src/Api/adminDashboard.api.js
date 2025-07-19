import axios from "axios";
import conf from "../conf/conf";

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
    maxRequests: 5, // Max requests per window
    windowMs: 60 * 1000 // 1 minute window
};

let requestCount = 0;
let lastRequestTime = Date.now();


const baseAdminURL = conf?.base_url
    ? `${conf.base_url}/api/v1/adminDashboard`
    : `/api/v1/admadminDashboardin`;

export const adminDashboardApi = axios.create({
    baseURL: baseAdminURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Response interceptor to handle token refresh
adminDashboardApi.interceptors.request.use(async config => {
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


// Client Management
export const fetchAllClients = async () => {
    try {
        const response = await adminDashboardApi.get("/clients");
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const fetchClientById = async (id) => {
    try {
        const response = await adminDashboardApi.get(`/clients/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateClientDetails = async (clientId, updateData) => {
    try {
        console.log('Updating client with ID:', clientId); // Debug log
        console.log('Update data:', updateData); // Debug log

        const response = await adminDashboardApi.patch(
            `/clients/${clientId}`,
            updateData,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating client:', error);
        throw error.response?.data || error;
    }
};

export const removeClient = async (id) => {
    try {
        const response = await adminDashboardApi.delete(`/clients/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Blog Management
export const fetchAllBlogs = async () => {
    try {
        const response = await adminDashboardApi.get("/blogs");
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const fetchBlogById = async (id) => {
    try {
        const response = await adminDashboardApi.get(`/blogs/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const removeBlog = async (id) => {
    try {
        const response = await adminDashboardApi.delete(`/blogs/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const updateBlogStatus = async (id, status) => {
    try {
        const response = await adminDashboardApi.patch(`/blogs/${id}/status`, { status });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const toggleBlogFeatured = async (id) => {
    try {
        const response = await adminDashboardApi.patch(`/blogs/${id}/toggle`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Utility function to set headers if needed elsewhere
export const setAdminDashboardAuthHeader = (token) => {
    if (token) {
        adminDashboardApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete adminDashboardApi.defaults.headers.common["Authorization"];
    }
};