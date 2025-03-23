import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { LeftSidebar } from '../components/sidebar/LeftSidebar';
import { GroupHeader } from '../components/group/GroupHeader';
import { GroupTabs } from '../components/group/GroupTabs';
import { PostCard } from '../components/group/PostCard';
import { useAuth } from '../hooks/useAuth';
import { mockGroup, mockMembers, mockPosts } from '../mocks/groupData';
import { Search, SlidersHorizontal } from 'lucide-react';

export const GroupPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('discussions');
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    sortBy: 'recent',
    type: 'all',
    timeframe: 'all'
  });

  useEffect(() => {
    if (!id) {
      navigate('/');
      return;
    }

    // Simula verificação de membro/admin
    const member = mockMembers.find((m) => m.userId === user?.id);
    setIsMember(!!member);
    setIsAdmin(member?.role === 'admin');
  }, [user, id, navigate]);

  const handleJoinLeave = () => {
    setIsMember(!isMember);
  };

  const handleShare = (postId: string) => {
    console.log('Share:', { postId });
  };

  const handlePin = (postId: string) => {
    console.log('Pin:', { postId });
  };

  const handleDelete = (postId: string) => {
    console.log('Delete:', { postId });
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const renderFilters = () => (
    <div className={`${showFilters ? 'block' : 'hidden'} absolute right-0 top-12 w-64 bg-gray-800 rounded-lg shadow-lg p-4 z-10`}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Ordenar por</label>
          <select
            value={selectedFilters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="recent">Mais recentes</option>
            <option value="popular">Mais populares</option>
            <option value="comments">Mais comentados</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Tipo</label>
          <select
            value={selectedFilters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Todos</option>
            <option value="text">Texto</option>
            <option value="media">Mídia</option>
            <option value="poll">Enquetes</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Período</label>
          <select
            value={selectedFilters.timeframe}
            onChange={(e) => handleFilterChange('timeframe', e.target.value)}
            className="w-full bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Todo período</option>
            <option value="today">Hoje</option>
            <option value="week">Esta semana</option>
            <option value="month">Este mês</option>
            <option value="year">Este ano</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'discussions':
        return (
          <div>
            {/* Search and Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar nas discussões..."
                  className="w-full bg-gray-800 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 hover:text-white rounded-lg transition-colors"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  <span>Filtros</span>
                </button>
                {renderFilters()}
              </div>
            </div>

            {/* Post Creation */}
            {isMember && (
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <div className="flex gap-4">
                  <img
                    src={user?.user_metadata?.avatar_url || 'https://picsum.photos/32'}
                    alt="Your avatar"
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Iniciar uma discussão..."
                      className="w-full bg-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Posts List */}
            <div className="space-y-4">
              {mockPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  isAdmin={isAdmin}
                  isMember={isMember}
                  onReaction={() => {}}
                  onComment={() => {}}
                  onShare={handleShare}
                  onPin={handlePin}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        );
      case 'members':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockMembers.map((member) => (
              <div key={member.userId} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{member.name}</h3>
                    <p className="text-sm text-gray-400">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return <div>Em construção...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-24">
          {/* Fixed Left Sidebar */}
          <div className="hidden lg:block lg:col-span-2 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
            <LeftSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-10">
            {/* Group Banner */}
            <div className="relative mb-6">
              <div className="aspect-[16/4] rounded-lg overflow-hidden">
                <img
                  src={mockGroup.bannerUrl}
                  alt="Group Banner"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Group Info Overlay */}
              <div className="absolute -bottom-16 left-0 right-0 px-4">
                <GroupHeader
                  group={mockGroup}
                  isMember={isMember}
                  isAdmin={isAdmin}
                  onJoinLeave={handleJoinLeave}
                />
              </div>
            </div>

            {/* Content Area (with top margin for header overlap) */}
            <div className="mt-20">
              <GroupTabs activeTab={activeTab} onTabChange={setActiveTab} isAdmin={isAdmin} />
              <div className="mt-6">{renderTabContent()}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
