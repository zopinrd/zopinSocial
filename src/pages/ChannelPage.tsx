import { useState } from 'react';
import { Header } from '../components/layout/Header';
import { LeftSidebar } from '../components/sidebar/LeftSidebar';
import { RightSidebar } from '../components/sidebar/RightSidebar';
import { Users, Mail, Calendar } from 'lucide-react';

// Mock data
const channelData = {
  id: '1',
  name: 'Sarah Dance',
  bannerUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
  subscribers: 128000,
  description: 'Canal dedicado à dança e coreografias. Aulas, tutoriais e muita diversão! 💃',
  longDescription: 'Bem-vindos ao meu canal! Sou professora de dança há 10 anos e amo compartilhar minha paixão pela dança. Aqui você encontra tutoriais de diversos estilos, desde iniciante até avançado. Posto novos vídeos toda segunda e quinta!',
  email: 'contato@sarahdance.com',
  createdAt: '2022-03-15',
  isSubscribed: false
};

const videos = [
  {
    id: '1',
    title: 'Tutorial de Dança: Passos Básicos de Forró',
    thumbnailUrl: 'https://images.unsplash.com/photo-1545128485-c400e7702796',
    views: 45200,
    createdAt: '2025-03-20',
    duration: '12:45'
  },
  {
    id: '2',
    title: 'Coreografia: Hit do Verão 2025',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
    views: 32100,
    createdAt: '2025-03-18',
    duration: '08:30'
  },
  {
    id: '3',
    title: 'Aula de Aquecimento: 10 minutos',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b',
    views: 28900,
    createdAt: '2025-03-15',
    duration: '10:00'
  },
  {
    id: '4',
    title: 'Dança Contemporânea para Iniciantes',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea',
    views: 19800,
    createdAt: '2025-03-12',
    duration: '15:20'
  },
  {
    id: '5',
    title: 'Treino de Ritmo e Coordenação',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519925610903-381054cc2a1c',
    views: 23400,
    createdAt: '2025-03-10',
    duration: '09:15'
  },
  {
    id: '6',
    title: 'Coreografia #ZopinDance Challenge',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518611507436-f9221403cca2',
    views: 52300,
    createdAt: '2025-03-08',
    duration: '11:30'
  }
];

const playlists = [
  {
    id: '1',
    title: 'Iniciantes',
    thumbnailUrl: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea',
    videoCount: 25
  },
  {
    id: '2',
    title: 'Coreografias Completas',
    thumbnailUrl: 'https://images.unsplash.com/photo-1519925610903-381054cc2a1c',
    videoCount: 42
  },
  {
    id: '3',
    title: 'Treinos em Casa',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518611507436-f9221403cca2',
    videoCount: 18
  },
  {
    id: '4',
    title: 'Danças Latinas',
    thumbnailUrl: 'https://images.unsplash.com/photo-1545128485-c400e7702796',
    videoCount: 31
  },
  {
    id: '5',
    title: 'Desafios de Dança',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
    videoCount: 15
  },
  {
    id: '6',
    title: 'Aulas Completas',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b',
    videoCount: 28
  }
];

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR');
};

