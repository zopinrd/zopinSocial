import { useState } from 'react';
import { Group } from '../../types/group';
import { Edit, Users } from 'lucide-react';

interface GroupHeaderProps {
  group: Group;
  isAdmin: boolean;
  isMember: boolean;
  onJoinLeave: () => void;
}

export const GroupHeader = ({ group, isAdmin, isMember, onJoinLeave }: GroupHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="relative">
      {/* Banner */}
      <div className="relative h-64 bg-gradient-to-r from-purple-600 to-pink-500">
        {group.bannerUrl && (
          <img
            src={group.bannerUrl}
            alt={`${group.name} banner`}
            className="w-full h-full object-cover"
          />
        )}
        {isAdmin && (
          <button className="absolute bottom-4 right-4 p-2 rounded-full bg-gray-900/80 text-white hover:bg-gray-800/80 transition-colors">
            <Edit className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Group Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 sm:-mt-24 pb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
            {/* Avatar */}
            <div className="relative">
              <img
                src={group.avatarUrl}
                alt={`${group.name} avatar`}
                className="w-32 h-32 rounded-full border-4 border-gray-900 object-cover"
              />
              {isAdmin && (
                <button className="absolute bottom-0 right-0 p-2 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Group Details */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-white">{group.name}</h1>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-400 mt-2">
                <Users className="w-5 h-5" />
                <span>{group.memberCount.toLocaleString()} membros</span>
              </div>
              <p className="text-gray-300 mt-2 max-w-2xl">{group.description}</p>
            </div>

            {/* Join/Leave Button */}
            <div className="mt-4 sm:mt-0">
              <button
                onClick={onJoinLeave}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  isMember
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-purple-500 text-white hover:bg-purple-600'
                }`}
              >
                {isMember ? 'Sair do grupo' : 'Entrar no grupo'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
