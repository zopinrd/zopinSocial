import { useState } from 'react';
import { StreamerControls, ChatMessage } from '../../types/live';
import { FiLock, FiUnlock, FiUsers, FiHeart, FiMessageCircle, FiX } from 'react-icons/fi';

interface StreamerPanelProps {
  viewerCount: number;
  likeCount: number;
  onTitleChange: (newTitle: string) => void;
  onPinMessage: (message: ChatMessage | undefined) => void;
  onToggleChatRestriction: () => void;
  onEndStream: () => void;
}

export default function StreamerPanel({
  viewerCount,
  likeCount,
  onTitleChange,
  onPinMessage,
  onToggleChatRestriction,
  onEndStream,
}: StreamerPanelProps) {
  const [title, setTitle] = useState('');
  const [isRestricted, setIsRestricted] = useState(false);

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onTitleChange(title);
      setTitle('');
    }
  };

  const handleChatRestriction = () => {
    setIsRestricted(!isRestricted);
    onToggleChatRestriction();
  };

  return (
    <div className="fixed right-4 top-20 w-80 bg-gray-800 rounded-lg shadow-lg p-4 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Painel do Streamer</h2>
        <button
          onClick={onEndStream}
          className="text-red-500 hover:text-red-400"
        >
          <FiX size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-700 p-3 rounded-lg text-center">
            <FiUsers className="mx-auto mb-1" />
            <div className="text-sm text-gray-400">Viewers</div>
            <div className="font-bold">{viewerCount}</div>
          </div>
          <div className="bg-gray-700 p-3 rounded-lg text-center">
            <FiHeart className="mx-auto mb-1" />
            <div className="text-sm text-gray-400">Likes</div>
            <div className="font-bold">{likeCount}</div>
          </div>
          <div className="bg-gray-700 p-3 rounded-lg text-center">
            <FiMessageCircle className="mx-auto mb-1" />
            <div className="text-sm text-gray-400">Chat</div>
            <button
              onClick={handleChatRestriction}
              className="text-xs font-medium"
            >
              {isRestricted ? (
                <FiLock className="mx-auto text-yellow-500" />
              ) : (
                <FiUnlock className="mx-auto text-green-500" />
              )}
            </button>
          </div>
        </div>

        {/* Title Update */}
        <form onSubmit={handleTitleSubmit} className="space-y-2">
          <label className="block text-sm text-gray-400">Atualizar Título</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Novo título da live..."
              className="flex-1 bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 rounded text-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Atualizar
            </button>
          </div>
        </form>

        {/* Stream Controls */}
        <div className="space-y-2">
          <label className="block text-sm text-gray-400">Controles</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onPinMessage(undefined)}
              className="p-2 bg-gray-700 rounded text-sm hover:bg-gray-600"
            >
              Desafixar Mensagem
            </button>
            <button
              onClick={handleChatRestriction}
              className={`p-2 rounded text-sm ${
                isRestricted
                  ? 'bg-yellow-600 hover:bg-yellow-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isRestricted ? 'Liberar Chat' : 'Restringir Chat'}
            </button>
          </div>
        </div>

        {/* End Stream */}
        <button
          onClick={onEndStream}
          className="w-full p-2 bg-red-600 rounded text-sm hover:bg-red-700 mt-4"
        >
          Encerrar Transmissão
        </button>
      </div>
    </div>
  );
}
