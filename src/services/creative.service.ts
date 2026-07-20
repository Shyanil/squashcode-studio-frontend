import { apiClient } from '@/services/apiClient';
import type { ApiResponse } from '@/types';

export interface CreativeItem {
  id: string;
  userId: string;
  title: string;
  brand: string;
  campaign: string;
  tags: string[];
  date: string;
  aspectRatio: string;
  variant: 'coral' | 'mint' | 'indigo' | 'amber' | 'rose' | 'cyan';
  favorite: boolean;
  imageUrl: string;
  createdAt: string;
  cpanelFilename?: string;
  cpanelSubfolder?: string;
  cpanelType?: 'generation' | 'reference';
  promptGenerationId?: string;
  referenceImageUrl?: string;
}

export const creativeService = {
  generate: (payload: {
    title: string;
    brand?: string;
    campaign?: string;
    tags?: string[];
    aspectRatio?: string;
    quality?: string;
    imageCount?: number;
    promptGenerationId?: string;
    referenceImageUrl?: string;
  }) => apiClient.post<ApiResponse<CreativeItem[]>>('/creative/generate', payload),

  list: () => apiClient.get<ApiResponse<CreativeItem[]>>('/creative'),
  delete: (id: string) => apiClient.delete<ApiResponse<boolean>>(`/creative/${id}`),
  toggleFavorite: (id: string) =>
    apiClient.post<ApiResponse<CreativeItem>>(`/creative/${id}/favorite`),
};
