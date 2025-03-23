import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar_url?: string;
  banner_url?: string;
  bio?: string;
  location?: string;
  social_links?: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
    website?: string;
  };
  phone?: string;
  gender?: string;
  birth_date?: string;
  is_verified?: boolean;
  followers_count?: number;
  following_count?: number;
  posts_count?: number;
  badges?: Array<{
    id: string;
    name: string;
    icon_url: string;
    description: string;
  }>;
  created_at: string;
  updated_at?: string;
};
