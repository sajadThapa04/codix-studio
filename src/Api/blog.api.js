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
    ? `${conf.base_url}/api/v1/blog`
    : `/api/v1/blog`;

export const blogApi = axios.create({
    baseURL: baseAdminURL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

// Add request interceptor for rate limiting
blogApi.interceptors.request.use(async config => {
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

// Blog CRUD Operations
export const createBlog = async (blogData) => {
    try {
        const response = await blogApi.post("/", blogData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getAllBlogs = async (queryParams = {}) => {
    try {
        const response = await blogApi.get("/", { params: queryParams });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

export const getBlogById = async (blogId) => {
    try {
        const response = await blogApi.get(`/${blogId}`);
        console.log("API Response Data:", response.data);

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

export const updateBlog = async (blogId, updateData) => {
    try {
        const response = await blogApi.patch(`/${blogId}`, updateData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};
export const deleteBlog = async (blogId) => {
    console.log('Attempting to delete blog with ID:', blogId);
    try {
        const response = await blogApi.delete(`/${blogId}`);
        console.log('Delete response:', response);

        // Ensure consistent response structure
        return {
            success: response.data?.success || true,
            message: response.data?.message || 'Blog deleted successfully',
            data: response.data?.data || null
        };
    } catch (error) {
        console.error('Delete API error:', error);
        throw new Error(error.response?.data?.message || 'Failed to delete blog');
    }
};

// Blog Interactions
export const toggleLike = async (blogId) => {
    try {
        const response = await blogApi.post(`/${blogId}/like`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Blog Media Operations
export const uploadCoverImage = async (blogId, imageFile, altText = "") => {
    try {
        const formData = new FormData();
        formData.append("coverImage", imageFile);
        if (altText) formData.append("altText", altText);

        const response = await blogApi.patch(`/${blogId}/cover-image`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Blog Query Operations
export const getBlogsByAuthor = async (authorId, queryParams = {}) => {
    try {
        const response = await blogApi.get(`/author/${authorId}`, { params: queryParams });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

// Helper function to set auth token
export const setBlogAuthToken = (token) => {
    if (token) {
        blogApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete blogApi.defaults.headers.common["Authorization"];
    }
};

// Helper function to handle errors
const handleBlogApiError = (error) => {
    if (error.response) {
        // The request was made and the server responded with a status code
        console.error("Blog API Error:", error.response.data);
        console.error("Status:", error.response.status);
        console.error("Headers:", error.response.headers);
    } else if (error.request) {
        // The request was made but no response was received
        console.error("Blog API Error: No response received", error.request);
    } else {
        // Something happened in setting up the request
        console.error("Blog API Error:", error.message);
    }
    return Promise.reject(error);
};

// Add response interceptor for error handling
blogApi.interceptors.response.use(
    response => response,
    error => handleBlogApiError(error)
);

export default {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    toggleLike,
    uploadCoverImage,
    getBlogsByAuthor,
    setBlogAuthToken
};