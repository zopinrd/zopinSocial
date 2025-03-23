import { useState } from 'react';
import { LiveStream, ChatMessage } from '../types/live';
import { FiUsers, FiHeart, FiShare2, FiMaximize2, FiFlag } from 'react-icons/fi';
import { Header } from '../components/layout/Header';
import { LeftSidebar } from '../components/sidebar/LeftSidebar';

const mockLiveStream: LiveStream = {
  id: '1',
  title: 'Primeira Live do Canal! 🎉',
  viewerCount: 1234,
  likeCount: 567,
  category: 'Just Chatting',
  tags: ['Entretenimento', 'Bate-papo'],
  description: 'Venha conversar e se divertir com a gente!',
  streamer: {
    id: '123',
    username: 'StreamerPro',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=123',
    followerCount: 10000,
    isFollowing: false,
  },
};

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    userId: '1',
    username: 'Viewer1',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    content: 'Oi pessoal! 👋',
    timestamp: '12:00',
    type: 'normal',
  },
  {
    id: '2',
    userId: '2',
    username: 'SuperFan',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    content: 'Incrível a live! Toma um presente! 🎁',
    timestamp: '12:01',
    type: 'superChat',
    superChatAmount: 50,
  },
];

export default function LivePage() {
  const [stream, setStream] = useState<LiveStream>(mockLiveStream);
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleLike = () => {
    setStream(prev => ({
      ...prev,
      likeCount: prev.likeCount + 1
    }));
  };

  const handleFollow = () => {
    setStream(prev => ({
      ...prev,
      streamer: {
        ...prev.streamer,
        isFollowing: !prev.streamer.isFollowing,
        followerCount: prev.streamer.isFollowing 
          ? prev.streamer.followerCount - 1 
          : prev.streamer.followerCount + 1
      }
    }));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      userId: 'current-user',
      username: 'Você',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=current',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString(),
      type: 'normal',
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      {/* Main Content */}
      <main className="container mt-6 mx-auto px-4 max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-24">
          {/* Fixed Left Sidebar */}
          <div className="hidden lg:block lg:col-span-2 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
            <LeftSidebar />
          </div>
          
          {/* Main Feed - Live Content */}
          <div className="lg:col-span-7">
            {/* Video Player Section */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted
                loop
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <FiUsers className="text-red-500" />
                    <span>{stream.viewerCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button onClick={handleLike} className="flex items-center gap-2 hover:text-red-500">
                      <FiHeart />
                      <span>{stream.likeCount.toLocaleString()}</span>
                    </button>
                    <button className="hover:text-blue-500">
                      <FiShare2 />
                    </button>
                    <button onClick={() => setIsFullscreen(!isFullscreen)} className="hover:text-blue-500">
                      <FiMaximize2 />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Streamer Info */}
            <div className="mt-4 bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img
                    src={stream.streamer.avatarUrl}
                    alt={stream.streamer.username}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h1 className="text-xl font-bold text-white">{stream.title}</h1>
                    <p className="text-gray-400">{stream.streamer.username}</p>
                  </div>
                </div>
                <button
                  onClick={handleFollow}
                  className={`px-6 py-2 rounded-full font-medium ${
                    stream.streamer.isFollowing
                      ? 'bg-gray-700 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {stream.streamer.isFollowing ? 'Seguindo' : 'Seguir'}
                </button>
              </div>
              <div className="mt-4">
                <div className="flex gap-2">
                  {stream.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-gray-300">{stream.description}</p>
              </div>
            </div>
          </div>

          {/* Fixed Right Sidebar - Chat */}
          <div className="lg:col-span-3 sticky top-24 h-[calc(100vh-6rem)] bg-gray-800 rounded-lg">
            <div className="flex flex-col h-full p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-white">Chat ao vivo</h2>
                <button className="text-gray-400 hover:text-red-500">
                  <FiFlag />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`p-2 rounded ${
                      message.type === 'superChat'
                        ? 'bg-yellow-500/20 border border-yellow-500/50'
                        : message.type === 'pinned'
                        ? 'bg-blue-500/20 border border-blue-500/50'
                        : ''
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <img
                        src={message.avatarUrl}
                        alt={message.username}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-purple-400">
                            {message.username}
                          </span>
                          <span className="text-xs text-gray-500">
                            {message.timestamp}
                          </span>
                        </div>
                        <p className="text-gray-300">{message.content}</p>
                        {message.type === 'superChat' && (
                          <div className="mt-1 text-yellow-500 text-sm">
                            Doou R$ {message.superChatAmount},00
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="mt-auto">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Envie uma mensagem..."
                    className="flex-1 bg-gray-700 text-white rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
