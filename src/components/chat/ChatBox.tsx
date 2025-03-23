import { useEffect, useState, useRef } from 'react';
import { FiX, FiSend, FiMinimize2, FiMaximize2, FiPaperclip, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { chatService } from '../../services/chatService';
import { Message } from '../../services/chatService';
import { supabase } from '../../lib/supabase';

interface ChatBoxProps {
  friend: {
    id: string;
    name: string;
    avatar_url: string;
    is_online: boolean;
    is_live: boolean;
  };
  onClose: () => void;
}

export const ChatBox = ({ friend, onClose }: ChatBoxProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  useEffect(() => {
    const initializeChat = async () => {
      const conversation = await chatService.getOrCreateConversation(friend.id);
      if (!conversation) return;

      const messages = await chatService.getConversationMessages(conversation.id);
      setMessages(messages);
      setIsLoading(false);

      // Inscrever para atualizações em tempo real
      const unsubscribe = chatService.subscribeToMessages(
        conversation.id,
        (message, eventType) => {
          setMessages((prev) => {
            switch (eventType) {
              case 'INSERT':
                return [...prev, message];
              case 'UPDATE':
                return prev.map((m) => (m.id === message.id ? message : m));
              case 'DELETE':
                return prev.filter((m) => m.id !== message.id);
              default:
                return prev;
            }
          });
          if (eventType === 'INSERT') {
            scrollToBottom();
          }
        }
      );

      // Marcar mensagens como lidas
      await chatService.markMessagesAsRead(conversation.id);

      return () => {
        unsubscribe();
      };
    };

    initializeChat();
  }, [friend.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() && selectedFiles.length === 0) return;

    const conversation = await chatService.getOrCreateConversation(friend.id);
    if (!conversation) return;

    if (editingMessageId) {
      await chatService.editMessage(editingMessageId, newMessage);
      setEditingMessageId(null);
    } else {
      await chatService.sendMessage(conversation.id, newMessage, selectedFiles);
    }
    
    setNewMessage('');
    setSelectedFiles([]);
  };

  const handleEditMessage = async (message: Message) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (message.sender_id !== user?.id) return;

    setEditingMessageId(message.id);
    setNewMessage(message.content);
  };

  const handleDeleteMessage = async (messageId: string) => {
    await chatService.deleteMessage(messageId);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setNewMessage('');
  };

  return (
    <>
      {/* Background overlay when chat is open and not minimized */}
      {!isMinimized && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-50" />
      )}
      <div className={`relative w-full bg-gray-800 rounded-t-lg shadow-lg overflow-hidden z-50 
        ${isMinimized ? 'h-12' : 'h-[480px]'}`}>
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between bg-gray-700 px-4 py-3 border-b border-gray-600">
          <div className="flex items-center gap-2">
            <div className="relative">
              <img
                src={friend.avatar_url}
                alt={friend.name}
                className="w-8 h-8 rounded-full"
              />
              <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-gray-700
                ${friend.is_live ? 'bg-red-500' : friend.is_online ? 'bg-green-500' : 'bg-gray-500'}`}
              />
            </div>
            <span className="font-medium text-white">{friend.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isMinimized ? <FiMaximize2 /> : <FiMinimize2 />}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FiX />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="h-[calc(100%-7.5rem)] overflow-y-auto p-4 space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <span className="text-gray-400">Carregando mensagens...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <span className="text-gray-400">Nenhuma mensagem ainda</span>
                </div>
              ) : (
                messages.map((message) => {
                  const isCurrentUser = message.sender_id !== friend.id;
                  const isEdited = message.updated_at && !message.deleted_at;
                  const isDeleted = message.deleted_at;

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          isCurrentUser
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-700 text-white'
                        }`}
                      >
                        {isDeleted ? (
                          <p className="text-gray-400 italic">Mensagem apagada</p>
                        ) : (
                          <>
                            <p>{message.content}</p>
                            {message.attachments?.map((url, index) => (
                              <div key={index} className="mt-2">
                                {url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                  <img
                                    src={url}
                                    alt="Attachment"
                                    className="max-w-full rounded"
                                  />
                                ) : (
                                  <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:text-blue-300"
                                  >
                                    Ver anexo
                                  </a>
                                )}
                              </div>
                            ))}
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-gray-300">
                                {new Date(message.created_at).toLocaleTimeString()}
                                {isEdited && (
                                  <span className="ml-1 text-gray-400">(editado)</span>
                                )}
                              </span>
                              {isCurrentUser && !isDeleted && (
                                <div className="flex items-center gap-2 ml-2">
                                  <button
                                    onClick={() => handleEditMessage(message)}
                                    className="text-gray-300 hover:text-white transition-colors"
                                  >
                                    <FiEdit2 className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteMessage(message.id)}
                                    className="text-gray-300 hover:text-white transition-colors"
                                  >
                                    <FiTrash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Selected Files Preview */}
            {selectedFiles.length > 0 && (
              <div className="px-4 py-2 bg-gray-700 border-t border-gray-600">
                <div className="flex flex-wrap gap-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-600 rounded px-2 py-1"
                    >
                      <span className="text-sm text-white truncate max-w-[100px]">
                        {file.name}
                      </span>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="ml-2 text-gray-400 hover:text-white"
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={editingMessageId ? "Editar mensagem..." : "Digite sua mensagem..."}
                  className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                {editingMessageId ? (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    Cancelar
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    <FiPaperclip />
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!newMessage.trim() && selectedFiles.length === 0}
                  className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSend />
                </button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                multiple
              />
            </form>
          </>
        )}
      </div>
    </>
  );
};
