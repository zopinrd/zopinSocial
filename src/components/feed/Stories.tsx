export const Stories = () => {
  const stories = [
    {
      creator: "Sarah Dance",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=60",
      active: true
    },
    {
      creator: "Chef Maria",
      avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=60",
      active: true
    },
    {
      creator: "Mike Tips",
      avatar: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=400&auto=format&fit=crop&q=60",
      active: true
    },
    {
      creator: "João Silva",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=60",
      active: false
    },
    {
      creator: "Ana Música",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60",
      active: false
    }
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <h2 className="text-xl font-semibold mb-4">Histórias</h2>
      <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {stories.map((story, index) => (
          <div key={index} className="flex-shrink-0">
            <div className={`relative cursor-pointer group ${story.active ? 'ring-2 ring-purple-500 rounded-full p-0.5' : ''}`}>
              <img
                src={story.avatar}
                alt={`História de ${story.creator}`}
                className="w-16 h-16 rounded-full object-cover"
              />
              {story.active && (
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <div className="w-3 h-3 border-2 border-white rounded-full"></div>
                </div>
              )}
            </div>
            <p className="text-xs text-center mt-2 text-gray-400">
              {story.creator.split(' ')[0]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
