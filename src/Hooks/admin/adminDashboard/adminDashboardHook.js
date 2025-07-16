// hooks/adminApiHooks.js
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    fetchAllClients,
    fetchClientById,
    updateClientDetails,
    removeClient,
    fetchAllBlogs,
    fetchBlogById,
    removeBlog,
    updateBlogStatus,
    toggleBlogFeatured,
} from "../../../Api/adminDashboard.api";

// Query keys for consistent cache management
const queryKeys = {
    clients: {
        all: ['admin', 'clients'],
        details: (id) => [...queryKeys.clients.all, id],
    },
    blogs: {
        all: ['admin', 'blogs'],
        details: (id) => [...queryKeys.blogs.all, id],
        featured: ['admin', 'blogs', 'featured'],
    },
};

// Client Management Hooks

/**
 * Fetches all clients
 */
export const useAdminClients = () => {
    return useQuery({
        queryKey: queryKeys.clients.all,
        queryFn: fetchAllClients,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

/**
 * Fetches a single client by ID
 */
export const useAdminClient = (id) => {
    return useQuery({
        queryKey: queryKeys.clients.details(id),
        queryFn: () => fetchClientById(id),
        enabled: !!id, // Only run if ID exists
    });
};

/**
 * Updates client details
 */
export const useUpdateClient = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ clientId, updateData }) => {
            if (!clientId) {
                throw new Error('Client ID is required');
            }
            return await updateClientDetails(clientId, updateData);
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['adminClients']);
            queryClient.setQueryData(
                ['adminClients', variables.clientId],
                data
            );
        },
        onError: (error) => {
            console.error('Update client error:', error);
            throw error;
        }
    });
};
/**
 * Deletes a client
 */
export const useDeleteClient = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => removeClient(id),
        onSuccess: (_, id) => {
            // Remove the client from cache and invalidate list
            queryClient.removeQueries({ queryKey: queryKeys.clients.details(id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
        },
    });
};

// Blog Management Hooks

/**
 * Fetches all blogs
 */
export const useAdminBlogs = () => {
    return useQuery({
        queryKey: queryKeys.blogs.all,
        queryFn: fetchAllBlogs,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

/**
 * Fetches a single blog by ID
 */
export const useAdminBlog = (id) => {
    return useQuery({
        queryKey: queryKeys.blogs.details(id),
        queryFn: () => fetchBlogById(id),
        enabled: !!id, // Only run if ID exists
    });
};

/**
 * Deletes a blog
 */
export const useDeleteBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => removeBlog(id),
        onSuccess: (_, id) => {
            // Remove the blog from cache and invalidate lists
            queryClient.removeQueries({ queryKey: queryKeys.blogs.details(id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.blogs.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.blogs.featured });
        },
    });
};

/**
 * Updates blog status
 */
export const useUpdateBlogStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }) => updateBlogStatus(id, status),
        onSuccess: (data, variables) => {
            // Invalidate the blog list and specific blog
            queryClient.invalidateQueries({ queryKey: queryKeys.blogs.all });
            queryClient.invalidateQueries({
                queryKey: queryKeys.blogs.details(variables.id)
            });
        },
    });
};

/**
 * Toggles blog featured status
 */
export const useToggleBlogFeatured = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => toggleBlogFeatured(id),
        onSuccess: (data, id) => {
            // Invalidate both the specific blog and featured list
            queryClient.invalidateQueries({ queryKey: queryKeys.blogs.details(id) });
            queryClient.invalidateQueries({ queryKey: queryKeys.blogs.featured });
        },
    });
};