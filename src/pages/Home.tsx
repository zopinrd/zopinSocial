import { Header } from '../components/layout/Header';
import { LeftSidebar } from '../components/sidebar/LeftSidebar';
import { RightSidebar } from '../components/sidebar/RightSidebar';
import { LiveStreams } from '../components/feed/LiveStreams';
import { PostsFeed } from '../components/feed/PostsFeed';
import { Stories } from '../components/feed/Stories';

export const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 max-w-[1280px] mt-24">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="hidden lg:block col-span-2 fixed-sidebar">
            <LeftSidebar />
          </div>
          
          {/* Main Feed - Scrollable */}
          <div className="col-span-12 lg:col-span-7 lg:col-start-3">
            <Stories />
            <LiveStreams />
            <PostsFeed />
          </div>

          {/* Right Sidebar */}
          <div className="hidden lg:block col-span-3 fixed-sidebar">
            <RightSidebar />
          </div>
        </div>
      </main>

      {/* Add fixed sidebar styles */}
      <style>{`
        .fixed-sidebar {
          height: calc(100vh - 6rem);
          position: fixed;
          top: 6rem;
          overflow-y: auto;
        }
        .fixed-sidebar::-webkit-scrollbar {
          width: 6px;
        }
        .fixed-sidebar::-webkit-scrollbar-track {
          background: transparent;
        }
        .fixed-sidebar::-webkit-scrollbar-thumb {
          background-color: rgba(107, 114, 128, 0.5);
          border-radius: 3px;
        }
        .col-span-2.fixed-sidebar {
          width: calc((100% - 1280px) / 2 + (1280px * 2 / 12) - 1rem);
          max-width: calc(1280px * 2 / 12);
          left: 50%;
          transform: translateX(calc(-50% - 1280px / 2 + (1280px * 2 / 24)));
        }
        .col-span-3.fixed-sidebar {
          width: calc((100% - 1280px) / 2 + (1280px * 3 / 12) - 1rem);
          max-width: calc(1280px * 3 / 12);
          right: 50%;
          transform: translateX(calc(50% + 1280px / 2 - (1280px * 3 / 24)));
        }
        @media (max-width: 1320px) {
          .col-span-2.fixed-sidebar {
            left: 1rem;
            transform: none;
          }
          .col-span-3.fixed-sidebar {
            right: 1rem;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
};
