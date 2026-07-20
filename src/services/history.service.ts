import { apiClient } from '@/services/apiClient';

export const historyService = {
  list: () => apiClient.get('/history'),
};

