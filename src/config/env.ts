export const env = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000',
} as const;
