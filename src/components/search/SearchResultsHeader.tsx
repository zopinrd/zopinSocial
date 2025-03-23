interface SearchResultsHeaderProps {
  query: string;
}

const SearchResultsHeader = ({ query }: SearchResultsHeaderProps) => {
  return (
    <div className="bg-gray-900 border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl font-semibold text-white">
          Resultados para "{query}"
        </h1>
        <p className="text-gray-400 mt-1">
          Encontre vídeos, canais e criadores
        </p>
      </div>
    </div>
  );
};

export default SearchResultsHeader;
