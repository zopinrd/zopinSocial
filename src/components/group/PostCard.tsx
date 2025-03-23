import { useState } from 'react';
import type { GroupPost } from '../../types/group';
import {
  MessageCircle,
  Share2,
  MoreVertical,
  Pin,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PostCardProps {
  post: GroupPost;
  isAdmin: boolean;
  isMember: boolean;
  onReaction: (postId: string, reaction: string) => void;
  onComment: (postId: string, comment: string) => void;
  onShare: (postId: string) => void;
  onPin?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

export const PostCard = ({
  post,
  isAdmin,
  isMember,
  onReaction,
  onComment,
  onShare,
  onPin,
  onDelete,
}: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      {/* Post Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={post.author.avatarUrl}
            alt={post.author.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h3 className="font-semibold text-white">{post.author.name}</h3>
            <p className="text-sm text-gray-400">
              {formatDistanceToNow(new Date(post.createdAt), {
                addSuffix: true,
                locale: ptBR,
              })}
            </p>
          </div>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                {isAdmin && (
                  <>
                    <button
                      onClick={() => {
                        onPin?.(post.id);
                        setShowMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                    >
                      <Pin className="w-4 h-4 mr-2" />
                      {post.isPinned ? 'Desafixar' : 'Fixar'}
                    </button>
                    <button
                      onClick={() => {
                        onDelete?.(post.id);
                        setShowMenu(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </button>
                  </>
                )}
                <button
                  onClick={() => {
                    // Report post
                    setShowMenu(false);
                  }}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-600"
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Denunciar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p className="text-gray-300 whitespace-pre-wrap mb-4">{post.content}</p>
        
        {post.mediaUrl && (
          <div className="rounded-lg overflow-hidden">
            {post.mediaType === 'image' ? (
              <img
                src={post.mediaUrl}
                alt="Post media"
                className="w-full object-cover"
              />
            ) : (
              <video
                src={post.mediaUrl}
                controls
                className="w-full"
              />
            )}
          </div>
        )}

        {post.poll && (
          <div className="mt-4 bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-3">{post.poll?.question}</h4>
            <div className="space-y-2">
              {post.poll?.options.map((option) => {
                const percentage = (option.votes / post.poll!.totalVotes) * 100;
                return (
                  <div key={option.id} className="relative">
                    <div
                      className="absolute inset-0 bg-purple-500/20 rounded"
                      style={{ width: `${percentage}%` }}
                    />
                    <button
                      disabled={!isMember}
                      className="relative w-full p-3 text-left text-gray-300 hover:text-white rounded transition-colors"
                    >
                      <span className="font-medium">{option.text}</span>
                      <span className="absolute right-3 font-semibold">
                        {percentage.toFixed(1)}%
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-gray-400 mt-2">
              {post.poll.totalVotes} votos
            </p>
          </div>
        )}

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 rounded-full bg-gray-700 text-gray-300 text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="flex items-center justify-between border-t border-gray-700 pt-4">
        <div className="flex items-center gap-6">
          <div className="relative">
            <button
              onClick={() => setShowReactions(!showReactions)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              {post.reactions[0]?.type || '👍'}{' '}
              <span>
                {post.reactions.reduce((acc, r) => acc + r.count, 0)}
              </span>
            </button>

            {showReactions && (
              <div className="absolute bottom-full left-0 mb-2 p-2 bg-gray-700 rounded-lg shadow-lg flex gap-2">
                {['👍', '❤️', '😂', '😮', '😢', '😡'].map((reaction) => (
                  <button
                    key={reaction}
                    onClick={() => {
                      onReaction(post.id, reaction);
                      setShowReactions(false);
                    }}
                    className="text-2xl hover:scale-125 transition-transform"
                  >
                    {reaction}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>{post.commentCount}</span>
          </button>

          <button
            onClick={() => onShare(post.id)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {post.isPinned && (
          <div className="flex items-center gap-1 text-purple-400">
            <Pin className="w-4 h-4" />
            <span className="text-sm">Fixado</span>
          </div>
        )}
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          {isMember ? (
            <div className="flex gap-3 mb-4">
              <img
                src="https://picsum.photos/32"
                alt="Your avatar"
                className="w-8 h-8 rounded-full"
              />
              <input
                type="text"
                placeholder="Escreva um comentário..."
                className="flex-1 bg-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    onComment(post.id, e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          ) : (
            <p className="text-center text-gray-400 my-4">
              Entre no grupo para comentar
            </p>
          )}

          {/* Comment list would go here */}
        </div>
      )}
    </div>
  );
};
