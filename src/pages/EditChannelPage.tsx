import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { LeftSidebar } from '../components/sidebar/LeftSidebar';
import { channelService } from '../services/channelService';
import type { Channel } from '../types/channel';
import { toast } from 'react-hot-toast';

type ChannelType = 'personal' | 'brand' | 'community' | 'store';
type ChannelVisibility = 'public' | 'private' | 'followers';
type ChannelAudience = 'general' | 'kids' | 'adult';

interface FormData {
  name: string;
  description: string;
  type: ChannelType;
  visibility: ChannelVisibility;
  category: string;
  language: string;
  location: string;
  audience: ChannelAudience;
  avatar_url: string;
  banner_url: string;
}

export function EditChannelPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [channel, setChannel] = useState<Channel | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    type: 'personal',
    visibility: 'public',
    category: '',
    language: '',
    location: '',
    audience: 'general',
    avatar_url: '',
    banner_url: ''
  });

  useEffect(() => {
    async function loadChannel() {
      try {
        const { data, error } = await channelService.getCurrentUserChannel();
        if (error) throw error;
        
        if (!data) {
          navigate('/create-channel');
          return;
        }

        setChannel(data);
        setFormData({
          name: data.name,
          description: data.description || '',
          type: (data.type as ChannelType) || 'personal',
          visibility: (data.visibility as ChannelVisibility) || 'public',
          category: data.category || '',
          language: data.language || '',
          location: data.location || '',
          audience: (data.audience as ChannelAudience) || 'general',
          avatar_url: data.avatar_url || '',
          banner_url: data.banner_url || ''
        });
      } catch (error) {
        console.error('Error loading channel:', error);
        toast.error('Erro ao carregar canal');
      } finally {
        setLoading(false);
      }
    }

    loadChannel();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!channel) return;

    try {
      setSaving(true);

      // Upload new images if selected
      let updates = { ...formData };

      if (avatarFile) {
        const { data: avatarData, error: avatarError } = await channelService.uploadFile(avatarFile, `channels/${channel.id}/avatar`, 'avatar');
        if (avatarError) throw avatarError;
        updates.avatar_url = avatarData.publicUrl;
      }

      if (bannerFile) {
        const { data: bannerData, error: bannerError } = await channelService.uploadFile(bannerFile, `channels/${channel.id}/banner`, 'banner');
        if (bannerError) throw bannerError;
        updates.banner_url = bannerData.publicUrl;
      }

      const { error } = await channelService.updateChannel(channel.id, updates);
      
      if (error) throw error;
      
      toast.success('Canal atualizado com sucesso!');
      navigate('/my-channel');
    } catch (error) {
      console.error('Error updating channel:', error);
      toast.error('Erro ao atualizar canal');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (name === 'type') {
        return { ...prev, type: value as ChannelType };
      }
      if (name === 'visibility') {
        return { ...prev, visibility: value as ChannelVisibility };
      }
      if (name === 'audience') {
        return { ...prev, audience: value as ChannelAudience };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Arquivo muito grande. Máximo 5MB.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione uma imagem.');
      return;
    }

    if (e.target.name === 'avatar') {
      setAvatarFile(file);
    } else if (e.target.name === 'banner') {
      setBannerFile(file);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
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
            <div className="bg-gray-800 rounded-lg p-6">
              <h1 className="text-2xl font-bold mb-6">Editar Canal</h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Preview Banner */}
                <div className="relative h-48 md:h-64 rounded-lg overflow-hidden mb-6">
                  <img
                    src={bannerFile ? URL.createObjectURL(bannerFile) : (formData.banner_url || '/default-banner.jpg')}
                    alt="Channel banner"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <label className="px-4 py-2 bg-purple-500 text-white rounded-lg cursor-pointer hover:bg-purple-600">
                      Alterar Banner
                      <input
                        type="file"
                        name="banner"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Preview Avatar */}
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <img
                    src={avatarFile ? URL.createObjectURL(avatarFile) : (formData.avatar_url || '/default-avatar.jpg')}
                    alt="Channel avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <label className="px-4 py-2 bg-purple-500 text-white rounded-lg cursor-pointer hover:bg-purple-600">
                      Alterar Avatar
                      <input
                        type="file"
                        name="avatar"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Nome do Canal */}
                <div>
                  <label className="block text-sm font-medium mb-2">Nome do Canal</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-sm font-medium mb-2">Descrição</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Tipo do Canal */}
                <div>
                  <label className="block text-sm font-medium mb-2">Tipo do Canal</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="personal">Pessoal</option>
                    <option value="brand">Marca</option>
                    <option value="community">Comunidade</option>
                    <option value="store">Loja</option>
                  </select>
                </div>

                {/* Visibilidade */}
                <div>
                  <label className="block text-sm font-medium mb-2">Visibilidade</label>
                  <select
                    name="visibility"
                    value={formData.visibility}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="public">Público</option>
                    <option value="private">Privado</option>
                    <option value="followers">Apenas Seguidores</option>
                  </select>
                </div>

                {/* Categoria */}
                <div>
                  <label className="block text-sm font-medium mb-2">Categoria</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Idioma */}
                <div>
                  <label className="block text-sm font-medium mb-2">Idioma</label>
                  <input
                    type="text"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Localização */}
                <div>
                  <label className="block text-sm font-medium mb-2">Localização</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Público */}
                <div>
                  <label className="block text-sm font-medium mb-2">Público</label>
                  <select
                    name="audience"
                    value={formData.audience}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="general">Geral</option>
                    <option value="kids">Infantil</option>
                    <option value="adult">Adulto</option>
                  </select>
                </div>

                {/* Botões */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/my-channel')}
                    className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
