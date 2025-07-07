import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog,
    toggleLike,
    uploadCoverImage,
    getBlogsByAuthor,
    setBlogAuthToken
} from '../../Api/blog.api';

// Helper to set auth token before requests
const withAuth = (fn) => {
    return async (...args) => {
        const token = localStorage.getItem('authToken');
        if (token) setBlogAuthToken(token);
        return fn(...args);
    };
};

// Blog Query Keys
export const blogKeys = {
    all: ['blogs'],
    lists: () => [...blogKeys.all, 'list'],
    list: (filters) => [...blogKeys.lists(), { filters }],
    details: () => [...blogKeys.all, 'detail'],
    detail: (id) => [...blogKeys.details(), id],
    byAuthor: (authorId) => [...blogKeys.all, 'author', authorId],
};

/**
 * Hook for creating a new blog post
 */
export const useCreateBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData) => {
            // Convert FormData to a regular object for easier handling
            const data = {};
            const tags = [];

            // Extract all form data
            formData.forEach((value, key) => {
                if (key === 'tags') {
                    tags.push(value);
                } else {
                    data[key] = value;
                }
            });

            // Explicitly set tags (empty array will clear existing tags)
            data.tags = tags;

            // Extract image data if it exists
            const imageFile = formData.get('coverImage');
            const altText = formData.get('altText') || '';

            // 1. First create the blog (without image)
            const response = await withAuth(createBlog)(data);

            if (!response?.data?._id) {
                throw new Error('Blog creation failed: Invalid server response');
            }

            const blogId = response.data._id;
            console.log('Created blog with ID:', blogId);

            // 2. If there's an image, upload it
            if (imageFile) {
                try {
                    console.log('Uploading cover image...');
                    const uploadResponse = await uploadCoverImage(blogId, imageFile, altText);
                    console.log('Image upload successful:', uploadResponse);

                    // Return the blog data with updated cover image URL
                    return {
                        ...response.data,
                        coverImage: uploadResponse.data.imageUrl,
                        altText: uploadResponse.data.altText || altText
                    };
                } catch (uploadError) {
                    console.error('Image upload failed (blog still created):', uploadError);
                    // Return the blog even if image upload fails
                    return response.data;
                }
            }

            return response.data;
        },
        onSuccess: (newBlog) => {
            queryClient.invalidateQueries(blogKeys.lists());
            queryClient.setQueryData(blogKeys.detail(newBlog._id), newBlog);
        },
        onError: (error) => {
            console.error('Error in blog creation process:', error);
            if (error.response?.status === 409) {
                throw new Error('A blog with similar content already exists');
            }
            throw error;
        }
    });
};
/**
 * Hook for fetching all blogs with filters
 */
export const useGetAllBlogs = (filters = {}) => {
    return useQuery({
        queryKey: blogKeys.list(filters),
        queryFn: () => withAuth(getAllBlogs)(filters),
        staleTime: 1000 * 60 * 5, // 5 minutes
        keepPreviousData: true,
    });
};

/**
 * Hook for fetching a single blog by ID
 */
export const useGetBlogById = (blogId) => {
    return useQuery({
        queryKey: blogKeys.detail(blogId),
        queryFn: async () => {
            const response = await withAuth(getBlogById)(blogId);
            // Add a cache-busting parameter to image URLs
            if (response?.data?.coverImage?.url) {
                response.data.coverImage.url = `${response.data.coverImage.url}?${Date.now()}`;
            }
            return response?.data || response;
        },
        enabled: !!blogId,
        staleTime: 1000 * 60 * 10, // 10 minutes
        retry: (failureCount, error) => {
            if (error?.response?.status === 404) return false;
            return failureCount < 2;
        },
        refetchOnMount: 'always', // Changed from true to 'always'
        refetchOnReconnect: true,
        refetchOnWindowFocus: true
    });
};
/**
 * Hook for updating a blog post
 */
