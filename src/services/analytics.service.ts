import { apiClient } from '@/services/apiClient';

export const analyticsService = {
  summary: () => apiClient.get('/analytics/summary'),
};

