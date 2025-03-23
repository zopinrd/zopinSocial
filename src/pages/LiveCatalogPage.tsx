import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { LeftSidebar } from '../components/sidebar/LeftSidebar';
import { LiveCard } from '../components/live/LiveCard';
import { LiveStream, Category, LiveCatalogFilters, SortOption } from '../types/liveCatalog';
import { FiSearch, FiFilter } from 'react-icons/fi';

// Mock data
const mockCategories: Category[] = [
  { id: '1', name: 'Dance', slug: 'dance', iconUrl: '🕺' },
  { id: '2', name: 'Cooking', slug: 'cooking', iconUrl: '👨‍🍳' },
  { id: '3', name: 'Tips & Tricks', slug: 'tips', iconUrl: '💡' },
  { id: '4', name: 'Lifestyle', slug: 'lifestyle', iconUrl: '🌟' },
  { id: '5', name: 'Educational', slug: 'educational', iconUrl: '📚' },
];

const mockLives: LiveStream[] = Array.from({ length: 12 }, (_, i) => ({
  id: i.toString(),
  title: `Live ${i + 1} - ${['Cooking Show', 'Dance Party', 'Study With Me', 'Tech Talk'][i % 4]}`,
  thumbnailUrl: `https://picsum.photos/seed/${i}/400/225`,
  viewerCount: Math.floor(Math.random() * 10000),
  startedAt: new Date().toISOString(),
  category: mockCategories[i % mockCategories.length].name,
  language: 'pt-BR',
  tags: ['Zopin', 'Live', mockCategories[i % mockCategories.length].slug],
  quality: i % 3 === 0 ? '4K' : '1080p',
  channel: {
    id: `channel-${i}`,
    name: `Creator ${i + 1}`,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
    isVerified: i % 3 === 0,
    isNew: i % 5 === 0,
    isFollowed: i % 4 === 0,
  },
}));

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'trending', label: 'Em alta' },
  { value: 'recent', label: 'Mais recentes' },
  { value: 'recommended', label: 'Recomendados' },
];

export function LiveCatalogPage() {
  const [lives] = useState<LiveStream[]>(mockLives);
  const [filters, setFilters] = useState<LiveCatalogFilters>({
    search: '',
    sortBy: 'trending',
    tags: [],
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  const handleCategoryChange = (categoryId: string) => {
    const category = mockCategories.find(c => c.id === categoryId);
    setFilters(prev => ({ ...prev, category: category?.slug }));
  };

  const handleSortChange = (sort: SortOption) => {
    setFilters(prev => ({ ...prev, sortBy: sort }));
  };

  const filteredLives = lives.filter(live => {
    if (filters.search && !live.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.category && live.category.toLowerCase() !== filters.category.toLowerCase()) {
      return false;
    }
    return true;
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
            {/* Filters Section */}
            <div className="mb-6 space-y-4">
              {/* Search and Sort */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar lives..."
                    value={filters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 bg-gray-800 text-white rounded-lg flex items-center gap-2 hover:bg-gray-700"
                  >
                    <FiFilter />
                    Filtros
                  </button>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleSortChange(e.target.value as SortOption)}
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none cursor-pointer"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Categories */}
              {showFilters && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 p-4 bg-gray-800 rounded-lg">
                  {mockCategories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                        filters.category === category.slug
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <span>{category.iconUrl}</span>
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Lives Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredLives.map(live => (
                <LiveCard key={live.id} live={live} />
              ))}
            </div>

            {/* No Results */}
            {filteredLives.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400">Nenhuma live encontrada com os filtros selecionados.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
