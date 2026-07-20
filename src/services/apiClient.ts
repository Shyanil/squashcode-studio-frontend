import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const promptUserId = import.meta.env.VITE_PROMPT_USER_ID;

  if (promptUserId) {
    config.headers.set('x-user-id', promptUserId);
  }

  return config;
});
