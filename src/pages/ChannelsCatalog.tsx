import { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { LeftSidebar } from '../components/sidebar/LeftSidebar';
import { ChannelCard } from '../components/channel/ChannelCard';
import { FeaturedChannels } from '../components/channel/FeaturedChannels';
import { Channel, ChannelType, SortOption, ChannelFilters, ChannelStatus } from '../types/channel';
import { FiSearch, FiGrid, FiList, FiFilter } from 'react-icons/fi';

// Mock data
const mockChannels: Channel[] = Array.from({ length: 24 }, (_, i) => ({
  id: i.toString(),
  name: `Canal ${i + 1}`,
  description: `Descrição do canal ${i + 1}. Este é um canal ${['pessoal', 'marca', 'comunidade', 'loja'][i % 4]}.`,
  avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
  banner_url: `https://picsum.photos/seed/${i}/800/200`,
  type: ['personal', 'brand', 'community', 'store'][i % 4] as ChannelType,
  visibility: 'public',
  category: ['Games', 'Música', 'Educação', 'Vendas', 'Tecnologia'][i % 5],
  language: 'pt-BR',
  subscriber_count: Math.floor(Math.random() * 1000000),
  is_verified: i % 5 === 0,
  is_live: i % 7 === 0,
  is_new: i % 11 === 0,
  is_followed: i % 4 === 0,
  tags: ['tag1', 'tag2', 'tag3'].map(t => `${t}-${i}`),
  audience: 'general',
  settings: {
    allow_comments: true,
    allow_live_streams: true,
    allow_shorts: true,
    theme: 'auto',
    two_factor_auth: false,
  },
  social_links: {},
  created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
  last_active: new Date(Date.now() - Math.random() * 1000000).toISOString(),
}));

const categories = [
  'Games',
  'Música',
  'Educação',
  'Vendas',
  'Tecnologia',
  'Lifestyle',
  'Esportes',
  'Arte',
];

const languages = [
  { code: 'pt-BR', name: 'Português' },
  { code: 'en-US', name: 'English' },
  { code: 'es-ES', name: 'Español' },
];

const channelTypes: { value: ChannelType; label: string }[] = [
  { value: 'personal', label: 'Pessoal' },
  { value: 'brand', label: 'Marca' },
  { value: 'community', label: 'Comunidade' },
  { value: 'store', label: 'Loja' },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'popular', label: 'Mais populares' },
  { value: 'recent', label: 'Mais recentes' },
  { value: 'active', label: 'Mais ativos' },
  { value: 'recommended', label: 'Recomendados' },
];

export function ChannelsCatalog() {
  const [channels, setChannels] = useState<Channel[]>(mockChannels);
  const [featuredChannels] = useState<Channel[]>(mockChannels.slice(0, 6));
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ChannelFilters>({
    search: '',
    sort_by: 'popular',
  });

  useEffect(() => {
    // loadChannels();
  }, [filters]);

  // async function loadChannels() {
  //   try {
  //     const { data, error } = await channelService.getChannels(filters);
  //     if (error) throw error;
  //     setChannels(data || []);
  //   } catch (error) {
  //     console.error('Error loading channels:', error);
  //   }
  // }

  const handleFollow = async (channelId: string) => {
    setChannels(prev => prev.map(channel => 
      channel.id === channelId
        ? { ...channel, is_followed: !channel.is_followed }
        : channel
    ));
  };

  const handleFilterChange = (key: keyof ChannelFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredChannels = channels.filter(channel => {
    if (filters.search && !channel.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.category && channel.category !== filters.category) {
      return false;
    }
    if (filters.language && channel.language !== filters.language) {
      return false;
    }
    if (filters.type && channel.type !== filters.type) {
      return false;
    }
    if (filters.status?.length) {
      const hasStatus = filters.status.some((status: ChannelStatus) => {
        if (status === 'live') return channel.is_live;
        if (status === 'new') return channel.is_new;
        if (status === 'verified') return channel.is_verified;
        return false;
      });
      if (!hasStatus) return false;
    }
    return true;
  });

  // Sort channels
  const sortedChannels = [...filteredChannels].sort((a, b) => {
    switch (filters.sort_by) {
      case 'popular':
        return b.subscriber_count - a.subscriber_count;
      case 'recent':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'active':
        return new Date(b.last_active).getTime() - new Date(a.last_active).getTime();
      case 'recommended':
        // Mock recommendation algorithm
        return (b.is_live ? 1 : 0) - (a.is_live ? 1 : 0) || 
               (b.is_verified ? 1 : 0) - (a.is_verified ? 1 : 0) ||
               b.subscriber_count - a.subscriber_count;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <main className="container mt-6 mx-auto px-4 max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-24">
          {/* Left Sidebar */}
          <div className="hidden lg:block lg:col-span-2 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
            <LeftSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-10">
            {/* Featured Channels */}
            <section className="mb-8">
              <FeaturedChannels channels={featuredChannels} />
            </section>

            {/* Filters Section */}
            <section className="mb-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar canais..."
                    value={filters.search || ''}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* View Toggle and Filters */}
                <div className="flex gap-2">
                  <div className="flex rounded-lg overflow-hidden">
                    <button
                      onClick={() => setLayout('grid')}
                      className={`p-2 ${
                        layout === 'grid'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      <FiGrid size={20} />
                    </button>
                    <button
                      onClick={() => setLayout('list')}
                      className={`p-2 ${
                        layout === 'list'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      <FiList size={20} />
                    </button>
                  </div>

                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg flex items-center gap-2 hover:bg-gray-700"
                  >
                    <FiFilter />
                    Filtros
                  </button>

                  <select
                    value={filters.sort_by}
                    onChange={(e) => handleFilterChange('sort_by', e.target.value)}
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Extended Filters */}
              {showFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-800 rounded-lg">
                  {/* Categories */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Categoria
                    </label>
                    <select
                      value={filters.category || ''}
                      onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Todas</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Language */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Idioma
                    </label>
                    <select
                      value={filters.language || ''}
                      onChange={(e) => handleFilterChange('language', e.target.value || undefined)}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Todos</option>
                      {languages.map(lang => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Channel Type */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tipo de Canal
                    </label>
                    <select
                      value={filters.type || ''}
                      onChange={(e) => handleFilterChange('type', e.target.value || undefined)}
                      className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Todos</option>
                      {channelTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Status
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.status?.includes('live')}
                          onChange={(e) => {
                            const status = filters.status || [];
                            handleFilterChange(
                              'status',
                              e.target.checked
                                ? [...status, 'live']
                                : status.filter(s => s !== 'live')
                            );
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm">Ao Vivo</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.status?.includes('new')}
                          onChange={(e) => {
                            const status = filters.status || [];
                            handleFilterChange(
                              'status',
                              e.target.checked
                                ? [...status, 'new']
                                : status.filter(s => s !== 'new')
                            );
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm">Novo</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.status?.includes('verified')}
                          onChange={(e) => {
                            const status = filters.status || [];
                            handleFilterChange(
                              'status',
                              e.target.checked
                                ? [...status, 'verified']
                                : status.filter(s => s !== 'verified')
                            );
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm">Verificado</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Channels Grid */}
            <section className={`grid gap-4 ${
              layout === 'grid'
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            }`}>
              {sortedChannels.map(channel => (
                <ChannelCard
                  key={channel.id}
                  channel={channel}
                  isFollowing={channel.is_followed}
                  onFollow={handleFollow}
                  layout={layout}
                />
              ))}
            </section>

            {/* Empty State */}
            {sortedChannels.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">Nenhum canal encontrado com os filtros selecionados.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
