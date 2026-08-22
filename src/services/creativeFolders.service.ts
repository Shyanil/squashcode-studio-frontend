import { apiClient } from '@/services/apiClient';
import type { ApiResponse } from '@/types';

export interface CreativeFolder {
  id: string;
  userId: string;
  name: string;
  description?: string;
  color: string;
  sortOrder: number;
  imageCount: number;
  createdAt: string;
  updatedAt: string;
}

export const creativeFoldersService = {
  list: () => apiClient.get<ApiResponse<CreativeFolder[]>>('/creative/folders'),

  create: (payload: { name: string; description?: string; color?: string }) =>
    apiClient.post<ApiResponse<CreativeFolder>>('/creative/folders', payload),

  rename: (id: string, payload: { name?: string; description?: string; color?: string }) =>
    apiClient.patch<ApiResponse<CreativeFolder>>(`/creative/folders/${id}`, payload),

  remove: (id: string) => apiClient.delete<ApiResponse<boolean>>(`/creative/folders/${id}`),

  moveCreative: (creativeId: string, folderId: string | null) =>
    apiClient.patch<ApiResponse<{ id: string; folderId: string | null }>>(
      `/creative/${creativeId}/folder`,
      { folderId },
    ),
};
