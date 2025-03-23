export type ChannelType = 'personal' | 'brand' | 'community' | 'store';
export type ChannelVisibility = 'public' | 'private' | 'followers';
export type ChannelTheme = 'light' | 'dark' | 'auto';
export type AudienceType = 'general' | 'kids' | 'adult';
export type ChannelStatus = 'live' | 'new' | 'verified';
export type SortOption = 'popular' | 'recent' | 'active' | 'recommended';

export interface Channel {
  id: string;
  name: string;
  description: string;
  avatar_url: string;
  banner_url: string;
  type: ChannelType;
  visibility: ChannelVisibility;
  category: string;
  language: string;
  location?: string;
  subscriber_count: number;
  is_verified: boolean;
  is_live: boolean;
  is_new: boolean;
  is_followed: boolean;
  tags: string[];
  audience: AudienceType;
  settings: ChannelSettings;
  social_links: ChannelSocialLinks;
  created_at: string;
  last_active: string;
}

export interface ChannelSocialLinks {
  instagram?: string;
  tiktok?: string;
  twitter?: string;
  discord?: string;
  email?: string;
  website?: string;
}

export interface ChannelSettings {
  allow_comments: boolean;
  allow_live_streams: boolean;
  allow_shorts: boolean;
  theme: ChannelTheme;
  two_factor_auth: boolean;
  custom_url?: string;
}

export interface ChannelFilters {
  search: string;
  category?: string;
  language?: string;
  status?: ChannelStatus[];
  type?: ChannelType;
  sort_by: SortOption;
}
