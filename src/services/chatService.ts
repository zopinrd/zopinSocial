import { supabase } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  attachments?: string[];
  created_at: string;
  read_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface Conversation {
  id: string;
  created_at: string;
  participants: string[];
}

type MessageCallback = (message: Message, eventType: 'INSERT' | 'UPDATE' | 'DELETE') => void;

class ChatService {
  private channels: Map<string, RealtimeChannel> = new Map();

  async getOrCreateConversation(friendId: string): Promise<Conversation | null> {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) return null;

    // Buscar conversa existente
    const { data: existingConversation } = await supabase
      .from('conversations')
      .select('*')
      .contains('participants', [userId, friendId])
      .single();

    if (existingConversation) {
      return existingConversation;
    }

    // Criar nova conversa
    const { data: newConversation } = await supabase
      .from('conversations')
      .insert([
        {
          participants: [userId, friendId],
        },
      ])
      .select()
      .single();

    return newConversation;
  }

  async getConversationMessages(conversationId: string): Promise<Message[]> {
    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .is('deleted_at', null)
      .order('created_at', { ascending: true });

    return messages || [];
  }

  subscribeToMessages(
    conversationId: string,
    onMessage: MessageCallback
  ): () => void {
    // Inscrever no canal da conversa
    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Escutar todos os eventos (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const message = payload.new as Message;
          switch (payload.eventType) {
            case 'INSERT':
              onMessage(message, 'INSERT');
              break;
            case 'UPDATE':
              onMessage(message, 'UPDATE');
              break;
            case 'DELETE':
              // No caso de DELETE, payload.old contém os dados da mensagem deletada
              onMessage(payload.old as Message, 'DELETE');
              break;
          }
        }
      )
      .subscribe();

    // Guardar referência do canal
    this.channels.set(conversationId, channel);

    // Retornar função de cleanup
    return () => {
      channel.unsubscribe();
      this.channels.delete(conversationId);
    };
  }

  async sendMessage(
    conversationId: string,
    content: string,
    files?: File[]
  ): Promise<void> {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) return;

    let attachments: string[] = [];

    // Upload de arquivos
    if (files && files.length > 0) {
      const uploadPromises = files.map(async (file) => {
        const fileName = `${Date.now()}-${file.name}`;
        const { error } = await supabase.storage
          .from('chat-attachments')
          .upload(`${conversationId}/${fileName}`, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('chat-attachments')
          .getPublicUrl(`${conversationId}/${fileName}`);

        return publicUrl;
      });

      attachments = await Promise.all(uploadPromises);
    }

    // Enviar mensagem
    await supabase.from('messages').insert([
      {
        conversation_id: conversationId,
        sender_id: userId,
        content,
        attachments,
      },
    ]);
  }

  async editMessage(messageId: string, content: string): Promise<void> {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) return;

    await supabase
      .from('messages')
      .update({
        content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', messageId)
      .eq('sender_id', userId); // Apenas o remetente pode editar
  }

  async deleteMessage(messageId: string): Promise<void> {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) return;

    // Soft delete
    await supabase
      .from('messages')
      .update({
        deleted_at: new Date().toISOString(),
      })
      .eq('id', messageId)
      .eq('sender_id', userId); // Apenas o remetente pode deletar
  }

  async markMessagesAsRead(conversationId: string): Promise<void> {
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) return;

    await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .eq('sender_id', userId)
      .is('read_at', null);
  }
}

export const chatService = new ChatService();
