import { Link } from 'react-router-dom';
import { FiCheck, FiUser } from 'react-icons/fi';
import { Channel } from '../../types/channel';

interface ChannelCardProps {
  channel: Channel;
  isFollowing: boolean;
  onFollow: (channelId: string) => void;
  layout?: 'grid' | 'list';
}

export function ChannelCard({ channel, isFollowing, onFollow, layout = 'grid' }: ChannelCardProps) {
  const handleFollow = (e: React.MouseEvent) => {
    e.preventDefault();
    onFollow(channel.id);
  };

  if (layout === 'list') {
    return (
      <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-4 hover:bg-gray-750 transition-colors">
        {/* Avatar */}
        <Link to={`/channel/${channel.id}`} className="flex-shrink-0">
          <img
            src={channel.avatar_url}
            alt={channel.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link to={`/channel/${channel.id}`} className="text-white font-medium hover:text-purple-400">
              {channel.name}
            </Link>
            {channel.is_verified && (
              <FiCheck className="text-blue-500 flex-shrink-0" />
            )}
            {channel.is_live && (
              <span className="px-2 py-0.5 bg-red-600 text-white text-xs rounded-full flex-shrink-0">
                AO VIVO
              </span>
            )}
            {channel.is_new && (
              <span className="px-2 py-0.5 bg-purple-600 text-white text-xs rounded-full flex-shrink-0">
                NOVO
              </span>
            )}
          </div>
          
          <p className="text-gray-400 text-sm truncate mt-1">
            {channel.description}
          </p>
          
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span className="text-gray-400 flex items-center gap-1">
              <FiUser className="text-gray-500" />
              {channel.subscriber_count.toLocaleString()} inscritos
            </span>
            <span className="text-purple-400">
              {channel.category}
            </span>
          </div>
        </div>

        {/* Follow Button */}
        <button
          onClick={handleFollow}
          className={`px-4 py-2 rounded-lg font-medium transition-colors flex-shrink-0 ${
            isFollowing
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          {isFollowing ? 'Seguindo' : 'Seguir'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors">
      {/* Banner */}
      <Link to={`/channel/${channel.id}`} className="block relative aspect-video">
        <img
          src={channel.banner_url}
          alt={`${channel.name} banner`}
          className="w-full h-full object-cover"
        />
        {channel.is_live && (
          <span className="absolute top-2 left-2 px-2 py-1 bg-red-600 text-white text-xs rounded-full">
            AO VIVO
          </span>
        )}
      </Link>

      <div className="p-4">
        {/* Avatar and Info */}
        <div className="flex items-start gap-3">
          <Link to={`/channel/${channel.id}`} className="flex-shrink-0">
            <img
              src={channel.avatar_url}
              alt={channel.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Link to={`/channel/${channel.id}`} className="text-white font-medium hover:text-purple-400 truncate">
                {channel.name}
              </Link>
              {channel.is_verified && (
                <FiCheck className="text-blue-500 flex-shrink-0" />
              )}
            </div>

            <div className="flex items-center gap-2 mt-1 text-sm">
              <span className="text-gray-400 flex items-center gap-1">
                <FiUser className="text-gray-500" />
                {channel.subscriber_count.toLocaleString()}
              </span>
              {channel.is_new && (
                <span className="px-2 py-0.5 bg-purple-600 text-white text-xs rounded-full">
                  NOVO
                </span>
              )}
            </div>
          </div>

          {/* Follow Button */}
          <button
            onClick={handleFollow}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isFollowing
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          >
            {isFollowing ? 'Seguindo' : 'Seguir'}
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-400 text-sm line-clamp-2 mt-3">
          {channel.description}
        </p>

        {/* Category */}
        <div className="mt-3">
          <span className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full">
            {channel.category}
          </span>
        </div>
      </div>
    </div>
  );
}
