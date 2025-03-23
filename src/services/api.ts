import axios from 'axios';
import { env } from '../config/env';
import { supabase } from '../lib/supabase';

const api = axios.create({
  baseURL: env.API_URL,
  timeout: 10000,
});

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  const session = await supabase.auth.getSession();
  if (session.data.session?.access_token) {
    config.headers.Authorization = `Bearer ${session.data.session.access_token}`;
  }
  return config;
});

export { api };
