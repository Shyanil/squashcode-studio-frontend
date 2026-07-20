import { apiClient } from '@/services/apiClient';
import type { LoginPayload } from '@/types';

export const authService = {
  login: (payload: LoginPayload) => apiClient.post('/auth/login', payload),
  logout: () => apiClient.post('/auth/logout'),
  me: () => apiClient.get('/auth/me'),
};

