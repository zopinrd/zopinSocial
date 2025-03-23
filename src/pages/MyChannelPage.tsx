import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { LeftSidebar } from '../components/sidebar/LeftSidebar';
import { channelService } from '../services/channelService';
import type { Channel } from '../types/channel';
import { toast } from 'react-hot-toast';
import { FiSettings } from 'react-icons/fi';

export function MyChannelPage() {
  const [channel, setChannel] = useState<Channel | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadChannel() {
      try {
        const { data, error } = await channelService.getCurrentUserChannel();
        if (error) throw error;
        
        if (!data) {
          // Se não tem canal, redireciona para criar
          navigate('/create-channel');
          return;
        }

        setChannel(data);
      } catch (error) {
        console.error('Error loading channel:', error);
        toast.error('Erro ao carregar canal');
      } finally {
        setLoading(false);
      }
    }

    loadChannel();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!channel) {
    return null; // Já foi redirecionado para create-channel
  }

  return (

    <div className="min-h-screen bg-gray-900 text-white">
      <Header />

      <main className="container mx-auto px-4 max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-24">
          {/* Fixed Left Sidebar */}
          <div className="hidden lg:block lg:col-span-2 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
            <LeftSidebar />
          </div>

          <div className="lg:col-span-10">
            {/* Banner */}
            <div className="relative h-48 md:h-64 rounded-lg overflow-hidden mb-6">
              <img 
                src={channel.banner_url || '/default-banner.jpg'} 
                alt="Channel banner"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Channel Info */}
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Avatar */}
              <div className="relative -mt-16 md:-mt-20 z-10">
                <img
                  src={channel.avatar_url || '/default-avatar.jpg'}
                  alt="Channel avatar"
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
              </div>

              {/* Channel Details */}
              <div className="flex-1">
                <div className="flex flex-col">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <h1 className="text-2xl font-bold">{channel.name}</h1>
                      {channel.is_verified && (
                        <span className="text-blue-500">
                          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </div>
                    
                    {/* Settings Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                      >
                        <FiSettings className="w-6 h-6" />
                      </button>
                      
                      {showSettings && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 z-50">
                          <button
                            onClick={() => navigate('/edit-channel')}
                            className="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors"
                          >
                            Editar Canal
                          </button>
                          <button
                            onClick={() => navigate('/studio')}
                            className="w-full px-4 py-2 text-left hover:bg-gray-700 transition-colors"
                          >
                            Studio
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-400 mt-2">{channel.subscriber_count.toLocaleString()} inscritos</p>
                  <p className="text-gray-300 mt-2">{channel.description}</p>
                </div>
              </div>

              {/* Stats */}
              {channel.is_verified && (
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center text-purple-500">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Verificado</span>
                  </div>
                </div>
              )}
            </div>

            {/* Content Tabs */}
            <div className="mt-8 border-b border-gray-200 dark:border-gray-700">
              <nav className="flex gap-8">
                <button className="px-1 py-4 text-purple-500 border-b-2 border-purple-500 font-medium">
                  Início
                </button>
                <button className="px-1 py-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  Vídeos
                </button>
                <button className="px-1 py-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  Playlists
                </button>
                <button className="px-1 py-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  Sobre
                </button>
              </nav>
            </div>

            {/* Channel Content */}
            <div className="mt-8">
              {/* Placeholder para conteúdo futuro */}
              <div className="text-center text-gray-500 dark:text-gray-400">
                <p>Nenhum conteúdo publicado ainda</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
