import { apiClient } from '@/services/apiClient';

export const usersService = {
  list: () => apiClient.get('/users'),
};

