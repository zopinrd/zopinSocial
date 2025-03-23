import { useState } from 'react';
import { LiveStream } from '../../types/liveCatalog';
import { Link } from 'react-router-dom';
import { FiUsers, FiCheck, FiPlay } from 'react-icons/fi';

interface LiveCardProps {
  live: LiveStream;
}

export function LiveCard({ live }: LiveCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="group relative bg-gray-800 rounded-lg overflow-hidden transition-transform hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video">
        <img 
          src={live.thumbnailUrl} 
          alt={live.title}
          className="w-full h-full object-cover"
        />
        
        {/* Live Badge */}
        <div className="absolute top-2 left-2 px-2 py-1 bg-red-600 text-white text-xs font-medium rounded">
          AO VIVO
        </div>
        
        {/* Viewer Count */}
        <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-xs font-medium rounded flex items-center gap-1">
          <FiUsers className="w-3 h-3" />
          {live.viewerCount.toLocaleString()}
        </div>

        {/* Quality Badge */}
        {live.quality === '4K' && (
          <div className="absolute bottom-2 right-2 px-2 py-1 bg-purple-600 text-white text-xs font-medium rounded">
            4K
          </div>
        )}

        {/* Play Button Overlay */}
        <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <Link 
            to={`/live/${live.id}`}
            className="px-4 py-2 bg-purple-600 text-white rounded-full flex items-center gap-2 hover:bg-purple-700 transition-colors"
          >
            <FiPlay />
            Assistir agora
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="flex items-start gap-3">
          {/* Channel Avatar */}
          <Link to={`/channel/${live.channel.id}`} className="flex-shrink-0">
            <img 
              src={live.channel.avatarUrl} 
              alt={live.channel.name}
              className="w-10 h-10 rounded-full"
            />
          </Link>

          <div className="min-w-0 flex-1">
            {/* Title */}
            <h3 className="text-white font-medium text-sm line-clamp-2 mb-1">
              {live.title}
            </h3>

            {/* Channel Name */}
            <div className="flex items-center gap-1 text-gray-400 text-sm">
              <span className="truncate">{live.channel.name}</span>
              {live.channel.isVerified && (
                <FiCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
              )}
              {live.channel.isNew && (
                <span className="flex-shrink-0 px-1.5 py-0.5 bg-purple-600/20 text-purple-400 text-xs rounded">
                  Novo
                </span>
              )}
            </div>

            {/* Category and Tags */}
            <div className="mt-2 flex flex-wrap gap-1">
              <span className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">
                {live.category}
              </span>
              {live.tags.slice(0, 2).map(tag => (
                <span 
                  key={tag}
                  className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
