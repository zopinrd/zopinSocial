import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiMapPin, FiUser, FiVideo, FiCalendar } from 'react-icons/fi';
import { Header } from '../components/layout/Header';
import { LeftSidebar } from '../components/sidebar/LeftSidebar';
import { RightSidebar } from '../components/sidebar/RightSidebar';

interface UserProfile {
  id: string;
  username: string;
  name: string;
  avatarUrl: string;
  coverUrl: string;
  description: string;
  location: string;
  role: string;
  followers: number;
  following: number;
  joinDate: string;
  metrics: {
    videos: number;
    likes: number;
    views: number;
  };
}

export const UserProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'videos' | 'about'>('videos');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockProfile: UserProfile = {
          id: '1',
          username: username || '@joaosilva',
          name: 'João Silva',
          avatarUrl: 'https://i.pravatar.cc/150?u=4',
          coverUrl: 'https://picsum.photos/1920/400',
          description: 'Criador de conteúdo | Gamer | Tech',
          location: 'São Paulo, Brasil',
          role: 'Content Creator',
          followers: 25000,
          following: 500,
          joinDate: 'Março 2024',
          metrics: {
            videos: 156,
            likes: 450000,
            views: 2000000
          }
        };

        setProfile(mockProfile);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <p className="text-gray-400">Perfil não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <main className="container mt-6 mx-auto px-4 max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="hidden lg:block lg:col-span-2 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
            <LeftSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-7">
            {/* Cover Image */}
            <div className="relative h-48 md:h-64 rounded-lg overflow-hidden mb-6 pt-24">
              <img
                src={profile.coverUrl}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Profile Header */}
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16 md:-mt-20 mb-6 relative z-10">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-32 h-32 rounded-full border-4 border-gray-900"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-gray-400">{profile.username}</p>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-400">
                  {profile.role && (
                    <div className="flex items-center gap-1">
                      <FiUser className="w-4 h-4" />
                      <span>{profile.role}</span>
                    </div>
                  )}
                  {profile.location && (
                    <div className="flex items-center gap-1">
                      <FiMapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <FiCalendar className="w-4 h-4" />
                    <span>Entrou em {profile.joinDate}</span>
                  </div>
                </div>
              </div>
              <button className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
                Seguir
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold">{profile.metrics.videos}</div>
                <div className="text-sm text-gray-400">Vídeos</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold">{profile.followers.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Seguidores</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold">{profile.following.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Seguindo</div>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold">{profile.metrics.likes.toLocaleString()}</div>
                <div className="text-sm text-gray-400">Curtidas</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-800 mb-6">
              <div className="flex gap-6">
                <button
                  onClick={() => setActiveTab('videos')}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'videos'
                      ? 'border-purple-600 text-white'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FiVideo className="w-4 h-4" />
                    <span>Vídeos</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('about')}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'about'
                      ? 'border-purple-600 text-white'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FiUser className="w-4 h-4" />
                    <span>Sobre</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'videos' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mock Videos */}
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors">
                    <img
                      src={`https://picsum.photos/400/225?random=${i}`}
                      alt=""
                      className="w-full aspect-video object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-medium mb-2">Vídeo exemplo {i + 1}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>{Math.floor(Math.random() * 10000)} visualizações</span>
                        <span>•</span>
                        <span>{Math.floor(Math.random() * 30)} dias atrás</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-gray-400">{profile.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Estatísticas</h3>
                    <div className="space-y-2 text-sm text-gray-400">
                      <div className="flex justify-between">
                        <span>Total de visualizações</span>
                        <span>{profile.metrics.views.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total de curtidas</span>
                        <span>{profile.metrics.likes.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Vídeos publicados</span>
                        <span>{profile.metrics.videos}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Informações</h3>
                    <div className="space-y-2 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <FiMapPin className="w-4 h-4" />
                        <span>{profile.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiUser className="w-4 h-4" />
                        <span>{profile.role}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiCalendar className="w-4 h-4" />
                        <span>Membro desde {profile.joinDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block lg:col-span-3 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
            <RightSidebar />
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserProfilePage;
