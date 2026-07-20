import { apiClient } from '@/services/apiClient';

export const brandsService = {
  list: () => apiClient.get('/brands'),
};

