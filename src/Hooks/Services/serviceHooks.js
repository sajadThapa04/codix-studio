import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService,
    toggleServiceStatus,
    uploadThumbnail,
    updateThumbnail,
    getActiveServices,
    getActiveServiceById,
    setServicesAuthToken
} from '../../Api/services.api';

// Helper to set auth token before requests
const withAuth = (fn) => {
    return async (...args) => {
        const token = localStorage.getItem('authToken');
        if (token) setServicesAuthToken(token);
        return fn(...args);
    };
};

// Service Query Keys
export const serviceKeys = {
    all: ['services'],
    lists: () => [...serviceKeys.all, 'list'],
    list: (filters) => [...serviceKeys.lists(), { filters }],
    details: () => [...serviceKeys.all, 'detail'],
    detail: (id) => [...serviceKeys.details(), id],
};

/**
 * Hook for creating a new service
 */
export const useCreateService = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (formData) => {
            // Convert FormData to a regular object if needed
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // 1. First create the service (without thumbnail)
            const response = await withAuth(createService)(data);

            if (!response?.data?._id) {
                throw new Error('Service creation failed: Invalid server response');
            }

            const serviceId = response.data._id;

            // 2. If there's a thumbnail, upload it
            const thumbnailFile = formData.get('thumbnail');
            if (thumbnailFile) {
                try {
                    const uploadResponse = await uploadThumbnail(serviceId, thumbnailFile);
                    return {
                        ...response.data,
                        thumbnail: uploadResponse.data.imageUrl
                    };
                } catch (uploadError) {
                    console.error('Thumbnail upload failed (service still created):', uploadError);
                    return response.data;
                }
            }

            return response.data;
        },
        onSuccess: (newService) => {
            queryClient.invalidateQueries(serviceKeys.lists());
            queryClient.setQueryData(serviceKeys.detail(newService._id), newService);
        },
        onError: (error) => {
            console.error('Error in service creation process:', error);
            if (error.response?.status === 409) {
                throw new Error('A service with similar details already exists');
            }
            throw error;
        }
    });
};

/**
 * Hook for fetching all services with filters
 */
export const useGetAllServices = (filters = {}) => {
    return useQuery({
        queryKey: serviceKeys.list(filters),
        queryFn: () => withAuth(getAllServices)(filters),
        staleTime: 1000 * 60 * 5, // 5 minutes
        keepPreviousData: true,
    });
};

/**
 * Hook for fetching a single service by ID
 */
export const useGetServiceById = (serviceId) => {
    return useQuery({
        queryKey: serviceKeys.detail(serviceId),
        queryFn: async () => {
            const response = await withAuth(getServiceById)(serviceId);
            // Add a cache-busting parameter to thumbnail URLs
            if (response?.data?.thumbnail) {
                response.data.thumbnail = `${response.data.thumbnail}?${Date.now()}`;
            }
            return response?.data || response;
        },
        enabled: !!serviceId,
        staleTime: 1000 * 60 * 10, // 10 minutes
        retry: (failureCount, error) => {
            if (error?.response?.status === 404) return false;
            return failureCount < 2;
        },
        refetchOnMount: 'always',
        refetchOnReconnect: true,
        refetchOnWindowFocus: true
    });
};

/**
 * Hook for updating a service
 */
export const useUpdateService = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ serviceId, formData }) => {
            // Convert FormData to a regular object if needed
            const data = {};
            formData.forEach((value, key) => {
                if (key !== 'thumbnail') {
                    data[key] = value;
                }
            });

            // 1. First update the service data (without thumbnail)
            const response = await withAuth(updateService)(serviceId, data);

            if (!response?.data?._id) {
                throw new Error('Service update failed: Invalid server response');
            }

            // 2. If there's a thumbnail, upload it
            const thumbnailFile = formData.get('thumbnail');
            if (thumbnailFile) {
                try {
                    const uploadResponse = await updateThumbnail(serviceId, thumbnailFile);
                    return {
                        ...response.data,
                        thumbnail: uploadResponse.data.imageUrl
                    };
                } catch (uploadError) {
                    console.error('Thumbnail upload failed:', uploadError);
                    return response.data;
                }
            }

            return response.data;
        },
        onSuccess: (updatedService) => {
            queryClient.setQueryData(serviceKeys.detail(updatedService._id), updatedService);
            queryClient.invalidateQueries(serviceKeys.lists());
        },
        onError: (error) => {
            console.error('Error updating service:', error);
            if (error.response?.status === 409) {
                throw new Error('A service with similar details already exists');
            }
            throw error;
        },
    });
};

