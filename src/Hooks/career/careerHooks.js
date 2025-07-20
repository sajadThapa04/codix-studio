import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    createCareerApplication,
    getAllCareerApplications,
    updateApplicationStatus,
    deleteCareerApplication,
    setCareerAuthToken
} from '../../Api/career.api';

// Helper to set auth token before requests
const withAuth = (fn) => {
    return async (...args) => {
        const token = localStorage.getItem('authToken');
        if (token) setCareerAuthToken(token);
        return fn(...args);
    };
};

// Career Query Keys
export const careerKeys = {
    all: ['careers'],
    lists: () => [...careerKeys.all, 'list'],
    list: (filters) => [...careerKeys.lists(), { filters }],
    details: () => [...careerKeys.all, 'detail'],
    detail: (id) => [...careerKeys.details(), id],
    myApplications: () => [...careerKeys.all, 'my'],
};

/**
 * Hook for creating a new career application (unauthenticated)
 */
export const useCreateCareerApplication = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ applicationData, file }) =>
            createCareerApplication({ applicationData, file }),
        onSuccess: () => {
            queryClient.invalidateQueries(careerKeys.lists());
        },
        onError: (error) => {
            // Error is already formatted by createCareerApplication
            console.error('Application error:', error.message);
            throw error; // Re-throw to be caught by component
        }
    });
};
/**
 * Hook for fetching all career applications (admin only)
 */
export const useGetAllCareerApplications = (filters = {}) => {
    return useQuery({
        queryKey: careerKeys.list(filters),
        queryFn: () => withAuth(getAllCareerApplications)(filters),
        staleTime: 1000 * 60 * 5, // 5 minutes
        keepPreviousData: true,
        retry: (failureCount, error) => {
            if (error?.response?.status === 401 || error?.response?.status === 403) return false;
            return failureCount < 2;
        }
    });
};

/**
 * Hook for updating application status (admin only)
 */
export const useUpdateApplicationStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ applicationId, statusData }) =>
            withAuth(updateApplicationStatus)(applicationId, statusData),
        onSuccess: (updatedApplication) => {
            queryClient.setQueryData(careerKeys.detail(updatedApplication._id), updatedApplication);
            queryClient.invalidateQueries(careerKeys.lists());
        },
        onError: (error) => {
            console.error('Error updating application status:', error);
            throw error;
        }
    });
};

/**
 * Hook for deleting a career application (admin only)
 */
export const useDeleteCareerApplication = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (applicationId) => withAuth(deleteCareerApplication)(applicationId),
        onSuccess: (data, applicationId) => {
            queryClient.removeQueries(careerKeys.detail(applicationId));
            queryClient.invalidateQueries(careerKeys.lists());
        },
        onError: (error) => {
            console.error('Error deleting application:', error);
            throw error;
        }
    });
};

/**
 * Hook for prefetching a career application
 */
export const usePrefetchCareerApplication = () => {
    const queryClient = useQueryClient();

    return (applicationId) => {
        queryClient.prefetchQuery({
            queryKey: careerKeys.detail(applicationId),
            queryFn: () => withAuth(getAllCareerApplications)({ id: applicationId }),
            staleTime: 1000 * 60 * 10, // 10 minutes
        });
    };
};

// Token management utility
export const useCareerAuth = () => {
    const setToken = (token) => {
        setCareerAuthToken(token);
        if (!token) {
            localStorage.removeItem('authToken');
        } else {
            localStorage.setItem('authToken', token);
        }
    };

    return { setToken };
};