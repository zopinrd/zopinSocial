import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  TrendingUp,
  Video,
  Users,
  Store,
  Settings,
  HelpCircle,
  PlayCircle,
  Radio,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const LeftSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const primaryMenu = [
    { icon: Home, label: 'Início', path: '/' },
    { icon: PlayCircle, label: 'Zopin X', path: '/shorts' },
    { icon: Radio, label: 'Ao Vivo', path: '/live' },
    { icon: Users, label: 'Grupos', path: '/group/1' },
    { icon: Video, label: 'Canais', path: '/channels' },
    { icon: TrendingUp, label: 'Tendências', path: '/trending' },
    { icon: Store, label: 'Loja', path: '/store' },
  ];

  const secondaryMenu = [
    { icon: Settings, label: 'Configurações', path: '/settings' },
    { icon: HelpCircle, label: 'Ajuda', path: '/help' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const MenuItem = ({ icon: Icon, label, path }: { icon: any; label: string; path: string }) => (
    <Link
      to={path}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive(path)
          ? 'text-white bg-gray-800'
          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );

  if (!user) return null;

  return (
    <div className="h-[calc(100vh-8rem)] overflow-y-auto">
      <nav className="space-y-6">
        {/* Primary Menu */}
        <div className="space-y-1">
          {primaryMenu.map((item) => (
            <MenuItem key={item.path} {...item} />
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-800" />

        {/* Secondary Menu */}
        <div className="space-y-1">
          {secondaryMenu.map((item) => (
            <MenuItem key={item.path} {...item} />
          ))}
        </div>
      </nav>
    </div>
  );
};