/**
 * Hook for deleting a service
 */
export const useDeleteService = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (serviceId) => {
            const result = await withAuth(deleteService)(serviceId);
            return {
                success: true,
                message: 'Service deleted successfully',
                data: result
            };
        },
        onSuccess: (data, serviceId) => {
            queryClient.removeQueries(serviceKeys.detail(serviceId));
            queryClient.invalidateQueries(serviceKeys.lists());
        },
        onError: (error) => {
            console.error('Error deleting service:', error);
            throw error;
        }
    });
};

/**
 * Hook for toggling service status
 */
export const useToggleServiceStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: withAuth(toggleServiceStatus),
        onMutate: async (serviceId) => {
            await queryClient.cancelQueries(serviceKeys.detail(serviceId));

            const previousService = queryClient.getQueryData(serviceKeys.detail(serviceId));

            if (previousService) {
                queryClient.setQueryData(serviceKeys.detail(serviceId), {
                    ...previousService,
                    isActive: !previousService.isActive
                });
            }

            return { previousService };
        },
        onError: (error, serviceId, context) => {
            if (context?.previousService) {
                queryClient.setQueryData(serviceKeys.detail(serviceId), context.previousService);
            }
            console.error('Error toggling service status:', error);
        },
        onSettled: (data, error, serviceId) => {
            queryClient.invalidateQueries(serviceKeys.detail(serviceId));
        },
    });
};

/**
 * Hook for uploading/updating service thumbnail
 */
export const useUploadThumbnail = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ serviceId, imageFile }) => {
            const response = await withAuth(uploadThumbnail)(serviceId, imageFile);
            return response.data;
        },
        onSuccess: (data, { serviceId }) => {
            queryClient.setQueryData(serviceKeys.detail(serviceId), old => ({
                ...old,
                thumbnail: data.imageUrl
            }));
        },
        onError: (error) => {
            console.error('Error uploading thumbnail:', error);
            throw error;
        }
    });
};

/**
 * Hook for prefetching a service
 */
export const usePrefetchService = () => {
    const queryClient = useQueryClient();

    return (serviceId) => {
        queryClient.prefetchQuery({
            queryKey: serviceKeys.detail(serviceId),
            queryFn: () => withAuth(getServiceById)(serviceId),
            staleTime: 1000 * 60 * 10, // 10 minutes
        });
    };
};


// In your serviceHooks.js
export const useGetActiveServices = (filters = {}) => {
    return useQuery({
        queryKey: ['public-services', 'list', { filters }],
        queryFn: async () => {
            const response = await getActiveServices(filters);
            // Ensure we return the data in the expected format
            return {
                services: response?.data?.services || [],
                pagination: {
                    total: response?.data?.total || 0,
                    page: response?.data?.page || 1,
                    pages: response?.data?.pages || 1,
                    limit: response?.data?.limit || 9,
                    skip: ((response?.data?.page || 1) - 1) * (response?.data?.limit || 9)
                }
            };
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        keepPreviousData: true,
    });
};
/**
 * Hook for fetching a single active service by ID (public)
 */
export const useGetActiveServiceById = (serviceId) => {
    return useQuery({
        queryKey: ['public-services', 'detail', serviceId],
        queryFn: async () => {
            const response = await getActiveServiceById(serviceId);
            // Add a cache-busting parameter to thumbnail URLs
            if (response?.data?.thumbnail) {
                response.data.thumbnail = `${response.data.thumbnail}?${Date.now()}`;
            }
            return response?.data || response;
        },
        enabled: !!serviceId,
        staleTime: 1000 * 60 * 10, // 10 minutes
        retry: (failureCount, error) => {
            if (error?.response?.status === 404) return false;
            return failureCount < 2;
        },
        refetchOnMount: 'always',
        refetchOnReconnect: true,
        refetchOnWindowFocus: true
    });
};