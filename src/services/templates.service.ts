import { apiClient } from '@/services/apiClient';

export const templatesService = {
  list: () => apiClient.get('/templates'),
};

