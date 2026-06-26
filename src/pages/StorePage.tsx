import React, { useState } from 'react';
import { Search, ShoppingCart, Info, Star } from 'lucide-react';
import { type Product } from '../data/mockData';

interface StorePageProps {
  products: Product[];
  cartCount: number;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onViewCartClick: () => void;
}

export const StorePage: React.FC<StorePageProps> = ({
  products,
  cartCount,
  onProductClick,
  onAddToCart,
  onViewCartClick,
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', 'Race Kits', 'Jerseys', 'Merchandise', 'Accessories'];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.category.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header banner */}
      <div className="border-b border-zinc-900 pb-6 mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <span className="rounded-full bg-white/10 px-4 py-1 text-xs font-extrabold tracking-widest text-white uppercase">
            GEAR SHOP
          </span>
          <h1 className="mt-4 font-display text-4xl font-black text-white tracking-tight leading-none">
            AthleRun Equipment
          </h1>
          <p className="mt-2.5 text-xs text-zinc-400 font-semibold">
            Technical footwear, breathability singlets, hydration vests, and race-day kits.
          </p>
        </div>

        {/* Search & Cart Actions */}
        <div className="flex items-center gap-4 w-full md:max-w-md justify-between md:justify-end">
          <div className="relative flex-1 md:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
            <input
              type="text"
              placeholder="Search gear..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded border border-zinc-800 bg-[#0c0c0c] pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-700 focus:border-white focus:outline-none"
            />
          </div>

          <button
            onClick={onViewCartClick}
            className="relative flex h-11 w-11 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950 text-white hover:bg-zinc-900 hover:border-zinc-700 transition-colors cursor-pointer"
            aria-label="View shopping cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[9px] font-black text-black">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Categories chips */}
      <div className="flex gap-2 flex-wrap border-b border-zinc-950 pb-5 mb-8">
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

      {/* Catalog items grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 rounded-xl border border-zinc-900 bg-[#070708]/30 text-zinc-500">
          <Info className="h-10 w-10 text-zinc-700 mx-auto mb-4" />
          <h3 className="text-white font-bold">No products found</h3>
          <p className="text-xs mt-1.5 font-medium">Try matching another keyword or resetting the filter chips.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="rounded-xl border border-zinc-800 bg-[#0c0c0d]/60 hover:border-zinc-700 transition-all flex flex-col justify-between overflow-hidden group cursor-pointer"
              onClick={() => onProductClick(prod)}
            >
              {/* Product Visual Container */}
              <div className="relative aspect-square overflow-hidden bg-zinc-900 flex items-center justify-center border-b border-zinc-950">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="h-full w-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-zinc-950/80 border border-zinc-800 rounded px-2.5 py-1 text-[9px] font-black uppercase text-zinc-400 tracking-widest">
                  {prod.category}
                </span>
              </div>

              {/* Product Info */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <h3 className="font-display text-base font-black text-white group-hover:text-zinc-200 transition-colors">
                      {prod.name}
                    </h3>
                    <span className="text-sm font-bold text-white font-display">₱{prod.price.toLocaleString()}</span>
                  </div>
                  
                  {/* Reviews */}
                  <div className="flex items-center gap-1 text-[10px] text-zinc-500 mb-3.5">
                    <div className="flex text-white">
                      <Star className="h-3.5 w-3.5 fill-white stroke-none" />
                    </div>
                    <span className="font-bold text-zinc-400 mt-0.5">5.0 (42 reviews)</span>
                  </div>

                  <p className="text-xs text-zinc-500 font-medium line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>
                </div>
                
                {/* Add to Cart button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(prod);
                  }}
                  className="w-full rounded-md border border-zinc-800 bg-zinc-950 py-3 text-center text-xs font-bold text-white hover:bg-zinc-900 hover:border-zinc-700 transition-all cursor-pointer uppercase tracking-wider"
                >
                  Quick Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
export default StorePage;
