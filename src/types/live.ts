export interface LiveStream {
  id: string;
  title: string;
  viewerCount: number;
  likeCount: number;
  category: string;
  tags: string[];
  description: string;
  streamer: {
    id: string;
    username: string;
    avatarUrl: string;
    followerCount: number;
    isFollowing: boolean;
  };
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  avatarUrl: string;
  content: string;
  timestamp: string;
  type: 'normal' | 'superChat' | 'pinned';
  superChatAmount?: number;
}

export interface StreamerControls {
  isChatRestrictedToFollowers: boolean;
  pinnedMessage?: ChatMessage;
  bannedUsers: string[];
  mutedUsers: string[];
}
