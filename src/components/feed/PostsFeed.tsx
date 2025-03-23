import { ThumbsUp, MessageCircle, Share2, Play } from 'lucide-react';

export const PostsFeed = () => {
  const posts = [
    {
      creator: "Sarah Dance",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=60",
      thumbnail: "https://images.unsplash.com/photo-1545128485-c400e7702796?w=500&auto=format&fit=crop&q=60",
      time: "2 horas atrás",
      caption: "Meu novo desafio de dança! 💃 Participe e mostre seus passos! #ZopinDance",
      likes: "25.5k",
      comments: "234",
      duration: "0:30"
    },
    {
      creator: "Chef Maria",
      avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&auto=format&fit=crop&q=60",
      thumbnail: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&auto=format&fit=crop&q=60",
      time: "3 horas atrás",
      caption: "Receita rápida: bolo de caneca em 1 minuto 🧁 Salve para fazer depois! #ZopinCooking",
      likes: "18.2k",
      comments: "156",
      duration: "0:45"
    },
    {
      creator: "Mike Tips",
      avatar: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?w=400&auto=format&fit=crop&q=60",
      thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop&q=60",
      time: "5 horas atrás",
      caption: "5 dicas de produtividade que mudaram minha vida 🚀 #ZopinTips #Produtividade",
      likes: "12.8k",
      comments: "98",
      duration: "0:60"
    }
  ];

  return (
    <div className="space-y-6">
      {posts.map((post, index) => (
        <div key={index} className="bg-gray-800 rounded-lg p-4">
          <div className="flex items-center mb-4">
            <img
              src={post.avatar}
              alt={`Avatar de ${post.creator}`}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <h3 className="font-semibold">{post.creator}</h3>
              <p className="text-sm text-gray-400">{post.time}</p>
            </div>
          </div>
          <p className="mb-4">{post.caption}</p>
          <div className="relative mb-4">
            <img
              src={post.thumbnail}
              alt={`Vídeo de ${post.creator}`}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-purple-600/80 p-4 rounded-full">
                <Play className="h-8 w-8" />
              </div>
            </div>
            <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-sm">
              {post.duration}
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <button className="flex items-center space-x-1 text-gray-400 hover:text-purple-400">
              <ThumbsUp className="h-5 w-5" />
              <span>{post.likes}</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-400 hover:text-purple-400">
              <MessageCircle className="h-5 w-5" />
              <span>{post.comments}</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-400 hover:text-purple-400">
              <Share2 className="h-5 w-5" />
              <span>Compartilhar</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
