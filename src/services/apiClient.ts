import axios from 'axios';

import { supabaseClient } from '@/services/supabaseClient';

const deployedApiBaseUrl = 'https://squashcode-studio-backend.onrender.com/api';
const localApiBaseUrl = 'http://localhost:4000/api';

function isStaleProductionApiUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    return (
      parsedUrl.hostname === 'localhost' ||
      parsedUrl.hostname === '127.0.0.1' ||
      parsedUrl.hostname.endsWith('7sc.in')
    );
  } catch {
    return true;
  }
}

function apiBaseUrl() {
  const configuredUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim();

  if (!configuredUrl) {
    return import.meta.env.PROD ? deployedApiBaseUrl : localApiBaseUrl;
  }

  if (import.meta.env.PROD && isStaleProductionApiUrl(configuredUrl)) {
    return deployedApiBaseUrl;
  }

  return configuredUrl;
}

export const apiClient = axios.create({
  baseURL: apiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const { data } = supabaseClient
    ? await supabaseClient.auth.getSession()
    : { data: { session: null } };
  const accessToken = data.session?.access_token;
  const supabaseUserId = data.session?.user.id;
  const promptUserId = import.meta.env.VITE_PROMPT_USER_ID;

  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }

  if (supabaseUserId) {
    config.headers.set('x-user-id', supabaseUserId);
  }

  if (promptUserId && !supabaseUserId) {
    config.headers.set('x-user-id', promptUserId);
  }

  return config;
});
