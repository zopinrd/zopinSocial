import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { channelService } from '../services/channelService';
import { ChannelType } from '../types/channel';

interface FormData {
  name: string;
  description: string;
  avatar_url: string;
  banner_url: string;
  type: ChannelType;
  visibility: 'public' | 'private' | 'followers';
  category: string;
  language: string;
  audience: 'general' | 'kids' | 'adult';
  settings: {
    allow_comments: boolean;
    allow_live_streams: boolean;
    allow_shorts: boolean;
    theme: 'light' | 'dark' | 'auto';
    two_factor_auth: boolean;
    custom_url: string;
  };
  social_links: {
    instagram: string;
    twitter: string;
    tiktok: string;
    discord: string;
    email: string;
    website: string;
  };
  tags: string[];
}

const initialFormData: FormData = {
  name: '',
  description: '',
  avatar_url: '',
  banner_url: '',
  type: 'personal',
  visibility: 'public',
  category: '',
  language: '',
  audience: 'general',
  settings: {
    allow_comments: true,
    allow_live_streams: true,
    allow_shorts: true,
    theme: 'auto',
    two_factor_auth: false,
    custom_url: ''
  },
  social_links: {
    instagram: '',
    twitter: '',
    tiktok: '',
    discord: '',
    email: '',
    website: ''
  },
  tags: []
};

export function CreateChannelPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await channelService.createChannel(formData);
      if (error) throw error;
      toast.success('Canal criado com sucesso!');
      navigate(`/channel/${data?.id}`);
    } catch (error) {
      console.error('Error creating channel:', error);
      toast.error('Erro ao criar canal');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { data, error } = await channelService.uploadFile(file, file.name, type);
      if (error) throw error;
      
      setFormData(prev => ({
        ...prev,
        [type === 'avatar' ? 'avatar_url' : 'banner_url']: data
      }));

      toast.success(`${type === 'avatar' ? 'Avatar' : 'Banner'} atualizado com sucesso!`);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(`Erro ao fazer upload do ${type === 'avatar' ? 'avatar' : 'banner'}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-8">Criar Novo Canal</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-white mb-2">Nome do Canal</label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-white mb-2">Descrição</label>
          <textarea
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg"
            rows={4}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white mb-2">Avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => handleFileUpload(e, 'avatar')}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Banner</label>
            <input
              type="file"
              accept="image/*"
              onChange={e => handleFileUpload(e, 'banner')}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white mb-2">Tipo</label>
            <select
              value={formData.type}
              onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as ChannelType }))}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg"
              required
            >
              <option value="personal">Pessoal</option>
              <option value="brand">Marca</option>
              <option value="community">Comunidade</option>
              <option value="store">Loja</option>
            </select>
          </div>

          <div>
            <label className="block text-white mb-2">Visibilidade</label>
            <select
              value={formData.visibility}
              onChange={e => setFormData(prev => ({ ...prev, visibility: e.target.value as FormData['visibility'] }))}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg"
              required
            >
              <option value="public">Público</option>
              <option value="private">Privado</option>
              <option value="followers">Apenas Seguidores</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white mb-2">Categoria</label>
            <input
              type="text"
              value={formData.category}
              onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2">Idioma</label>
            <input
              type="text"
              value={formData.language}
              onChange={e => setFormData(prev => ({ ...prev, language: e.target.value }))}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white mb-2">Audiência</label>
            <select
              value={formData.audience}
              onChange={e => setFormData(prev => ({ ...prev, audience: e.target.value as FormData['audience'] }))}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg"
              required
            >
              <option value="general">Geral</option>
              <option value="kids">Infantil</option>
              <option value="adult">Adulto</option>
            </select>
          </div>
        </div>

        <div>
          <h2 className="text-xl text-white mb-4">Configurações</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.settings.allow_comments}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, allow_comments: e.target.checked }
                  }))}
                  className="form-checkbox text-purple-500"
                />
                <span className="text-white">Permitir Comentários</span>
              </label>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.settings.allow_live_streams}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, allow_live_streams: e.target.checked }
                  }))}
                  className="form-checkbox text-purple-500"
                />
                <span className="text-white">Permitir Lives</span>
              </label>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.settings.allow_shorts}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, allow_shorts: e.target.checked }
                  }))}
                  className="form-checkbox text-purple-500"
                />
                <span className="text-white">Permitir Shorts</span>
              </label>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.settings.two_factor_auth}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    settings: { ...prev.settings, two_factor_auth: e.target.checked }
                  }))}
                  className="form-checkbox text-purple-500"
                />
                <span className="text-white">Autenticação em 2 Fatores</span>
              </label>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-white mb-2">URL Personalizada</label>
            <input
              type="text"
              value={formData.settings.custom_url}
              onChange={e => setFormData(prev => ({
                ...prev,
                settings: { ...prev.settings, custom_url: e.target.value }
              }))}
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg"
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl text-white mb-4">Redes Sociais</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(Object.keys(formData.social_links) as Array<keyof typeof formData.social_links>).map(platform => (
              <div key={platform}>
                <label className="block text-white mb-2 capitalize">{platform}</label>
                <input
                  type="text"
                  value={formData.social_links[platform]}
                  onChange={e => setFormData(prev => ({
                    ...prev,
                    social_links: { ...prev.social_links, [platform]: e.target.value }
                  }))}
                  className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl text-white mb-4">Tags</h2>
          <input
            type="text"
            placeholder="Adicione tags separadas por vírgula"
            onChange={e => setFormData(prev => ({
              ...prev,
              tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
            }))}
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Criar Canal
          </button>
        </div>
      </form>
    </div>
  );
}
