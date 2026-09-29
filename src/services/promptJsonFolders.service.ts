import { apiClient } from '@/services/apiClient';
import type { ApiResponse } from '@/types';

export interface PromptJsonFolder {
  id: string;
  userId: string;
  name: string;
  description?: string;
  color: string;
  sortOrder: number;
  jsonCount: number;
  createdAt: string;
  updatedAt: string;
}

export const promptJsonFoldersService = {
  list: () => apiClient.get<ApiResponse<PromptJsonFolder[]>>('/prompt/folders'),

  create: (payload: { name: string; description?: string }) =>
    apiClient.post<ApiResponse<PromptJsonFolder>>('/prompt/folders', payload),

  remove: (id: string) => apiClient.delete<ApiResponse<boolean>>(`/prompt/folders/${id}`),

  assignGeneration: (generationId: string, folderId: string | null) =>
    apiClient.patch<ApiResponse<boolean>>(`/prompt/folders/generations/${generationId}`, {
      folderId,
    }),
};
