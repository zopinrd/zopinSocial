import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { LeftSidebar } from '../components/sidebar/LeftSidebar';
import {
  GroupType,
  GroupJoinType,
  GroupCategory,
  GroupSettings,
  GroupSocialLinks,
} from '../types/group';
import {
  Users,
  Upload,
  Globe,
  Lock,
  Eye,
  Image,
} from 'lucide-react';

interface FormData {
  name: string;
  description: string;
  avatarFile: File | null;
  bannerFile: File | null;
  avatarPreview: string;
  bannerPreview: string;
  type: GroupType;
  joinType: GroupJoinType;
  category: GroupCategory;
  language: string;
  location: string;
  rules: string[];
  tags: string[];
  settings: GroupSettings;
  socialLinks: GroupSocialLinks;
  admins: string[];
}

const initialFormData: FormData = {
  name: '',
  description: '',
  avatarFile: null,
  bannerFile: null,
  avatarPreview: '',
  bannerPreview: '',
  type: 'public',
  joinType: 'open',
  category: 'community',
  language: 'pt-BR',
  location: '',
  rules: [''],
  tags: [],
  settings: {
    postPermission: 'all',
    commentPermission: 'all',
    allowMedia: true,
    enableChat: true,
    theme: 'auto',
  },
  socialLinks: {},
  admins: [],
};

const categories: { value: GroupCategory; label: string }[] = [
  { value: 'sales', label: 'Vendas' },
  { value: 'music', label: 'Música' },
  { value: 'games', label: 'Games' },
  { value: 'education', label: 'Educação' },
  { value: 'community', label: 'Comunidade' },
  { value: 'technology', label: 'Tecnologia' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'sports', label: 'Esportes' },
  { value: 'art', label: 'Arte' },
];

const languages = [
  { code: 'pt-BR', name: 'Português' },
  { code: 'en-US', name: 'English' },
  { code: 'es-ES', name: 'Español' },
];

export function CreateGroupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(1);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'avatar' | 'banner'
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          [`${type}File`]: file,
          [`${type}Preview`]: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mock API call
    console.log('Submitting group:', formData);
    navigate('/group/1');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <main className="container mx-auto px-4 max-w-[1280px] pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="hidden lg:block lg:col-span-2">
            <LeftSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-7">
            <div className="bg-gray-800 rounded-lg p-6">
              <h1 className="text-2xl font-bold mb-6">Criar novo grupo</h1>

              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                <div className={`flex-1 h-1 bg-gray-700 ${currentStep >= 1 ? 'bg-purple-600' : ''}`} />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 1 ? 'bg-purple-600' : 'bg-gray-700'
                }`}>
                  1
                </div>
                <div className={`flex-1 h-1 bg-gray-700 ${currentStep >= 2 ? 'bg-purple-600' : ''}`} />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 2 ? 'bg-purple-600' : 'bg-gray-700'
                }`}>
                  2
                </div>
                <div className={`flex-1 h-1 bg-gray-700 ${currentStep >= 3 ? 'bg-purple-600' : ''}`} />
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= 3 ? 'bg-purple-600' : 'bg-gray-700'
                }`}>
                  3
                </div>
                <div className={`flex-1 h-1 bg-gray-700 ${currentStep >= 4 ? 'bg-purple-600' : ''}`} />
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Informações básicas</h2>

                    {/* Group Name */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Nome do grupo
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        maxLength={50}
                        className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Digite o nome do grupo"
                        required
                      />
                    </div>

                    {/* Group Avatar */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Avatar do grupo
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="w-24 h-24 bg-gray-700 rounded-full overflow-hidden">
                          {formData.avatarPreview ? (
                            <img
                              src={formData.avatarPreview}
                              alt="Avatar preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Users className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'avatar')}
                          className="hidden"
                          id="avatarInput"
                        />
                        <label
                          htmlFor="avatarInput"
                          className="px-4 py-2 bg-gray-700 text-white rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
                        >
                          <Upload className="w-5 h-5 inline-block mr-2" />
                          Fazer upload
                        </label>
                      </div>
                    </div>

                    {/* Group Banner */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Banner do grupo
                      </label>
                      <div className="relative w-full aspect-[3/1] bg-gray-700 rounded-lg overflow-hidden">
                        {formData.bannerPreview ? (
                          <img
                            src={formData.bannerPreview}
                            alt="Banner preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Image className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'banner')}
                          className="hidden"
                          id="bannerInput"
                        />
                        <label
                          htmlFor="bannerInput"
                          className="absolute bottom-4 right-4 px-4 py-2 bg-gray-900/80 text-white rounded-lg cursor-pointer hover:bg-gray-900 transition-colors"
                        >
                          <Upload className="w-5 h-5 inline-block mr-2" />
                          Fazer upload
                        </label>
                      </div>
                    </div>

                    {/* Group Description */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Descrição
                        <span className="text-gray-400 ml-2">
                          ({300 - (formData.description?.length || 0)} caracteres restantes)
                        </span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        maxLength={300}
                        rows={4}
                        className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                        placeholder="Descreva seu grupo em até 300 caracteres"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Categoria
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {categories.map(category => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Language */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Idioma principal
                      </label>
                      <select
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {languages.map(lang => (
                          <option key={lang.code} value={lang.code}>
                            {lang.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Localização (opcional)
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Ex: São Paulo, Brasil"
                      />
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t border-gray-700">
                  <button
                    type="button"
                    className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Salvar rascunho
                  </button>
                  <div className="flex gap-4">
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={() => setCurrentStep(prev => prev - 1)}
                        className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        Voltar
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setCurrentStep(prev => prev + 1)}
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
                    >
                      Próximo
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="hidden lg:block lg:col-span-3">
            <div className="bg-gray-800 rounded-lg p-6 sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Pré-visualização</h3>
              
              <div className="space-y-4">
                {/* Banner Preview */}
                <div className="relative w-full aspect-[3/1] bg-gray-700 rounded-lg overflow-hidden">
                  {formData.bannerPreview ? (
                    <img
                      src={formData.bannerPreview}
                      alt="Banner preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Avatar and Basic Info */}
                <div className="flex items-start gap-4 -mt-8">
                  <div className="w-16 h-16 bg-gray-700 rounded-full overflow-hidden border-4 border-gray-800">
                    {formData.avatarPreview ? (
                      <img
                        src={formData.avatarPreview}
                        alt="Avatar preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold">{formData.name || 'Nome do grupo'}</h4>
                    <p className="text-sm text-gray-400">
                      {formData.type === 'public' ? (
                        <Globe className="w-4 h-4 inline-block mr-1" />
                      ) : formData.type === 'private' ? (
                        <Lock className="w-4 h-4 inline-block mr-1" />
                      ) : (
                        <Eye className="w-4 h-4 inline-block mr-1" />
                      )}
                      {formData.type === 'public'
                        ? 'Grupo público'
                        : formData.type === 'private'
                        ? 'Grupo privado'
                        : 'Grupo secreto'}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-300">
                  {formData.description || 'Descrição do grupo'}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>0 membros</span>
                  <span>•</span>
                  <span>{categories.find(c => c.value === formData.category)?.label}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
