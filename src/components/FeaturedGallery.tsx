import React from 'react';

export const FeaturedGallery: React.FC = () => {
  const images = [
    "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80"
  ];

  return (
    <section className="py-16 bg-[#FF4400] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-sans text-4xl font-bold tracking-tight mb-2 text-white">
          Featured <span className="font-serif italic text-white font-bold">Gallery</span>
        </h2>
        <p className="font-sans text-sm font-normal text-white/90 mb-10">
          Highlights and stories from our runners on the road
        </p>

        <div className="grid grid-cols-3 gap-4">
          {images.map((src, index) => (
            <div key={index} className="relative aspect-[3/4] sm:aspect-[2/3] overflow-hidden rounded-[7px]">
              <img
                src={src}
                alt={`Featured runner ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 z-10 pointer-events-auto" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedGallery;
