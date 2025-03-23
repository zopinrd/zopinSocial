export interface Conversation {
  id: string;
  created_at: string;
  updated_at: string;
  participants?: ConversationParticipant[];
  last_message?: Message;
}

export interface ConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  created_at: string;
  user?: {
    id: string;
    name: string;
    avatar_url: string;
    is_online: boolean;
    is_live: boolean;
  };
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_edited: boolean;
  is_deleted: boolean;
  sender?: {
    id: string;
    name: string;
    avatar_url: string;
  };
}

export interface CreateConversationParams {
  participant_ids: string[];
}

export interface SendMessageParams {
  conversation_id: string;
  content: string;
}

export interface EditMessageParams {
  message_id: string;
  content: string;
}

export interface DeleteMessageParams {
  message_id: string;
}
