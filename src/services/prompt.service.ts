import { apiClient } from '@/services/apiClient';
import type { ApiResponse } from '@/types';

export type PromptSourceType = 'text' | 'image' | 'mixed';
export type PromptMessageRole = 'user' | 'assistant' | 'system';

export interface PromptUploadedImage {
  dataUrl: string;
  fileName: string;
  mimeType: string;
  size?: number;
}

export interface PromptSession {
  id: string;
  title: string;
  sourceType: PromptSourceType;
  status: 'draft' | 'active' | 'generated' | 'archived';
  brandContext: Record<string, unknown>;
  metadata: Record<string, unknown>;
  creativeContext: Record<string, unknown>;
  imageAnalysis: Record<string, unknown>;
  memoryContext: Record<string, unknown>[];
  createdAt: string;
  updatedAt: string;
  lastGeneratedAt?: string | null;
}

export interface PromptMessage {
  id: string;
  sessionId: string;
  role: PromptMessageRole;
  content: string;
  contentJson: Record<string, unknown>;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface PromptAsset {
  id: string;
  sessionId: string;
  bucketName?: string;
  storagePath: string;
  fileName: string;
  mimeType?: string;
  fileSize?: number;
  url?: string;
  metadata?: Record<string, unknown>;
}

export interface PromptGeneration {
  id: string;
  sessionId: string;
  versionNumber: number;
  promptText: string;
  generatedJson: Record<string, unknown>;
  promptMetadata: Record<string, unknown>;
  imageInsights?: Record<string, unknown>;
  referenceImagePath?: string;
  referenceImageUrl?: string;
  modelName?: string;
  aspectRatio: string;
  quality: string;
  imageCount: number;
  status: 'queued' | 'completed' | 'failed';
  createdAt: string;
}

export interface PromptSessionDetail {
  session: PromptSession;
  messages: PromptMessage[];
  generations: PromptGeneration[];
  assets: PromptAsset[];
}

export interface PromptAnalyzeImageResult {
  session: PromptSession;
  asset: PromptAsset;
  analysis: Record<string, unknown>;
  assistantMessage: PromptMessage;
}

export interface PromptAddAssetResult {
  session: PromptSession;
  asset: PromptAsset;
}

export interface PromptSendMessageResult {
  session: PromptSession;
  userMessage: PromptMessage;
  assistantMessage: PromptMessage;
}

export interface PromptGenerateJsonResult {
  session: PromptSession;
  generation: PromptGeneration;
}

export const promptService = {
  createSession: (payload: {
    title?: string;
    sourceType?: PromptSourceType;
    brandContext?: Record<string, unknown>;
  }) => apiClient.post<ApiResponse<PromptSessionDetail>>('/prompt/sessions', payload),

  getSession: (sessionId: string) =>
    apiClient.get<ApiResponse<PromptSessionDetail>>(`/prompt/sessions/${sessionId}`),

  updateSession: (sessionId: string, payload: { title: string }) =>
    apiClient.patch<ApiResponse<PromptSession>>(`/prompt/sessions/${sessionId}`, payload),

  analyzeImage: (sessionId: string, payload: { image: PromptUploadedImage; promptText?: string }) =>
    apiClient.post<ApiResponse<PromptAnalyzeImageResult>>(
      `/prompt/sessions/${sessionId}/image`,
      payload,
    ),

  addAsset: (sessionId: string, payload: { image: PromptUploadedImage; assetRole?: string }) =>
    apiClient.post<ApiResponse<PromptAddAssetResult>>(
      `/prompt/sessions/${sessionId}/assets`,
      payload,
    ),

  sendMessage: (sessionId: string, payload: { content: string }) =>
    apiClient.post<ApiResponse<PromptSendMessageResult>>(
      `/prompt/sessions/${sessionId}/messages`,
      payload,
    ),

  generateSessionJson: (
    sessionId: string,
    payload?: { outputOptions?: { aspectRatio?: string; quality?: string; imageCount?: number } },
  ) =>
    apiClient.post<ApiResponse<PromptGenerateJsonResult>>(
      `/prompt/sessions/${sessionId}/generate-json`,
      payload ?? {},
    ),

  generateJson: (payload: {
    sessionId?: string;
    promptText?: string;
    image?: PromptUploadedImage;
    outputOptions?: { aspectRatio?: string; quality?: string; imageCount?: number };
  }) => apiClient.post<ApiResponse<PromptGenerateJsonResult>>('/prompt/json', payload),

  enhance: (payload: { sessionId?: string; content: string }) =>
    apiClient.post<ApiResponse<PromptSendMessageResult | null>>('/prompt/enhance', payload),

  listGenerations: () =>
    apiClient.get<ApiResponse<PromptGeneration[]>>('/prompt/generations', {
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
      params: {
        _: Date.now(),
      },
    }),
};
