import { useState, useEffect, useRef } from 'react';
import { Header } from '../components/layout/Header';
import { LeftSidebar } from '../components/sidebar/LeftSidebar';
import { RightSidebar } from '../components/sidebar/RightSidebar';
import { Heart, Share2, MessageCircle } from 'lucide-react';

interface ShortVideo {
  id: string;
  videoUrl: string;
  channelName: string;
  description: string;
  likes: number;
  comments: number;
}

const mockVideos: ShortVideo[] = [
  {
    id: '1',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-vlogging-about-make-up-and-beauty-10976-large.mp4',
    channelName: 'Sarah Dance',
    description: 'Nova coreografia! 💃 #ZopinDance',
    likes: 12500,
    comments: 342
  },
  {
    id: '2',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-preparing-a-delicious-meal-in-the-kitchen-10167-large.mp4',
    channelName: 'Chef Maria',
    description: 'Receita rápida de bolo de caneca 🧁 #ZopinCooking',
    likes: 8900,
    comments: 156
  },
  {
    id: '3',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-giving-a-speech-to-an-audience-42831-large.mp4',
    channelName: 'Mike Tips',
    description: 'Dicas para produtividade máxima 🚀 #ZopinTips',
    likes: 15700,
    comments: 489
  }
];

const VideoPlayer = ({ video, isVisible }: { video: ShortVideo; isVisible: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (isVisible) {
        videoRef.current.play().catch(() => {
          // Autoplay might be blocked by browser
          console.log('Autoplay prevented');
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isVisible]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="relative h-[calc(100vh-6rem)] bg-black">
      <video
        ref={videoRef}
        src={video.videoUrl}
        className="w-full h-full object-cover"
        loop
        playsInline
        muted
      />
      
      {/* Video Controls Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60">
        {/* Right Side Actions */}
        <div className="absolute right-4 bottom-24 flex flex-col items-center gap-6">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className="flex flex-col items-center gap-1"
          >
            <div className={`p-3 rounded-full bg-gray-800/80 transition-colors ${
              isLiked ? 'text-red-500' : 'text-white hover:text-red-500'
            }`}>
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
            </div>
            <span className="text-sm">{formatNumber(video.likes)}</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex flex-col items-center gap-1"
          >
            <div className="p-3 rounded-full bg-gray-800/80 text-white hover:text-purple-400 transition-colors">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-sm">{formatNumber(video.comments)}</span>
          </button>
          
          <button className="flex flex-col items-center gap-1">
            <div className="p-3 rounded-full bg-gray-800/80 text-white hover:text-purple-400 transition-colors">
              <Share2 className="w-6 h-6" />
            </div>
            <span className="text-sm">Compartilhar</span>
          </button>
        </div>

        {/* Video Info */}
        <div className="absolute left-4 bottom-8 right-20">
          <h3 className="font-semibold text-lg">{video.channelName}</h3>
          <p className="text-sm text-gray-200 mt-1">{video.description}</p>
        </div>
      </div>

      {/* Comments Drawer (to be implemented) */}
      {showComments && (
        <div className="absolute inset-0 bg-black/90 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Comentários ({formatNumber(video.comments)})</h3>
            <button
              onClick={() => setShowComments(false)}
              className="text-gray-400 hover:text-white"
            >
              Fechar
            </button>
          </div>
          <div className="h-full overflow-y-auto">
            {/* Comment list would go here */}
            <p className="text-gray-400 text-center mt-4">
              Em breve: lista de comentários
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export const ShortsPage = () => {
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const observerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = observerRefs.current.map((ref, index) => {
      if (!ref) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveVideoIndex(index);
            }
          });
        },
        {
          threshold: 0.6,
        }
      );

      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-24">
          {/* Fixed Left Sidebar */}
          <div className="hidden lg:block lg:col-span-2 sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto">
            <LeftSidebar />
          </div>
          
          {/* Shorts Feed */}
          <div className="lg:col-span-7">
            <div className="snap-y snap-mandatory h-[calc(100vh-6rem)] overflow-y-scroll">
              {mockVideos.map((video, index) => (
                <div
                  key={video.id}
                  ref={(el) => (observerRefs.current[index] = el)}
                  className="snap-start snap-always h-[calc(100vh-6rem)]"
                >
                  <VideoPlayer
                    video={video}
                    isVisible={index === activeVideoIndex}
                  />
                </div>
              ))}
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
};
