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

export type CreativeFeedbackSignalType =
  | 'favorite'
  | 'unfavorite'
  | 'like'
  | 'dislike'
  | 'approved'
  | 'rejected'
  | 'revision_requested'
  | 'exported'
  | 'deleted'
  | 'manual_note';

export interface CreativeFeedback {
  id: string;
  creativeId: string;
  promptGenerationId?: string | null;
  userId: string;
  signalType: CreativeFeedbackSignalType;
  score: number;
  comment?: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface CreativeMetrics {
  id: string;
  creativeId: string;
  userId: string;
  platform?: string | null;
  campaignName?: string | null;
  impressions?: number | null;
  reach?: number | null;
  clicks?: number | null;
  conversions?: number | null;
  spend?: number | null;
  revenue?: number | null;
  ctr?: number | null;
  conversionRate?: number | null;
  rawMetrics: Record<string, unknown>;
  capturedAt: string;
  createdAt: string;
}

export interface CreativeLearningSummary {
  creativeId: string;
  feedback: CreativeFeedback[];
  metrics: CreativeMetrics[];
  summary: {
    aggregateScore: number;
    feedbackCount: number;
    feedbackScore: number;
    metricPerformanceScore: number;
    metricsCount: number;
  };
}

export const creativeService = {
  generate: (payload: {
    title: string;
    brand?: string;
    campaign?: string;
    creativeName?: string;
    tags?: string[];
    aspectRatio?: string;
    quality?: string;
    imageCount?: number;
    promptGenerationId?: string;
    referenceImageUrl?: string;
  }) => apiClient.post<ApiResponse<CreativeItem[]>>('/creative/generate', payload),

  list: () => apiClient.get<ApiResponse<CreativeItem[]>>('/creative'),
  delete: (id: string) => apiClient.delete<ApiResponse<boolean>>(`/creative/${id}`),
  createFeedback: (
    id: string,
    payload: {
      comment?: string;
      metadata?: Record<string, unknown>;
      signalType: CreativeFeedbackSignalType;
    },
  ) => apiClient.post<ApiResponse<CreativeFeedback>>(`/creative/${id}/feedback`, payload),
  recordMetrics: (
    id: string,
    payload: {
      campaignName?: string;
      clicks?: number;
      conversionRate?: number;
      conversions?: number;
      ctr?: number;
      impressions?: number;
      platform?: string;
      rawMetrics?: Record<string, unknown>;
      reach?: number;
      revenue?: number;
      spend?: number;
    },
  ) => apiClient.post<ApiResponse<CreativeMetrics>>(`/creative/${id}/metrics`, payload),
  getLearningSummary: (id: string) =>
    apiClient.get<ApiResponse<CreativeLearningSummary>>(`/creative/${id}/learning-summary`),
  toggleFavorite: (id: string) =>
    apiClient.post<ApiResponse<CreativeItem>>(`/creative/${id}/favorite`),
};
