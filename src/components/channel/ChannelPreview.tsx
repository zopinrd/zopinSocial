import { Channel } from '../../types/channel';
import { FiUsers, FiCheck } from 'react-icons/fi';

interface ChannelPreviewProps {
  data: Channel;
}

export function ChannelPreview({ data }: ChannelPreviewProps) {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      {/* Banner */}
      <div className="relative h-32 bg-gradient-to-r from-purple-600 to-blue-600">
        {data.banner_url && (
          <img
            src={data.banner_url}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Avatar and Basic Info */}
      <div className="relative px-4 pb-4">
        <div className="absolute -top-10 left-4">
          <div className="w-20 h-20 rounded-full bg-gray-700 border-4 border-gray-800 overflow-hidden">
            {data.avatar_url ? (
              <img
                src={data.avatar_url}
                alt={data.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500" />
            )}
          </div>
        </div>

        <div className="pt-12">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">{data.name}</h2>
            {data.is_verified && <FiCheck className="text-blue-500" />}
          </div>

          <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <FiUsers />
              {data.subscriber_count.toLocaleString()} seguidores
            </span>
          </div>

          {/* Description */}
          <p className="mt-4 text-gray-300 text-sm line-clamp-3">
            {data.description || 'Sem descrição'}
          </p>

          {/* Tags */}
          {data.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {data.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Category and Language */}
          <div className="flex items-center gap-2 mt-4">
            <span className="px-3 py-1 bg-purple-600/20 rounded-full text-xs text-purple-400">
              {data.category}
            </span>
            <span className="px-3 py-1 bg-blue-600/20 rounded-full text-xs text-blue-400">
              {data.language}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
