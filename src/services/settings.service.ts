import { apiClient } from '@/services/apiClient';

export const settingsService = {
  get: () => apiClient.get('/settings'),
};

