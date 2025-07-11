import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
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
} from '../../Api/clientServiceRequest.api';

// Enhanced helper to set auth token and handle rate limiting
// Helper to set auth token before requests
const withAuth = (fn) => {
    return async (...args) => {
        const token = localStorage.getItem('authToken');
        if (token) setServiceRequestAuthToken(token);
        return fn(...args);
    };
};

// Service Request Query Keys
export const serviceRequestKeys = {
    all: ['serviceRequests'],
    lists: () => [...serviceRequestKeys.all, 'list'],
    list: (filters) => [...serviceRequestKeys.lists(), { filters }],
    details: () => [...serviceRequestKeys.all, 'detail'],
    detail: (id) => [...serviceRequestKeys.details(), id],
    clientRequests: () => [...serviceRequestKeys.all, 'client'],
    adminAll: () => [...serviceRequestKeys.all, 'admin'],
};

/**
 * Hook for creating a new service request with enhanced error handling
 */
export const useCreateServiceRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (requestData) => withAuth(createServiceRequest)(requestData),
        onSuccess: (data) => {
            queryClient.invalidateQueries(serviceRequestKeys.clientRequests());
            queryClient.setQueryData(
                serviceRequestKeys.detail(data._id),
                data
            );
            return data;
        },
        onError: (error) => {
            console.error('Error creating service request:', error);
            if (error?.response?.status === 429) {
                throw new Error('Too many requests. Please wait a moment and try again.');
            }
            throw new Error(error.message || 'Failed to create service request');
        }
    });
};

/**
 * Enhanced hook for fetching client's service requests
 */
export const useGetClientServiceRequests = (filters = {}) => {
    return useQuery({
        queryKey: serviceRequestKeys.list(filters),
        queryFn: () => withAuth(getClientServiceRequests)(filters),
        staleTime: 1000 * 60 * 5, // 5 minutes
        keepPreviousData: true,
        retry: (failureCount, error) => {
            if (error?.response?.status === 401 || error?.response?.status === 404) return false;
            return failureCount < 3;
        },
        onError: (error) => {
            console.error('Error fetching service requests:', error);
        }
    });
};

/**
 * Enhanced hook for fetching a single service request by ID
 */
export const useGetServiceRequestById = (requestId) => {
    return useQuery({
        queryKey: serviceRequestKeys.detail(requestId),
        queryFn: async () => {
            const response = await withAuth(getServiceRequestById)(requestId);
            return response?.data || response;
        },
        enabled: !!requestId,
        staleTime: 1000 * 60 * 10, // 10 minutes
        retry: (failureCount, error) => {
            if (error?.response?.status === 404) return false;
            return failureCount < 3;
        },
        refetchOnWindowFocus: false, // Adjust based on your needs
        onError: (error) => {
            console.error(`Error fetching service request ${requestId}:`, error);
        }
    });
};

/**
 * Enhanced hook for updating a service request
 */
export const useUpdateServiceRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ requestId, updateData }) =>
            withAuth(updateServiceRequest)(requestId, updateData),
        onMutate: async ({ requestId, updateData }) => {
            await queryClient.cancelQueries(serviceRequestKeys.detail(requestId));

            const previousRequest = queryClient.getQueryData(
                serviceRequestKeys.detail(requestId)
            );

            queryClient.setQueryData(
                serviceRequestKeys.detail(requestId),
                (old) => ({ ...old, ...updateData })
            );

            return { previousRequest };
        },
        onSuccess: (updatedRequest) => {
            queryClient.setQueryData(
                serviceRequestKeys.detail(updatedRequest._id),
                updatedRequest
            );
            queryClient.invalidateQueries(serviceRequestKeys.lists());
        },
        onError: (error, variables, context) => {
            console.error('Error updating service request:', error);
            if (context?.previousRequest) {
                queryClient.setQueryData(
                    serviceRequestKeys.detail(variables.requestId),
                    context.previousRequest
                );
            }
            throw new Error(error.message || 'Failed to update service request');
        },
    });
};

/**
 * Enhanced hook for deleting a service request
 */
