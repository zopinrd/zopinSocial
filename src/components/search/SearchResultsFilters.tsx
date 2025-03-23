import React, { useState } from 'react';
import { FiFilter, FiGrid, FiUsers, FiVideo, FiRadio, FiBox, FiMessageSquare, FiShoppingBag, FiChevronDown, FiCalendar, FiList, FiUser } from 'react-icons/fi';
import type { ResultType } from '../../types/search';

interface SearchResultsFiltersProps {
  filters: {
    category: string;
    dateRange: string;
    author: string;
    location: string;
    sortBy: string;
  };
  onFiltersChange: (filters: any) => void;
  activeTab: ResultType;
  onTabChange: (tab: ResultType) => void;
  resultCounts: Record<ResultType, number>;
}

const tabIcons = {
  all: FiGrid,
  videos: FiVideo,
  channels: FiUsers,
  lives: FiRadio,
  groups: FiBox,
  posts: FiMessageSquare,
  products: FiShoppingBag,
  people: FiUser,
} as const;

const SearchResultsFilters: React.FC<SearchResultsFiltersProps> = ({
  filters,
  onFiltersChange,
  activeTab,
  onTabChange,
  resultCounts,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="w-full flex justify-end">
      {/* Filter Button and Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
            showFilters
              ? 'bg-purple-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
          }`}
        >
          <FiFilter className="w-5 h-5" />
          <span>Filtros</span>
          <FiChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>

        {showFilters && (
          <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
            <div className="p-4 space-y-4">
              {/* Content Type Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <FiGrid className="w-4 h-4" />
                  Tipo de conteúdo
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(tabIcons).map(([type, Icon]) => (
                    <button
                      key={type}
                      onClick={() => onTabChange(type as ResultType)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                        activeTab === type
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="capitalize">{type}</span>
                      <span className="ml-auto text-xs opacity-75">
                        ({resultCounts[type as ResultType] || 0})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <FiList className="w-4 h-4" />
                  Categoria
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => onFiltersChange({ ...filters, category: e.target.value })}
                  className="w-full bg-gray-700 border-0 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Todas as categorias</option>
                  <option value="gaming">Gaming</option>
                  <option value="music">Música</option>
                  <option value="education">Educação</option>
                  <option value="entertainment">Entretenimento</option>
                </select>
              </div>

              {/* Date Range Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <FiCalendar className="w-4 h-4" />
                  Data
                </label>
                <select
                  value={filters.dateRange}
                  onChange={(e) => onFiltersChange({ ...filters, dateRange: e.target.value })}
                  className="w-full bg-gray-700 border-0 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Qualquer data</option>
                  <option value="today">Hoje</option>
                  <option value="week">Esta semana</option>
                  <option value="month">Este mês</option>
                  <option value="year">Este ano</option>
                </select>
              </div>

              {/* Sort By Filter */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <FiList className="w-4 h-4" />
                  Ordenar por
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value })}
                  className="w-full bg-gray-700 border-0 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500"
                >
                  <option value="relevance">Relevância</option>
                  <option value="date">Data</option>
                  <option value="views">Visualizações</option>
                  <option value="likes">Curtidas</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsFilters;
