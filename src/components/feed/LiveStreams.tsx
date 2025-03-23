export const LiveStreams = () => {
  const streams = [
    {
      title: "Desafio de Dança Ao Vivo",
      creator: "Sarah Dance",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=60",
      thumbnail: "https://images.unsplash.com/photo-1545128485-c400e7702796?w=500&auto=format&fit=crop&q=60",
      viewers: "5.2k"
    },
    {
      title: "Dicas de Culinária",
      creator: "Chef Maria",
      avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=60",
      thumbnail: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&auto=format&fit=crop&q=60",
      viewers: "3.1k"
    }
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <h2 className="text-xl font-semibold mb-4">Ao Vivo em Alta</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {streams.map((stream, index) => (
          <div key={index} className="relative group">
            <img
              src={stream.thumbnail}
              alt={`Miniatura de ${stream.title}`}
              className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
              <div className="flex items-center">
                <img
                  src={stream.avatar}
                  alt={`Avatar de ${stream.creator}`}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <div>
                  <h3 className="font-semibold">{stream.title}</h3>
                  <p className="text-sm text-gray-300">{stream.creator}</p>
                </div>
              </div>
            </div>
            <div className="absolute top-2 right-2 bg-red-600 px-2 py-1 rounded text-sm">
              {stream.viewers} assistindo
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
