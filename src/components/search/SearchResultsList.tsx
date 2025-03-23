import React from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiMapPin, FiUsers } from 'react-icons/fi';
import type { ResultType, SearchResult } from '../../types/search';

interface SearchResultsListProps {
  results: SearchResult[];
  loading: boolean;
  activeTab: ResultType;
  query: string;
}

const SearchResultsList: React.FC<SearchResultsListProps> = ({
  results,
  loading,
  activeTab,
  query,
}) => {
  const filteredResults = activeTab === 'all' 
    ? results 
    : results.filter(result => result.type === activeTab);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!query) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Digite algo para pesquisar</p>
      </div>
    );
  }

  if (filteredResults.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Nenhum resultado encontrado para "{query}"</p>
      </div>
    );
  }

  const renderResult = (result: SearchResult) => {
    switch (result.type) {
      case 'videos':
        return (
          <div className="flex gap-4 p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
            {result.imageUrl && (
              <img
                src={result.imageUrl}
                alt={result.title}
                className="w-48 h-28 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-white">{result.title}</h3>
              <p className="text-gray-400 text-sm mt-1">{result.description}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <img src={result.avatarUrl} alt="" className="w-5 h-5 rounded-full" />
                  <span>{result.authorName}</span>
                </div>
                <span>{result.metrics?.views?.toLocaleString()} visualizações</span>
                <span>{result.date}</span>
              </div>
            </div>
          </div>
        );

      case 'channels':
        return (
          <div className="flex gap-4 p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
            <img
              src={result.avatarUrl}
              alt={result.title}
              className="w-16 h-16 rounded-full"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-white">{result.title}</h3>
              <p className="text-gray-400 text-sm mt-1">{result.description}</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                <span>{result.metrics?.subscribers?.toLocaleString()} inscritos</span>
              </div>
            </div>
          </div>
        );

      case 'lives':
        return (
          <div className="flex gap-4 p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
            <div className="relative">
              <img
                src={result.imageUrl}
                alt={result.title}
                className="w-48 h-28 object-cover rounded-lg"
              />
              {result.isLive && (
                <span className="absolute top-2 left-2 px-2 py-1 bg-red-600 text-white text-xs rounded-full">
                  AO VIVO
                </span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-white">{result.title}</h3>
              <p className="text-gray-400 text-sm mt-1">{result.description}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <img src={result.avatarUrl} alt="" className="w-5 h-5 rounded-full" />
                  <span>{result.authorName}</span>
                </div>
                <span>{result.metrics?.viewers?.toLocaleString()} espectadores</span>
              </div>
            </div>
          </div>
        );

      case 'people':
        return (
          <Link
            to={`/user/${result.username?.replace('@', '')}`}
            className="flex gap-4 p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <img
              src={result.avatarUrl}
              alt={result.title}
              className="w-16 h-16 rounded-full"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg text-white">{result.title}</h3>
                <span className="text-gray-400">{result.username}</span>
              </div>
              <p className="text-gray-400 text-sm mt-1">{result.description}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                {result.role && (
                  <div className="flex items-center gap-1">
                    <FiUser className="w-4 h-4" />
                    <span>{result.role}</span>
                  </div>
                )}
                {result.location && (
                  <div className="flex items-center gap-1">
                    <FiMapPin className="w-4 h-4" />
                    <span>{result.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <FiUsers className="w-4 h-4" />
                  <span>{result.followers?.toLocaleString()} seguidores</span>
                </div>
              </div>
            </div>
          </Link>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {filteredResults.map((result) => (
        <div key={result.id}>{renderResult(result)}</div>
      ))}
    </div>
  );
};

export default SearchResultsList;
