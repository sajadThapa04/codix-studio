import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    createContact,
    createAuthenticatedContact,
    getAllContacts,
    getContactById,
    updateContact,
    deleteContact,
    getMyContacts,
    setContactAuthToken
} from '../../Api/contact.api';

// Helper to set auth token before requests
const withAuth = (fn) => {
    return async (...args) => {
        const token = localStorage.getItem('authToken');
        if (token) setContactAuthToken(token);
        return fn(...args);
    };
};

// Contact Query Keys
export const contactKeys = {
    all: ['contacts'],
    lists: () => [...contactKeys.all, 'list'],
    list: (filters) => [...contactKeys.lists(), { filters }],
    details: () => [...contactKeys.all, 'detail'],
    detail: (id) => [...contactKeys.details(), id],
    myContacts: () => [...contactKeys.all, 'my'],
};

/**
 * Hook for creating a new contact (unauthenticated)
 */
export const useCreateContact = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (contactData) => createContact(contactData),
        onSuccess: () => {
            queryClient.invalidateQueries(contactKeys.lists());
        },
        onError: (error) => {
            console.error('Error creating contact:', error);
            // Return the structured error
            throw {
                message: error.message,
                status: error.status,
                response: {
                    data: {
                        message: error.message
                    },
                    status: error.status
                }
            };
        }
    });
};

export const useCreateAuthenticatedContact = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (contactData) => withAuth(createAuthenticatedContact)(contactData),
        onSuccess: () => {
            queryClient.invalidateQueries(contactKeys.lists());
            queryClient.invalidateQueries(contactKeys.myContacts());
        },
        onError: (error) => {
            console.error('Error creating authenticated contact:', error);
            // Return the structured error
            throw {
                message: error.message,
                status: error.status,
                response: {
                    data: {
                        message: error.message
                    },
                    status: error.status
                }
            };
        }
    });
};
/**
 * Hook for fetching all contacts (admin only)
 */
export const useGetAllContacts = (filters = {}) => {
    return useQuery({
        queryKey: contactKeys.list(filters),
        queryFn: () => withAuth(getAllContacts)(filters),
        staleTime: 1000 * 60 * 5, // 5 minutes
        keepPreviousData: true,
    });
};

/**
 * Hook for fetching a single contact by ID (admin only)
 */
export const useGetContactById = (contactId) => {
    return useQuery({
        queryKey: contactKeys.detail(contactId),
        queryFn: async () => {
            const response = await withAuth(getContactById)(contactId);
            return response?.data || response;
        },
        enabled: !!contactId,
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
 * Hook for updating a contact (admin only)
 */
export const useUpdateContact = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ contactId, updateData }) => withAuth(updateContact)(contactId, updateData),
        onSuccess: (updatedContact) => {
            queryClient.setQueryData(contactKeys.detail(updatedContact._id), updatedContact);
            queryClient.invalidateQueries(contactKeys.lists());
        },
        onError: (error) => {
            console.error('Error updating contact:', error);
            throw error;
        },
    });
};

/**
 * Hook for deleting a contact (admin only)
 */
export const useDeleteContact = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (contactId) => withAuth(deleteContact)(contactId),
        onSuccess: (data, contactId) => {
            queryClient.removeQueries(contactKeys.detail(contactId));
            queryClient.invalidateQueries(contactKeys.lists());
        },
        onError: (error) => {
            console.error('Error deleting contact:', error);
            throw error;
        }
    });
};

/**
 * Hook for fetching the current user's contacts
 */
export const useGetMyContacts = (filters = {}) => {
    return useQuery({
        queryKey: [...contactKeys.myContacts(), filters],
        queryFn: () => withAuth(getMyContacts)(filters),
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: (failureCount, error) => {
            if (error?.response?.status === 401) return false;
            return failureCount < 2;
        },
    });
};

/**
 * Hook for prefetching a contact
 */
export const usePrefetchContact = () => {
    const queryClient = useQueryClient();

    return (contactId) => {
        queryClient.prefetchQuery({
            queryKey: contactKeys.detail(contactId),
            queryFn: () => withAuth(getContactById)(contactId),
            staleTime: 1000 * 60 * 10, // 10 minutes
        });
    };
};