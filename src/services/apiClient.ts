import axios from 'axios';

import { supabaseClient } from '@/services/supabaseClient';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api',
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

  if (promptUserId) {
    config.headers.set('x-user-id', promptUserId);
  }

  return config;
});
