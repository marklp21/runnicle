import React, { useState } from 'react';
import { Image, Video, X, Maximize2, Play } from 'lucide-react';
import { type GalleryItem, mockGalleryItems } from '../data/mockData';

interface GalleryPageProps {
  onBack?: () => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);
  const [playingVideo, setPlayingVideo] = useState<GalleryItem | null>(null);

  const categories = [
    { id: 'all', label: 'ALL' },
    { id: 'Race Day', label: 'RACE DAY' },
    { id: 'Expo', label: 'EXPO' },
    { id: 'Behind the Scenes', label: 'BEHIND THE SCENES' },
    { id: 'Community', label: 'COMMUNITY' }
  ];

  const filteredItems = mockGalleryItems.filter((item) => {
    return activeCategory === 'all' || item.category === activeCategory;
  });

  const photos = filteredItems.filter(item => item.type === 'photo');
  const videos = filteredItems.filter(item => item.type === 'video');

  return (
    <div className="bg-white min-h-screen w-full py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm font-sans font-bold text-zinc-500 hover:text-[#FF4400] transition-colors cursor-pointer mb-10 group uppercase tracking-wider"
          >
            <span className="text-base transition-transform group-hover:-translate-x-0.5">←</span> BACK TO HOME
          </button>
        )}

        {/* Header section */}
        <div className="mb-10 text-center">
          <h1 className="font-sans text-4xl font-bold tracking-[-3px] text-zinc-900 sm:text-5xl">
            Event <span className="font-serif italic text-[#FF4400] font-bold">Gallery</span>
          </h1>
          <p className="mt-3 text-black text-sm font-normal">
            Relive the energy, speed, and focus from our previous Runnicle race weeks and community meets.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-10">
          {categories.map((cat) => {
            const count = cat.id === 'all'
              ? mockGalleryItems.length
              : mockGalleryItems.filter(item => item.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-full px-5 py-2.5 text-xs font-sans font-bold uppercase transition-all cursor-pointer border ${
                  activeCategory === cat.id
                    ? 'bg-[#FF4400] text-white border-[#FF4400]'
                    : 'border-zinc-300 text-zinc-500 hover:text-zinc-800 bg-[#F5F5F5]'
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Gallery Content */}
        <div className="space-y-12">
          {/* Photography Section */}
          {photos.length > 0 && (
            <div>
              <h2 className="font-sans text-2xl sm:text-3xl font-bold text-zinc-900 mb-6 flex items-center gap-2.5 tracking-tight">
                <Image className="h-6 w-6 text-[#FF4400]" />
                Event <span className="font-serif italic text-[#FF4400] font-bold">Photography</span>
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                {photos.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedPhoto(item)}
                    className="relative aspect-square rounded-xl overflow-hidden bg-zinc-50 border border-zinc-200 hover:border-[#FF4400] transition-all group cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4" />
                    
                    <div className="absolute inset-0 p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 text-white">
                      <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-white bg-[#FF4400] px-2.5 py-0.5 rounded-full self-start shadow-sm">
                        {item.category}
                      </span>
                      <div className="flex justify-between items-end gap-3 mt-auto">
                        <span className="text-xs font-sans font-bold truncate">{item.title}</span>
                        <Maximize2 className="h-4 w-4 text-white flex-shrink-0" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Videos Section */}
          {videos.length > 0 && (
            <div>
              <h2 className="font-sans text-2xl sm:text-3xl font-bold text-zinc-900 mb-6 flex items-center gap-2.5 tracking-tight">
                <Video className="h-6 w-6 text-[#FF4400]" />
                Event Reels & <span className="font-serif italic text-[#FF4400] font-bold">Highlights</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videos.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setPlayingVideo(item)}
                    className="relative aspect-video rounded-xl overflow-hidden bg-zinc-50 border border-zinc-200 hover:border-[#FF4400] transition-all group cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                      <div className="h-14 w-14 rounded-full bg-[#FF4400] text-white flex items-center justify-center shadow-lg shadow-[#FF4400]/30 group-hover:scale-110 transition-transform duration-300">
                        <Play className="h-6 w-6 fill-white text-white translate-x-[2px]" />
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 z-10 text-white flex justify-between items-end">
                      <div>
                        <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-white bg-[#FF4400] px-2.5 py-0.5 rounded-full mb-2 inline-block shadow-sm">
                          {item.category}
                        </span>
                        <h3 className="text-sm font-sans font-bold block">{item.title}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Photo Lightbox */}
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setSelectedPhoto(null)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
            
            <div className="relative w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl border border-zinc-200 bg-white z-10 flex flex-col shadow-2xl">
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 rounded-full bg-white/90 border border-zinc-200 p-2 text-zinc-700 hover:bg-[#FF4400] hover:text-white transition-colors z-20 cursor-pointer shadow-md"
                aria-label="Close photo"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex-1 overflow-hidden flex items-center justify-center bg-black">
                <img
                  src={selectedPhoto.image}
                  alt={selectedPhoto.title}
                  className="max-h-[70vh] max-w-full object-contain"
                />
              </div>
              <div className="p-5 border-t border-zinc-200 flex justify-between items-center bg-white text-zinc-800 text-xs">
                <div>
                  <span className="text-[10px] font-sans font-extrabold uppercase text-[#FF4400] tracking-wider block">{selectedPhoto.category}</span>
                  <span className="text-sm font-sans font-bold text-zinc-950 block mt-0.5">{selectedPhoto.title}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Video Lightbox */}
        {playingVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setPlayingVideo(null)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
            
            <div className="relative w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl border border-zinc-200 bg-white z-10 flex flex-col shadow-2xl">
              <button
                onClick={() => setPlayingVideo(null)}
                className="absolute top-4 right-4 rounded-full bg-white/90 border border-zinc-200 p-2 text-zinc-700 hover:bg-[#FF4400] hover:text-white transition-colors z-20 cursor-pointer shadow-md"
                aria-label="Close video"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="flex-1 overflow-hidden flex items-center justify-center bg-black">
                {playingVideo.videoUrl && (
                  <video
                    src={playingVideo.videoUrl}
                    controls
                    autoPlay
                    className="max-h-[70vh] w-full"
                  />
                )}
              </div>
              <div className="p-5 border-t border-zinc-200 bg-white text-zinc-800 text-xs">
                <span className="text-[10px] font-sans font-extrabold uppercase text-[#FF4400] tracking-wider block">{playingVideo.category}</span>
                <span className="text-sm font-sans font-bold text-zinc-950 block mt-0.5">{playingVideo.title}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
export default GalleryPage;
