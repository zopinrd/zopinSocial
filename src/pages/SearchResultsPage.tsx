import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchResultsHeader from '../components/search/SearchResultsHeader';
import SearchResultsFilters from '../components/search/SearchResultsFilters';
import SearchResultsList from '../components/search/SearchResultsList';
import type { ResultType, SearchResult } from '../types/search';
import { Header } from '../components/layout/Header';
import { LeftSidebar } from '../components/sidebar/LeftSidebar';
import { RightSidebar } from '../components/sidebar/RightSidebar';

export const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<ResultType>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    dateRange: '',
    author: '',
    location: '',
    sortBy: 'relevance'
  });

  const query = searchParams.get('q') || '';

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockResults: SearchResult[] = [
          {
            id: '1',
            type: 'videos',
            title: 'Como fazer um bolo de chocolate',
            description: 'Aprenda a fazer um delicioso bolo de chocolate caseiro',
            imageUrl: 'https://picsum.photos/400/300',
            avatarUrl: 'https://i.pravatar.cc/150?u=1',
            authorName: 'Ana Cozinha',
            date: '2 dias atrás',
            metrics: {
              views: 15000,
              likes: 1200
            }
          },
          {
            id: '2',
            type: 'channels',
            title: 'Dicas de Tecnologia',
            authorName: 'Dicas de Tecnologia',
            description: 'Canal dedicado a reviews e tutoriais de tecnologia',
            avatarUrl: 'https://i.pravatar.cc/150?u=2',
            metrics: {
              subscribers: 50000
            }
          },
          {
            id: '3',
            type: 'lives',
            title: 'Jogando Minecraft com inscritos',
            description: 'Live com inscritos jogando Minecraft',
            imageUrl: 'https://picsum.photos/400/300',
            avatarUrl: 'https://i.pravatar.cc/150?u=3',
            authorName: 'GameMaster',
            isLive: true,
            metrics: {
              viewers: 1500
            }
          },
          {
            id: '4',
            type: 'people',
            title: 'João Silva',
            username: '@joaosilva',
            description: 'Criador de conteúdo | Gamer | Tech',
            avatarUrl: 'https://i.pravatar.cc/150?u=4',
            location: 'São Paulo, Brasil',
            role: 'Content Creator',
            followers: 25000,
            following: 500
          },
          {
            id: '5',
            type: 'people',
            title: 'Maria Santos',
            username: '@mariasantos',
            description: 'Artista Digital | Ilustradora',
            avatarUrl: 'https://i.pravatar.cc/150?u=5',
            location: 'Rio de Janeiro, Brasil',
            role: 'Digital Artist',
            followers: 15000,
            following: 300
          }
        ];

        setResults(mockResults);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query, filters, activeTab]);

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <main className="container mt-6 mx-auto px-4 max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-24">
          {/* Left Sidebar */}
          <div className="hidden lg:block lg:col-span-2 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
            <LeftSidebar />
          </div>

          <div className="lg:col-span-7">
            <SearchResultsHeader query={query} />
            
            {/* Content Type Filters */}
            <div className="mt-6">
              <SearchResultsFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                resultCounts={{
                  all: results.length,
                  videos: results.filter(r => r.type === 'videos').length,
                  channels: results.filter(r => r.type === 'channels').length,
                  lives: results.filter(r => r.type === 'lives').length,
                  groups: results.filter(r => r.type === 'groups').length,
                  posts: results.filter(r => r.type === 'posts').length,
                  products: results.filter(r => r.type === 'products').length,
                  people: results.filter(r => r.type === 'people').length
                }}
              />
            </div>

            {/* Search Results */}
            <div className="mt-6">
              <SearchResultsList
                results={results}
                loading={loading}
                activeTab={activeTab}
                query={query}
              />
            </div>
          </div>
          <div className="hidden lg:block col-span-3 fixed-sidebar">
            <RightSidebar />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchResultsPage;
