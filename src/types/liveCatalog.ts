export interface LiveStream {
  id: string;
  title: string;
  thumbnailUrl: string;
  viewerCount: number;
  startedAt: string;
  scheduledFor?: string;
  category: string;
  language: string;
  tags: string[];
  quality: '720p' | '1080p' | '4K';
  channel: {
    id: string;
    name: string;
    avatarUrl: string;
    isVerified: boolean;
    isNew: boolean;
    isFollowed: boolean;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconUrl?: string;
}

export type SortOption = 'trending' | 'recent' | 'recommended';

export type Language = 'pt-BR' | 'en-US' | 'es-ES';

export interface LiveCatalogFilters {
  search: string;
  category?: string;
  language?: Language;
  sortBy: SortOption;
  tags: string[];
}
