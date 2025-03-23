export type ResultType = 'all' | 'videos' | 'channels' | 'lives' | 'groups' | 'posts' | 'products' | 'people';

export interface SearchResult {
  id: string;
  type: ResultType;
  title: string;
  description?: string;
  imageUrl?: string;
  avatarUrl?: string;
  authorName?: string;
  date?: string;
  metrics?: {
    views?: number;
    likes?: number;
    subscribers?: number;
    viewers?: number;
    followers?: number;
  };
  isLive?: boolean;
  // People specific fields
  username?: string;
  location?: string;
  role?: string;
  followers?: number;
  following?: number;
}
