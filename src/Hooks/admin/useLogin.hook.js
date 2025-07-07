import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { loginAdmin, logoutAdmin, refreshAdminToken } from '../../Api/admin.api';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAdminAuth = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Check for existing admin data in cache
    const { data: admin } = useQuery({
        queryKey: ['admin'],
        enabled: false, // Don't fetch automatically
        staleTime: Infinity, // Never stale
    });

    // Login mutation
    const loginMutation = useMutation({
        mutationFn: loginAdmin,
        onSuccess: (data) => {
            // Store admin data in query cache
            queryClient.setQueryData(['admin'], data.admin);
            // Store tokens in cache
            queryClient.setQueryData(['auth'], {
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
            });
            // Navigate to dashboard or intended location
            navigate('/dashboard');
        },
        onError: (error) => {
            console.error('Login failed:', error);
            // You might want to handle specific error cases here
        },
    });

    // Logout mutation
    const logoutMutation = useMutation({
        mutationFn: logoutAdmin,
        onSuccess: () => {
            // Clear all auth-related data
            queryClient.removeQueries(['admin']);
            queryClient.removeQueries(['auth']);
            // Navigate to login page
            navigate('/login');
        },
        onError: (error) => {
            console.error('Logout failed:', error);
            // Even if logout API fails, we should clear client-side auth state
            queryClient.removeQueries(['admin']);
            queryClient.removeQueries(['auth']);
            navigate('/login');
        },
    });

    // Token refresh function
    const refreshTokenMutation = useMutation({
        mutationFn: refreshAdminToken,
        onSuccess: (data) => {
            queryClient.setQueryData(['auth'], {
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
            });
        },
        onError: (error) => {
            console.error('Token refresh failed:', error);
            // If refresh fails, force logout
            logoutMutation.mutate();
        },
    });

    // Auto-refresh token logic
    useEffect(() => {
        const checkTokenExpiration = () => {
            const authData = queryClient.getQueryData(['auth']);
            if (!authData?.accessToken) return;

            try {
                const { exp } = JSON.parse(atob(authData.accessToken.split('.')[1]));
                const expiresIn = exp * 1000 - Date.now();

                // If token expires in less than 5 minutes, refresh it
                if (expiresIn < 300000) {
                    refreshTokenMutation.mutate({ refreshToken: authData.refreshToken });
                }
            } catch (e) {
                console.error('Token parsing error:', e);
            }
        };

        // Check every minute
        const interval = setInterval(checkTokenExpiration, 60000);
        return () => clearInterval(interval);
    }, [queryClient, refreshTokenMutation]);

    return {
        admin,
        isAuthenticated: !!admin,
        isLoading: loginMutation.isPending,
        isError: loginMutation.isError,
        error: loginMutation.error,
        login: loginMutation.mutate,
        logout: logoutMutation.mutate,
        isLoggingOut: logoutMutation.isPending,
    };
};