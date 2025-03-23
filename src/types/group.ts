export type GroupType = 'public' | 'private' | 'secret';
export type GroupTheme = 'light' | 'dark' | 'auto';
export type GroupJoinType = 'open' | 'approval';
export type GroupCategory = 'sales' | 'music' | 'games' | 'education' | 'community' | 'technology' | 'lifestyle' | 'sports' | 'art';

export interface GroupSettings {
  postPermission: 'all' | 'admins';
  commentPermission: 'all' | 'members' | 'admins';
  allowMedia: boolean;
  enableChat: boolean;
  theme: GroupTheme;
  welcomeMessage?: string;
  customUrl?: string;
}

export interface GroupSocialLinks {
  website?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
  discord?: string;
  telegram?: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  detailedDescription: string;
  bannerUrl: string;
  avatarUrl: string;
  memberCount: number;
  createdAt: string;
  type: GroupType;
  joinType: GroupJoinType;
  category: GroupCategory;
  language: string;
  location?: string;
  rules: string[];
  tags: string[];
  settings: GroupSettings;
  socialLinks: GroupSocialLinks;
  admins: string[];
  isCommercial: boolean;
  isPrivate: boolean;
}

export interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: string;
  name: string;
  avatarUrl?: string;
}

export interface GroupPost {
  id: string;
  groupId: string;
  authorId: string;
  author: {
    name: string;
    avatarUrl?: string;
  };
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  createdAt: string;
  isPinned: boolean;
  isAnnouncement: boolean;
  reactions: {
    type: string;
    count: number;
    userReacted: boolean;
  }[];
  commentCount: number;
  tags: string[];
  poll?: {
    question: string;
    options: {
      id: string;
      text: string;
      votes: number;
    }[];
    totalVotes: number;
    endsAt: string;
  };
}

export interface GroupComment {
  id: string;
  postId: string;
  authorId: string;
  author: {
    name: string;
    avatarUrl?: string;
  };
  content: string;
  createdAt: string;
  parentId?: string;
  reactions: {
    type: string;
    count: number;
    userReacted: boolean;
  }[];
  replies: GroupComment[];
}

export interface GroupEvent {
  id: string;
  groupId: string;
  title: string;
  description: string;
  coverUrl?: string;
  startDate: string;
  endDate: string;
  location?: string;
  attendeeCount: number;
  isOnline: boolean;
  status: 'upcoming' | 'ongoing' | 'past';
}

export interface MarketplaceItem {
  id: string;
  groupId: string;
  sellerId: string;
  seller: {
    name: string;
    avatarUrl?: string;
  };
  title: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor';
  createdAt: string;
  status: 'available' | 'sold' | 'reserved';
  category: string;
}
