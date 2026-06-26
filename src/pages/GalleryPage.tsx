import React, { useState } from 'react';
import { Image, Video, X, Maximize2, Play } from 'lucide-react';
import { type GalleryItem, mockGalleryItems } from '../data/mockData';

export const GalleryPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);
  const [playingVideo, setPlayingVideo] = useState<GalleryItem | null>(null);

  const categories = ['all', 'Race Day', 'Expo', 'Behind the Scenes', 'Community'];

  const filteredItems = mockGalleryItems.filter((item) => {
    return activeCategory === 'all' || item.category === activeCategory;
  });

  const photos = filteredItems.filter(item => item.type === 'photo');
  const videos = filteredItems.filter(item => item.type === 'video');

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="border-b border-zinc-900 pb-6 mb-8 text-center max-w-3xl mx-auto">
        <span className="rounded-full bg-white/10 px-4 py-1 text-xs font-extrabold tracking-widest text-white uppercase">
          EVENT GALLERY
        </span>
        <h1 className="mt-6 font-display text-4xl font-black leading-tight text-white sm:text-5xl">
          Captured Moments.
        </h1>
        <p className="mt-4 text-zinc-400 text-sm leading-relaxed">
          Relive the energy, speed, and focus from our previous AthleRun race weeks and community meets.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex justify-center gap-2 flex-wrap border-b border-zinc-950 pb-5 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              activeCategory === cat
                ? 'bg-white text-black border-white'
                : 'border-zinc-900 text-zinc-500 hover:border-zinc-700 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid photos layout */}
      <div className="space-y-12">
        {/* Photo Gallery */}
        {photos.length > 0 && (
          <div>
            <h2 className="font-display text-2xl font-black text-white mb-6 flex items-center gap-2 tracking-tight">
              <Image className="h-6 w-6 text-zinc-500" />
              Event Photography
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedPhoto(item)}
                  className="relative aspect-square rounded-xl overflow-hidden bg-zinc-900 border border-zinc-900 hover:border-zinc-600 transition-all group cursor-pointer"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5" />
                  
                  <div className="absolute inset-0 p-3.5 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 text-white">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-950/80 px-2 py-0.5 rounded border border-zinc-900/60 self-start">
                      {item.category}
                    </span>
                    <div className="flex justify-between items-end gap-3 mt-auto">
                      <span className="text-xs font-bold truncate">{item.title}</span>
                      <Maximize2 className="h-4 w-4 text-zinc-300 flex-shrink-0" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Video stream panel */}
        {videos.length > 0 && (
          <div>
            <h2 className="font-display text-2xl font-black text-white mb-6 flex items-center gap-2 tracking-tight">
              <Video className="h-6 w-6 text-zinc-500" />
              Event Reels & Highlights
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setPlayingVideo(item)}
                  className="relative aspect-video rounded-xl overflow-hidden bg-zinc-900 border border-zinc-900 hover:border-zinc-600 transition-all group cursor-pointer"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Overlay play button */}
                  <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                    <div className="h-14 w-14 rounded-full bg-white text-black flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Play className="h-6 w-6 fill-black translate-x-[2px]" />
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 z-10 text-white flex justify-between items-end">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400 bg-zinc-950/80 px-2.5 py-0.5 rounded border border-zinc-900/60 mb-2.5 inline-block">
                        {item.category}
                      </span>
                      <h3 className="text-sm font-bold block">{item.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* -------------------- DYNAMIC MEDIA LIGHTBOX OVERLAYS -------------------- */}

      {/* Photo Lightbox */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setSelectedPhoto(null)} className="fixed inset-0 bg-black/90 backdrop-blur-sm" />
          
          <div className="relative w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-xl border border-zinc-800 bg-[#0d0d0e] z-10 flex flex-col">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 rounded-lg bg-zinc-950/80 border border-zinc-800 p-2 text-zinc-400 hover:text-white transition-colors z-20 cursor-pointer"
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
            <div className="p-5 border-t border-zinc-900 flex justify-between items-center bg-zinc-950 text-white text-xs">
              <div>
                <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider block">{selectedPhoto.category}</span>
                <span className="text-sm font-bold block mt-1">{selectedPhoto.title}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Player Lightbox */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setPlayingVideo(null)} className="fixed inset-0 bg-black/90 backdrop-blur-sm" />
          
          <div className="relative w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-xl border border-zinc-800 bg-[#0d0d0e] z-10 flex flex-col">
            <button
              onClick={() => setPlayingVideo(null)}
              className="absolute top-4 right-4 rounded-lg bg-zinc-950/80 border border-zinc-800 p-2 text-zinc-400 hover:text-white transition-colors z-20 cursor-pointer"
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
            <div className="p-5 border-t border-zinc-900 bg-zinc-950 text-white text-xs">
              <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider block">{playingVideo.category}</span>
              <span className="text-sm font-bold block mt-1">{playingVideo.title}</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default GalleryPage;
