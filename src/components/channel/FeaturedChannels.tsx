import { useState, useRef } from 'react';
import { Channel } from '../../types/channel';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';

interface FeaturedChannelsProps {
  channels: Channel[];
}

export function FeaturedChannels({ channels }: FeaturedChannelsProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollTo = (direction: 'prev' | 'next') => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.offsetWidth;
      const newScroll = direction === 'next'
        ? sliderRef.current.scrollLeft + scrollAmount
        : sliderRef.current.scrollLeft - scrollAmount;
      
      sliderRef.current.scrollTo({
        left: newScroll,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative bg-gray-800 rounded-lg p-6 overflow-hidden">
      <h2 className="text-xl font-bold text-white mb-4">Canais em Destaque</h2>

      {/* Navigation Buttons */}
      <button
        onClick={() => scrollTo('prev')}
        className="absolute left-2 top-1/2 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
        aria-label="Previous slide"
      >
        <FiChevronLeft size={24} />
      </button>
      <button
        onClick={() => scrollTo('next')}
        className="absolute right-2 top-1/2 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
        aria-label="Next slide"
      >
        <FiChevronRight size={24} />
      </button>

      {/* Featured Channels Slider */}
      <div
        ref={sliderRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
      >
        {channels.map(channel => (
          <Link
            key={channel.id}
            to={`/channel/${channel.id}`}
            className="relative flex-none w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-12px)] xl:w-[calc(25%-12px)] snap-start"
          >
            {/* Banner Image */}
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <img
                src={channel.banner_url}
                alt={channel.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              
              {/* Channel Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-3">
                <img
                  src={channel.avatar_url}
                  alt={channel.name}
                  className="w-12 h-12 rounded-full border-2 border-white"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold truncate">{channel.name}</h3>
                  <p className="text-gray-200 text-sm truncate">{channel.category}</p>
                </div>
              </div>

              {/* Live Badge */}
              {channel.is_live && (
                <span className="absolute top-2 left-2 px-2 py-1 bg-red-600 text-white text-xs font-medium rounded-full">
                  AO VIVO
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: Math.ceil(channels.length / 4) }).map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index);
              if (sliderRef.current) {
                sliderRef.current.scrollTo({
                  left: index * sliderRef.current.offsetWidth,
                  behavior: 'smooth'
                });
              }
            }}
            className={`w-2 h-2 rounded-full transition-colors ${
              currentSlide === index ? 'bg-purple-500' : 'bg-gray-600'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