export const useUpdateBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ blogId, formData }) => {
            // Convert FormData to a regular object for easier handling
            const data = {};
            const tags = [];

            // Extract all form data
            formData.forEach((value, key) => {
                if (key === 'tags') {
                    tags.push(value);
                } else {
                    data[key] = value;
                }
            });

            // Explicitly set tags (empty array will clear existing tags)
            data.tags = tags;

            // Extract image data if it exists
            const imageFile = formData.get('coverImage');
            const altText = formData.get('altText') || '';

            // 1. First update the blog data (without image)
            const response = await withAuth(updateBlog)(blogId, data);

            if (!response?.data?._id) {
                throw new Error('Blog update failed: Invalid server response');
            }

            // 2. If there's an image, upload it
            if (imageFile) {
                try {
                    const uploadResponse = await uploadCoverImage(blogId, imageFile, altText);
                    return {
                        ...response.data,
                        coverImage: uploadResponse.data.imageUrl,
                        altText: uploadResponse.data.altText || altText
                    };
                } catch (uploadError) {
                    console.error('Image upload failed:', uploadError);
                    return response.data;
                }
            }

            return response.data;
        },
        onSuccess: (updatedBlog) => {
            queryClient.setQueryData(blogKeys.detail(updatedBlog._id), updatedBlog);
            queryClient.invalidateQueries(blogKeys.lists());
        },
        onError: (error) => {
            console.error('Error updating blog:', error);
            if (error.response?.status === 409) {
                throw new Error('A blog with similar content already exists');
            }
            throw error;
        },
    });
};
/**
 * Hook for deleting a blog post
 */
export const useDeleteBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (blogId) => {
            console.log('Mutation - Deleting blog:', blogId);
            try {
                const result = await withAuth(deleteBlog)(blogId);
                console.log('Mutation - Delete result:', result);
                return {
                    success: true,
                    message: 'Blog deleted successfully',
                    data: result
                };
            } catch (error) {
                console.error('Mutation - Delete error:', error);
                throw error;
            }
        },
        onSuccess: (data, blogId) => {
            console.log('Mutation - Success for:', blogId);
            queryClient.removeQueries(blogKeys.detail(blogId));
            queryClient.invalidateQueries(blogKeys.lists());
        }
    });
};
/**
 * Hook for toggling a blog like
 */
export const useToggleLike = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: withAuth(toggleLike),
        onMutate: async (blogId) => {
            // Cancel any outgoing refetches to avoid overwriting optimistic update
            await queryClient.cancelQueries(blogKeys.detail(blogId));

            // Snapshot the previous value
            const previousBlog = queryClient.getQueryData(blogKeys.detail(blogId));

            // Optimistically update to the new value
            if (previousBlog) {
                queryClient.setQueryData(blogKeys.detail(blogId), {
                    ...previousBlog,
                    likes: previousBlog.likes + 1, // Adjust based on your actual like logic
                });
            }

            return { previousBlog };
        },
        onError: (error, blogId, context) => {
            // Rollback to previous value on error
            if (context?.previousBlog) {
                queryClient.setQueryData(blogKeys.detail(blogId), context.previousBlog);
            }
            console.error('Error toggling like:', error);
        },
        onSettled: (data, error, blogId) => {
            // Always refetch after error or success
            queryClient.invalidateQueries(blogKeys.detail(blogId));
        },
    });
};

/**
 * Hook for uploading a blog cover image
 */


/**
 * Hook for fetching blogs by author
 */
export const useGetBlogsByAuthor = (authorId, filters = {}) => {
    return useQuery({
        queryKey: [...blogKeys.byAuthor(authorId), filters],
        queryFn: () => withAuth(getBlogsByAuthor)(authorId, filters),
        enabled: !!authorId, // Only run if authorId exists
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

/**
 * Hook for prefetching a blog
 */
export const usePrefetchBlog = () => {
    const queryClient = useQueryClient();

    return (blogId) => {
        queryClient.prefetchQuery({
            queryKey: blogKeys.detail(blogId),
            queryFn: () => withAuth(getBlogById)(blogId),
            staleTime: 1000 * 60 * 10, // 10 minutes
        });
    };
};