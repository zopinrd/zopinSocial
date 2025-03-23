import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  Video,
  Image as ImageIcon,
  ShoppingBag,
  Bookmark,
  Check,
  Edit,
  Settings,
  MapPin,
  Link as LinkIcon,
  User,
  Mail,
  Phone,
  Calendar,
  X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase, Profile } from '../lib/supabase';
import { Header } from '../components/layout/Header';
import { LeftSidebar } from '../components/sidebar/LeftSidebar';
import { RightSidebar } from '../components/sidebar/RightSidebar';

// Types
interface Badge {
  id: string;
  name: string;
  description: string;
  icon_url: string;
}

interface ImageCropModalProps {
  imageUrl: string;
  aspect: number;
  circularCrop?: boolean;
  onClose: () => void;
  onSave: (croppedImage: Blob) => void;
}

const ImageCropModal = ({ imageUrl, aspect, circularCrop, onClose, onSave }: ImageCropModalProps) => {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const onSaveClick = async () => {
    if (!completedCrop || !imgRef.current) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    ctx.drawImage(
      imgRef.current,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    canvas.toBlob((blob) => {
      if (blob) {
        onSave(blob);
      }
    }, 'image/jpeg');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-gray-800 p-6 rounded-lg max-w-2xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Ajustar Imagem</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="relative">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
            circularCrop={circularCrop}
          >
            <img
              ref={imgRef}
              src={imageUrl}
              alt="Crop"
              className="max-h-[60vh] w-full object-contain"
            />
          </ReactCrop>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onSaveClick}
            className="px-4 py-2 text-sm bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 font-medium rounded-lg transition-colors ${
      active
        ? 'bg-purple-600 text-white'
        : 'text-gray-400 hover:text-white hover:bg-gray-700'
    }`}
  >
    {children}
  </button>
);

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="flex flex-col items-center p-4 bg-gray-800 rounded-lg">
    <span className="text-2xl font-bold text-white">{value.toLocaleString()}</span>
    <span className="text-sm text-gray-400">{label}</span>
  </div>
);

const Badge = ({ badge }: { badge: Badge }) => (
  <div className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg">
    <img src={badge.icon_url} alt={badge.name} className="w-8 h-8" />
    <div>
      <h4 className="text-sm font-medium text-white">{badge.name}</h4>
      <p className="text-xs text-gray-400">{badge.description}</p>
    </div>
  </div>
);

const PersonalInfo = ({ profile }: { profile: Profile | null }) => (
  <div className="bg-gray-800 rounded-lg p-6 mt-6">
    <h3 className="text-xl font-semibold text-white mb-4">Informações Pessoais</h3>
    <div className="space-y-4">
      <div className="flex items-center text-gray-300">
        <Mail className="w-5 h-5 mr-3 text-gray-400" />
        <span>{profile?.email}</span>
      </div>
      {profile?.phone && (
        <div className="flex items-center text-gray-300">
          <Phone className="w-5 h-5 mr-3 text-gray-400" />
          <span>{profile.phone}</span>
        </div>
      )}
      {profile?.birth_date && (
        <div className="flex items-center text-gray-300">
          <Calendar className="w-5 h-5 mr-3 text-gray-400" />
          <span>
            {new Date(profile.birth_date).toLocaleDateString('pt-BR')}
          </span>
        </div>
      )}
      {profile?.gender && (
        <div className="flex items-center text-gray-300">
          <User className="w-5 h-5 mr-3 text-gray-400" />
          <span>{profile.gender}</span>
        </div>
      )}
    </div>
  </div>
);

export const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('posts');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [cropModalConfig, setCropModalConfig] = useState<{
    imageUrl: string;
    aspect: number;
    circularCrop: boolean;
    type: 'avatar' | 'banner';
  } | null>(null);

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      if (!username) {
        console.error('❌ ProfilePage: Identificador não fornecido');
        setLoading(false);
        return;
      }

      try {
        console.log('🔍 ProfilePage: Buscando perfil:', username);
        setLoading(true);

        // Primeiro tenta buscar por username
        let { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();

        // Se não encontrar por username, tenta por ID
        if (error || !data) {
          console.log('🔄 ProfilePage: Não encontrado por username, tentando por ID...');
          ({ data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', username)
            .single());
        }

        if (error) {
          console.error('❌ ProfilePage: Erro ao buscar perfil:', error);
          return;
        }

        console.log('✅ ProfilePage: Perfil encontrado:', data.username);
        setProfile(data);
      } catch (error) {
        console.error('❌ ProfilePage: Erro inesperado:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <main className="container mt-6 mx-auto px-4 max-w-[1280px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-24">
            {/* Fixed Left Sidebar */}
            <div className="hidden lg:block lg:col-span-2 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
              <LeftSidebar />
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-7 flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                <p className="text-gray-400">Carregando perfil...</p>
              </div>
            </div>

            {/* Fixed Right Sidebar */}
            <div className="hidden lg:block lg:col-span-3 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
              <RightSidebar />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Header />
        <main className="container mt-6 mx-auto px-4 max-w-[1280px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-24">
            {/* Fixed Left Sidebar */}
            <div className="hidden lg:block lg:col-span-2 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
              <LeftSidebar />
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center gap-4">
              <div className="text-white text-xl">Perfil não encontrado</div>
              <p className="text-gray-400">O perfil que você está procurando não existe.</p>
            </div>

            {/* Fixed Right Sidebar */}
            <div className="hidden lg:block lg:col-span-3 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
              <RightSidebar />
            </div>
          </div>
        </main>
      </div>
    );
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCropModalConfig({
          imageUrl: reader.result,
          aspect: type === 'avatar' ? 1 : 16/9,
          circularCrop: type === 'avatar',
          type
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCroppedImage = async (blob: Blob) => {
    if (!cropModalConfig) return;

    const { type } = cropModalConfig;
    const file = new File([blob], `cropped-${type}-${Date.now()}.jpg`, { type: 'image/jpeg' });

    if (type === 'avatar') {
      await handleAvatarUpload(file);
    } else {
      await handleBannerUpload(file);
    }

    setCropModalConfig(null);
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      console.log('📤 ProfilePage: Iniciando upload de avatar');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);

      if (uploadError) {
        console.error('❌ ProfilePage: Erro no upload:', uploadError);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user?.id);

      if (updateError) {
        console.error('❌ ProfilePage: Erro ao atualizar perfil:', updateError);
        return;
      }

      console.log('✅ ProfilePage: Avatar atualizado com sucesso');
      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);
    } catch (error) {
      console.error('❌ ProfilePage: Erro inesperado:', error);
    }
  };

  const handleBannerUpload = async (file: File) => {
    try {
      console.log('📤 ProfilePage: Iniciando upload de capa');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-banner-${Math.random()}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);

      if (uploadError) {
        console.error('❌ ProfilePage: Erro no upload da capa:', uploadError);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ banner_url: publicUrl })
        .eq('id', user?.id);

      if (updateError) {
        console.error('❌ ProfilePage: Erro ao atualizar capa:', updateError);
        return;
      }

      console.log('✅ ProfilePage: Capa atualizada com sucesso');
      setProfile(prev => prev ? { ...prev, banner_url: publicUrl } : null);
    } catch (error) {
      console.error('❌ ProfilePage: Erro inesperado:', error);
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      console.log('🗑️ ProfilePage: Removendo avatar');

      // Remove a URL do avatar do perfil
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: undefined })
        .eq('id', user?.id);

      if (updateError) {
        console.error('❌ ProfilePage: Erro ao remover avatar:', updateError);
        return;
      }

      console.log('✅ ProfilePage: Avatar removido com sucesso');
      setProfile(prev => prev ? { ...prev, avatar_url: undefined } : null);
    } catch (error) {
      console.error('❌ ProfilePage: Erro inesperado:', error);
    }
  };

  const handleRemoveBanner = async () => {
    try {
      console.log('🗑️ ProfilePage: Removendo capa');

      // Remove a URL da capa do perfil
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ banner_url: undefined })
        .eq('id', user?.id);

      if (updateError) {
        console.error('❌ ProfilePage: Erro ao remover capa:', updateError);
        return;
      }

      console.log('✅ ProfilePage: Capa removida com sucesso');
      setProfile(prev => prev ? { ...prev, banner_url: undefined } : null);
    } catch (error) {
      console.error('❌ ProfilePage: Erro inesperado:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header />
      <main className="container mt-6 mx-auto px-4 max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-24">
          {/* Fixed Left Sidebar */}
          <div className="hidden lg:block lg:col-span-2 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
            <LeftSidebar />
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-10">
            {/* Banner */}
            <div className="relative h-64 bg-gradient-to-r from-purple-600 to-pink-500 rounded-t-lg">
              {profile.banner_url && (
                <img
                  src={profile.banner_url}
                  alt="Profile banner"
                  className="w-full h-full object-cover rounded-t-lg"
                />
              )}
              {user?.id === profile.id && (
                <div className="absolute bottom-4 right-4">
                  <div className="relative group/menu">
                    <button className="p-2 rounded-full bg-gray-900/80 text-white hover:bg-gray-800/80 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    
                    {/* Menu Dropdown */}
                    <div className="absolute right-0 bottom-full mb-2 w-48 py-2 bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all">
                      <label className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 cursor-pointer">
                        {profile.banner_url ? 'Alterar Capa' : 'Adicionar Capa'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileSelect(e, 'banner')}
                        />
                      </label>
                      {profile.banner_url && (
                        <button
                          onClick={handleRemoveBanner}
                          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-gray-700"
                        >
                          Remover Capa
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Header */}
            <div className="bg-gray-800 rounded-b-lg shadow-lg p-6 -mt-1">
              <div className="sm:flex sm:items-center sm:justify-between">
                <div className="sm:flex sm:space-x-5">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="relative group">
                      <img
                        className="h-32 w-32 rounded-full border-4 border-gray-800"
                        src={profile.avatar_url || '/default-avatar.png'}
                        alt={profile.name}
                      />
                      {user?.id === profile.id && (
                        <div className="absolute -bottom-2 -right-2">
                          <div className="relative group/menu">
                            <button className="p-2 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            
                            {/* Menu Dropdown */}
                            <div className="absolute right-0 bottom-full mb-2 w-48 py-2 bg-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all">
                              <label className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-700 cursor-pointer">
                                {profile.avatar_url ? 'Alterar Foto' : 'Adicionar Foto'}
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleFileSelect(e, 'avatar')}
                                />
                              </label>
                              {profile.avatar_url && (
                                <button
                                  onClick={handleRemoveAvatar}
                                  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-gray-700"
                                >
                                  Remover Foto
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="mt-4 sm:mt-0 text-center sm:text-left">
                    <div className="flex items-center">
                      <h1 className="text-2xl font-bold text-white">
                        {profile.name}
                      </h1>
                      {profile.is_verified && (
                        <Check className="w-5 h-5 text-purple-500 ml-2" />
                      )}
                    </div>
                    <p className="text-sm text-gray-400">@{profile.username}</p>
                    {profile.bio && (
                      <p className="mt-2 text-gray-300 max-w-2xl">{profile.bio}</p>
                    )}
                    <div className="mt-2 flex items-center gap-4 text-gray-400">
                      {profile.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">{profile.location}</span>
                        </div>
                      )}
                      {profile.social_links?.website && (
                        <div className="flex items-center">
                          <LinkIcon className="w-4 h-4 mr-1" />
                          <a
                            href={profile.social_links.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm hover:text-purple-400 transition-colors"
                          >
                            Website
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {user?.id === profile.id ? (
                  <div className="mt-4 sm:mt-0">
                    <button className="inline-flex items-center px-4 py-2 border border-purple-500 rounded-lg text-sm font-medium text-purple-400 hover:bg-purple-500 hover:text-white transition-colors">
                      <Settings className="w-4 h-4 mr-2" />
                      Configurações Rápidas
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 sm:mt-0">
                    <button className="inline-flex items-center px-4 py-2 bg-purple-500 rounded-lg text-sm font-medium text-white hover:bg-purple-600 transition-colors">
                      Seguir
                    </button>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <StatCard label="Seguidores" value={profile.followers_count || 0} />
                <StatCard label="Seguindo" value={profile.following_count || 0} />
                <StatCard label="Posts" value={profile.posts_count || 0} />
              </div>
            </div>

            {/* Personal Info */}
            <PersonalInfo profile={profile} />

            {/* Content Tabs */}
            <div className="mt-6">
              <div className="flex gap-2 mb-4">
                <TabButton
                  active={activeTab === 'posts'}
                  onClick={() => setActiveTab('posts')}
                >
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    <span>Posts</span>
                  </div>
                </TabButton>
                <TabButton
                  active={activeTab === 'lives'}
                  onClick={() => setActiveTab('lives')}
                >
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    <span>Lives</span>
                  </div>
                </TabButton>
                <TabButton
                  active={activeTab === 'store'}
                  onClick={() => setActiveTab('store')}
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Loja</span>
                  </div>
                </TabButton>
                <TabButton
                  active={activeTab === 'saved'}
                  onClick={() => setActiveTab('saved')}
                >
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4" />
                    <span>Salvos</span>
                  </div>
                </TabButton>
              </div>

              {/* Tab Content */}
              <div className="bg-gray-800 rounded-lg p-6">
                {activeTab === 'posts' && (
                  <div className="text-gray-400">Nenhum post ainda</div>
                )}
                {activeTab === 'lives' && (
                  <div className="text-gray-400">Nenhuma live ainda</div>
                )}
                {activeTab === 'store' && (
                  <div className="text-gray-400">Nenhum item na loja</div>
                )}
                {activeTab === 'saved' && (
                  <div className="text-gray-400">Nenhum item salvo</div>
                )}
              </div>
            </div>

            {/* Badges */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-white mb-4">Conquistas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Add badges here */}
              </div>
            </div>
          </div>

          {/* Fixed Right Sidebar */}
          
        </div>
      </main>
      {cropModalConfig && (
        <ImageCropModal
          imageUrl={cropModalConfig.imageUrl}
          aspect={cropModalConfig.aspect}
          circularCrop={cropModalConfig.circularCrop}
          onClose={() => setCropModalConfig(null)}
          onSave={handleCroppedImage}
        />
      )}
    </div>
  );
};
