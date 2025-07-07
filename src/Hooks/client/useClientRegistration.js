import { useMutation } from '@tanstack/react-query';
import { registerClient } from '../../Api/client.api';

export const useClientRegistration = (options = {}) => {
    return useMutation({
        mutationFn: registerClient,
        ...options
    });
};