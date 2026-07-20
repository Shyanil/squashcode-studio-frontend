import { apiClient } from '@/services/apiClient';

export const assetsService = {
  list: () => apiClient.get('/assets'),
  upload: (formData: FormData) =>
    apiClient.post('/assets/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