const VideoCard = ({ video }: { video: typeof videos[0] }) => (
  <div className="group cursor-pointer">
    <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
      <img
        src={video.thumbnailUrl}
        alt={video.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
      />
      <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
        {video.duration}
      </span>
    </div>
    <h3 className="font-medium text-sm line-clamp-2 group-hover:text-purple-400">
      {video.title}
    </h3>
    <p className="text-gray-400 text-xs mt-1">
      {formatNumber(video.views)} visualizações • {formatDate(video.createdAt)}
    </p>
  </div>
);

const PlaylistCard = ({ playlist }: { playlist: typeof playlists[0] }) => (
  <div className="group cursor-pointer">
    <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
      <img
        src={playlist.thumbnailUrl}
        alt={playlist.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
      />
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-white">Ver playlist</span>
      </div>
    </div>
    <h3 className="font-medium text-sm group-hover:text-purple-400">
      {playlist.title}
    </h3>
    <p className="text-gray-400 text-xs mt-1">
      {playlist.videoCount} vídeos
    </p>
  </div>
);

const TabButton = ({ 
  active, 
  children, 
  onClick 
}: { 
  active: boolean; 
  children: React.ReactNode; 
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-6 py-2 font-medium text-sm transition-colors ${
      active
        ? 'text-purple-400 border-b-2 border-purple-400'
        : 'text-gray-400 hover:text-white'
    }`}
  >
    {children}
  </button>
);

export const ChannelPage = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'videos' | 'playlists' | 'about'>('home');
  const [isSubscribed, setIsSubscribed] = useState(channelData.isSubscribed);

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
            {/* Channel Banner */}
            <div className="relative mb-6">
              <div className="aspect-[16/4] rounded-lg overflow-hidden">
                <img
                  src={channelData.bannerUrl}
                  alt="Channel Banner"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Channel Info Overlay */}
              <div className="absolute -bottom-16 left-0 right-0 px-4">
                <div className="flex items-end gap-4">
                  <img
                    src={channelData.avatarUrl}
                    alt={channelData.name}
                    className="w-24 h-24 rounded-full border-4 border-gray-900"
                  />
                  <div className="flex-grow pb-2">
                    <h1 className="text-2xl font-bold">{channelData.name}</h1>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Users size={16} />
                      <span>{formatNumber(channelData.subscribers)} inscritos</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsSubscribed(!isSubscribed)}
                    className={`px-6 py-2 rounded-full font-medium transition-colors ${
                      isSubscribed
                        ? 'bg-gray-700 hover:bg-gray-600'
                        : 'bg-purple-600 hover:bg-purple-500'
                    }`}
                  >
                    {isSubscribed ? 'Inscrito' : 'Inscrever-se'}
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="mt-20 mb-6 border-b border-gray-800">
              <nav className="flex gap-2">
                <TabButton
                  active={activeTab === 'home'}
                  onClick={() => setActiveTab('home')}
                >
                  Início
                </TabButton>
                <TabButton
                  active={activeTab === 'videos'}
                  onClick={() => setActiveTab('videos')}
                >
                  Vídeos
                </TabButton>
                <TabButton
                  active={activeTab === 'playlists'}
                  onClick={() => setActiveTab('playlists')}
                >
                  Playlists
                </TabButton>
                <TabButton
                  active={activeTab === 'about'}
                  onClick={() => setActiveTab('about')}
                >
                  Sobre
                </TabButton>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="pb-8">
              {activeTab === 'home' && (
                <div className="space-y-8">
                  <section>
                    <h2 className="text-lg font-medium mb-4">Vídeos em destaque</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {videos.slice(0, 3).map(video => (
                        <VideoCard key={video.id} video={video} />
                      ))}
                    </div>
                  </section>
                  <section>
                    <h2 className="text-lg font-medium mb-4">Playlists populares</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {playlists.slice(0, 3).map(playlist => (
                        <PlaylistCard key={playlist.id} playlist={playlist} />
                      ))}
                    </div>
                  </section>
                </div>
              )}

              {activeTab === 'videos' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {videos.map(video => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              )}

              {activeTab === 'playlists' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {playlists.map(playlist => (
                    <PlaylistCard key={playlist.id} playlist={playlist} />
                  ))}
                </div>
              )}

              {activeTab === 'about' && (
                <div className="space-y-6">
                  <section>
                    <h2 className="text-lg font-medium mb-2">Descrição</h2>
                    <p className="text-gray-300 whitespace-pre-line">
                      {channelData.longDescription}
                    </p>
                  </section>
                  <section>
                    <h2 className="text-lg font-medium mb-2">Detalhes</h2>
                    <div className="space-y-3 text-gray-300">
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-400" />
                        <span>Para contato profissional: </span>
                        <a
                          href={`mailto:${channelData.email}`}
                          className="text-purple-400 hover:underline"
                        >
                          {channelData.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span>
                          Entrou em {formatDate(channelData.createdAt)}
                        </span>
                      </div>
                    </div>
                  </section>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};
