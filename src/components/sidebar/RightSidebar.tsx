import { Circle } from 'lucide-react';
import { useState } from 'react';
import { ChatBox } from '../chat/ChatBox';

interface Friend {
  id: string;
  name: string;
  status: string;
  avatar_url: string;
  is_online: boolean;
  is_live: boolean;
}

export const RightSidebar = () => {
  const [activeChatFriend, setActiveChatFriend] = useState<Friend | null>(null);

  const trendingCreators = [
    {
      name: "Sarah Dance",
      followers: "1.2M",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=60"
    },
    {
      name: "Chef Maria",
      followers: "892K",
      avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=60"
    },
    {
      name: "Mike Tips",
      followers: "754K",
      avatar: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=400&auto=format&fit=crop&q=60"
    }
  ];

  const onlineFriends: Friend[] = [
    {
      id: "1",
      name: "Ana Silva",
      status: "Transmitindo ao vivo",
      avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60",
      is_online: true,
      is_live: true
    },
    {
      id: "2",
      name: "João Santos",
      status: "Online",
      avatar_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=60",
      is_online: true,
      is_live: false
    },
    {
      id: "3",
      name: "Pedro Lima",
      status: "Online",
      avatar_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=60",
      is_online: true,
      is_live: false
    },
    {
      id: "4",
      name: "Clara Costa",
      status: "Online",
      avatar_url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=60",
      is_online: true,
      is_live: false
    }
  ];

  const handleFriendClick = (friend: Friend) => {
    setActiveChatFriend(friend);
  };

  return (
    <div className="relative h-[calc(100vh-8rem)]">
      <div className="h-full overflow-y-auto">
        <div className="space-y-6">
          {/* Trending Creators */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Criadores em Alta</h2>
            <div className="space-y-4">
              {trendingCreators.map((creator) => (
                <div key={creator.name} className="flex items-center space-x-3">
                  <img
                    src={creator.avatar}
                    alt={`Avatar de ${creator.name}`}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{creator.name}</h3>
                    <p className="text-sm text-gray-400">{creator.followers} seguidores</p>
                  </div>
                  <button className="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                    Seguir
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Online Friends */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Amigos Online</h2>
            <div className="space-y-4">
              {onlineFriends.map((friend) => (
                <div
                  key={friend.id}
                  className="flex items-center space-x-3 cursor-pointer hover:bg-gray-700 p-2 rounded-lg transition-colors"
                  onClick={() => handleFriendClick(friend)}
                >
                  <div className="relative">
                    <img
                      src={friend.avatar_url}
                      alt={`Avatar de ${friend.name}`}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-gray-800 rounded-full p-0.5">
                      <Circle className={`h-3 w-3 ${friend.is_live ? 'text-red-500' : 'text-green-500'}`} fill="currentColor" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{friend.name}</h3>
                    <p className={`text-sm ${friend.is_live ? 'text-red-400' : 'text-green-400'}`}>
                      {friend.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Box */}
      {activeChatFriend && (
        <div className="absolute bottom-0 left-0 right-0">
          <ChatBox
            friend={activeChatFriend}
            onClose={() => setActiveChatFriend(null)}
          />
        </div>
      )}
    </div>
  );
};