export const useDeleteServiceRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (requestId) => withAuth(deleteServiceRequest)(requestId),
        onMutate: async (requestId) => {
            await queryClient.cancelQueries(serviceRequestKeys.detail(requestId));
            const previousRequest = queryClient.getQueryData(
                serviceRequestKeys.detail(requestId)
            );
            queryClient.removeQueries(serviceRequestKeys.detail(requestId));
            return { previousRequest };
        },
        onSuccess: () => {
            queryClient.invalidateQueries(serviceRequestKeys.lists());
        },
        onError: (error, requestId, context) => {
            console.error('Error deleting service request:', error);
            if (context?.previousRequest) {
                queryClient.setQueryData(
                    serviceRequestKeys.detail(requestId),
                    context.previousRequest
                );
            }
            throw new Error(error.message || 'Failed to delete service request');
        }
    });
};

/**
 * Enhanced hook for uploading attachments with progress tracking
 */
export const useUploadServiceRequestAttachments = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ requestId, files, onUploadProgress }) => {
            const config = onUploadProgress ? { onUploadProgress } : {};
            return withAuth(uploadServiceRequestAttachments)(requestId, files, config);
        },
        onSuccess: (data, { requestId }) => {
            queryClient.invalidateQueries(serviceRequestKeys.detail(requestId));
        },
        onError: (error) => {
            console.error('Error uploading attachments:', error);
            throw new Error(error.message || 'Failed to upload attachments');
        }
    });
};

/**
 * Enhanced hook for deleting an attachment
 */
export const useDeleteServiceRequestAttachment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ requestId, publicId }) =>
            withAuth(deleteServiceRequestAttachment)(requestId, publicId),
        onSuccess: (data, { requestId }) => {
            queryClient.invalidateQueries(serviceRequestKeys.detail(requestId));
        },
        onError: (error) => {
            console.error('Error deleting attachment:', error);
            throw new Error(error.message || 'Failed to delete attachment');
        }
    });
};

/**
 * Enhanced admin hook for fetching all service requests
 */
export const useGetAllServiceRequests = (filters = {}) => {
    return useQuery({
        queryKey: [...serviceRequestKeys.adminAll(), filters],
        queryFn: () => withAuth(getAllServiceRequests)(filters),
        staleTime: 1000 * 60 * 5, // 5 minutes
        keepPreviousData: true,
        retry: (failureCount, error) => {
            if (error?.response?.status === 403) return false;
            return failureCount < 3;
        },
        onError: (error) => {
            console.error('Error fetching all service requests:', error);
        }
    });
};

/**
 * Enhanced admin hook for updating service request status
 */
export const useUpdateServiceRequestStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ requestId, statusData }) =>
            withAuth(updateServiceRequestStatus)(requestId, statusData),
        onMutate: async ({ requestId, statusData }) => {
            await queryClient.cancelQueries(serviceRequestKeys.detail(requestId));

            const previousRequest = queryClient.getQueryData(
                serviceRequestKeys.detail(requestId)
            );

            queryClient.setQueryData(
                serviceRequestKeys.detail(requestId),
                (old) => ({ ...old, status: statusData.status })
            );

            return { previousRequest };
        },
        onSuccess: (updatedRequest) => {
            queryClient.setQueryData(
                serviceRequestKeys.detail(updatedRequest._id),
                updatedRequest
            );
            queryClient.invalidateQueries(serviceRequestKeys.adminAll());
        },
        onError: (error, variables, context) => {
            console.error('Error updating status:', error);
            if (context?.previousRequest) {
                queryClient.setQueryData(
                    serviceRequestKeys.detail(variables.requestId),
                    context.previousRequest
                );
            }
            throw new Error(error.message || 'Failed to update status');
        }
    });
};

/**
 * Optimized prefetch hook
 */
export const usePrefetchServiceRequest = () => {
    const queryClient = useQueryClient();

    return (requestId) => {
        if (!requestId) return;

        queryClient.prefetchQuery({
            queryKey: serviceRequestKeys.detail(requestId),
            queryFn: () => withAuth(getServiceRequestById)(requestId),
            staleTime: 1000 * 60 * 10, // 10 minutes
        });
    };
};

/**
 * Optimistic update hook with rollback
 */
export const useOptimisticUpdateServiceRequest = () => {
    const queryClient = useQueryClient();

    return async ({ requestId, updateData }) => {
        await queryClient.cancelQueries(serviceRequestKeys.detail(requestId));

        const previousRequest = queryClient.getQueryData(
            serviceRequestKeys.detail(requestId)
        );

        queryClient.setQueryData(
            serviceRequestKeys.detail(requestId),
            (old) => ({ ...old, ...updateData })
        );

        return { previousRequest };
    };
};