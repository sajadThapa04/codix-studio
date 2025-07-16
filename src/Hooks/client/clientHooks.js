import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getCurrentClient,
    updateClientDetails,
    updateClientAddress,
    changeClientPassword,
    setClientAuthToken
} from '../../Api/client.api';

// Helper to set auth token before requests
const withAuth = (fn) => {
    return async (...args) => {
        const token = localStorage.getItem('authToken');
        if (token) setClientAuthToken(token);
        return fn(...args);
    };
};

// Client Query Keys
export const clientKeys = {
    all: ['client'],
    current: () => [...clientKeys.all, 'current'],
    details: () => [...clientKeys.all, 'details'],
    address: () => [...clientKeys.all, 'address']
};

/**
 * Hook for fetching current client data
 */
export const useGetCurrentClient = () => {
    return useQuery({
        queryKey: clientKeys.current(),
        queryFn: () => withAuth(getCurrentClient)(),
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: (failureCount, error) => {
            if (error?.response?.status === 401) return false;
            return failureCount < 3;
        },
        refetchOnWindowFocus: false
    });
};

/**
 * Hook for updating client details
 */
export const useUpdateClientDetails = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (clientData) => withAuth(updateClientDetails)(clientData),
        onSuccess: (updatedClient) => {
            // Update both current client and client details cache
            queryClient.setQueryData(clientKeys.current(), updatedClient);
            queryClient.setQueryData(clientKeys.details(), updatedClient);
        },
        onError: (error) => {
            console.error('Error updating client details:', error);
            if (error.response?.status === 409) {
                throw new Error('Email or phone number already in use');
            }
            throw error;
        }
    });
};

/**
 * Hook for updating client address
 */
export const useUpdateClientAddress = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (addressData) => withAuth(updateClientAddress)(addressData),
        onSuccess: (updatedClient) => {
            // Update current client data with new address
            queryClient.setQueryData(clientKeys.current(), (oldData) => ({
                ...oldData,
                address: updatedClient.address
            }));
            queryClient.invalidateQueries(['currentClient']);

            // Specifically update address cache
            queryClient.setQueryData(clientKeys.address(), updatedClient.address);
        },
        onError: (error) => {
            console.error('Error updating client address:', error);
            throw error;
        }
    });
};

/**
 * Hook for changing client password
 */
export const useChangeClientPassword = () => {
    return useMutation({
        mutationFn: (passwordData) => withAuth(changeClientPassword)(passwordData),
        onError: (error) => {
            console.error('Error changing password:', error);
            if (error.response?.status === 401) {
                throw new Error('Current password is incorrect');
            }
            throw error;
        }
    });
};

/**
 * Hook for prefetching client data
 */
export const usePrefetchClient = () => {
    const queryClient = useQueryClient();

    return () => {
        queryClient.prefetchQuery({
            queryKey: clientKeys.current(),
            queryFn: () => withAuth(getCurrentClient)(),
            staleTime: 1000 * 60 * 5 // 5 minutes
        });
    };
};

/**
 * Hook for getting client address
 */
export const useGetClientAddress = () => {
    return useQuery({
        queryKey: clientKeys.address(),
        queryFn: async () => {
            const client = await withAuth(getCurrentClient)();
            return client?.address || null;
        },
        staleTime: 1000 * 60 * 10 // 10 minutes
    });
};

// Combine all hooks for easier import
export const useClient = () => {
    return {
        useGetCurrentClient,
        useUpdateClientDetails,
        useUpdateClientAddress,
        useChangeClientPassword,
        usePrefetchClient,
        useGetClientAddress
    };
};