import { Search, Bell, MessageSquare, TrendingUp, User, LogOut, Plus, Video, Radio, Users, PlayCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useState, useEffect } from 'react';
import { channelService } from '../../services/channelService';

export const Header = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [hasChannel, setHasChannel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function checkUserChannel() {
      if (user) {
        try {
          const { data } = await channelService.getCurrentUserChannel();
          setHasChannel(!!data);
        } catch (error) {
          console.error('Error checking user channel:', error);
        }
      }
    }

    checkUserChannel();
  }, [user]);

  const createOptions = [
    { icon: Video, label: 'Canal', path: '/channel/create' },
    { icon: PlayCircle, label: 'Post', path: '/post/create' },
    { icon: Radio, label: 'Live', path: '/live/create' },
    { icon: Users, label: 'Grupo', path: '/group/create' },
    { icon: Video, label: 'Vídeo Curto', path: '/shorts/create' },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  const handleProfileClick = () => {
    if (profile?.username) {
      console.log('👤 Header: Navegando para o perfil:', profile.username);
      navigate(`/${profile.username}`);
    } else {
      console.error('❌ Header: Username não encontrado no perfil');
      // Se não tiver username, tenta usar o ID do usuário
      if (user?.id) {
        console.log('🔄 Header: Usando ID do usuário como fallback:', user.id);
        navigate(`/${user.id}`);
      } else {
        console.error('❌ Header: Nenhum identificador disponível para navegação');
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-24 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800 z-50">
      <div className="container mx-auto h-full px-4 max-w-[1280px]">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Zopin
            </span>
            <TrendingUp className="w-6 h-6 text-purple-500" />
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar vídeos ou criadores"
                className="w-full bg-gray-800 text-white rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2">
                <Search className="w-5 h-5 text-gray-400 hover:text-white transition-colors" />
              </button>
            </div>
          </form>

          {/* Actions */}
          {user ? (
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full" />
              </button>
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <MessageSquare className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full" />
              </button>

              {/* Create Button with Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowCreateMenu(!showCreateMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-lg hover:from-purple-700 hover:to-purple-700 transition-all"
                  onBlur={() => setTimeout(() => setShowCreateMenu(false), 200)}
                >
                  <Plus className="w-6 h-6" />
                  <span className="text-sm font-medium">Criar</span>
                </button>

              {/* Create Menu Dropdown */}
              {showCreateMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
                  {createOptions.map((option) => {
                    if (option.label === 'Canal' && hasChannel) return null;
                    return (
                      <Link
                        key={option.path}
                        to={option.path}
                        className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        <option.icon className="w-5 h-5" />
                        <span className="text-sm">{option.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
              </div>

              {/* Profile Menu */}
              <div className="relative group">
                <button className="flex items-center gap-2 p-2 text-gray-400 hover:text-white transition-colors">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt={profile.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 py-2 bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-sm text-white font-medium truncate">
                      {profile?.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={handleProfileClick}
                    className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    Ver Perfil
                  </button>
                  <button
                    onClick={() => navigate('/my-channel')}
                    className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    Meu Canal
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-gray-700"
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Entrar
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-purple-600 to-purple-400 text-white px-4 py-2 rounded-full font-medium hover:opacity-90 transition-opacity"
              >
                Criar conta
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
