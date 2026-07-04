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
      
      {}
      <div className="border-b border-zinc-200 pb-6 mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <span className="rounded-full bg-orange-50 px-4 py-1 text-xs font-extrabold tracking-widest text-orange-600 border border-orange-200 uppercase">
            GEAR SHOP
          </span>
          <h1 className="mt-4 font-display text-4xl font-black text-zinc-900 tracking-tight leading-none">
            Runnicle Equipment
          </h1>
          <p className="mt-2.5 text-xs text-zinc-500 font-semibold">
            Technical footwear, breathability singlets, hydration vests, and race-day kits.
          </p>
        </div>

        {}
        <div className="flex items-center gap-4 w-full md:max-w-md justify-between md:justify-end">
          <div className="relative flex-1 md:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search gear..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded border border-zinc-200 bg-white pl-10 pr-4 py-2.5 text-xs text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <button
            onClick={onViewCartClick}
            className="relative flex h-11 w-11 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-colors cursor-pointer shadow-sm"
            aria-label="View shopping cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[9px] font-black text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {}
      <div className="flex gap-2 flex-wrap border-b border-zinc-200 pb-5 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
              activeCategory === cat
                ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/10'
                : 'border-zinc-200 text-zinc-650 hover:border-zinc-350 hover:text-orange-500 bg-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-500">
          <Info className="h-10 w-10 text-zinc-400 mx-auto mb-4" />
          <h3 className="text-zinc-800 font-bold">No products found</h3>
          <p className="text-xs mt-1.5 font-medium">Try matching another keyword or resetting the filter chips.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="rounded-xl border border-zinc-200 bg-white hover:border-orange-200 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group cursor-pointer shadow-sm"
              onClick={() => onProductClick(prod)}
            >
              {}
              <div className="relative aspect-square overflow-hidden bg-zinc-50 flex items-center justify-center border-b border-zinc-100">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="h-full w-full object-cover scale-100 group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-zinc-900 rounded px-2.5 py-1 text-[9px] font-black uppercase text-white tracking-widest">
                  {prod.category}
                </span>
              </div>

              {}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-start mb-2 gap-4">
                    <h3 className="font-sans text-base font-bold text-zinc-900 group-hover:text-orange-600 transition-colors">
                      {prod.name}
                    </h3>
                    <span className="text-sm font-bold text-zinc-900 font-mono">₱{prod.price.toLocaleString()}</span>
                  </div>
                  
                  {}
                  <div className="flex items-center gap-1 text-[10px] text-zinc-500 mb-3.5">
                    <div className="flex text-orange-500">
                      <Star className="h-3.5 w-3.5 fill-orange-500 stroke-none" />
                    </div>
                    <span className="font-bold text-zinc-500 mt-0.5">5.0 (42 reviews)</span>
                  </div>

                  <p className="text-xs text-zinc-500 font-medium line-clamp-2 leading-relaxed">
                    {prod.description}
                  </p>
                </div>
                
                {}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(prod);
                  }}
                  className="w-full rounded-md bg-orange-500 py-3 text-center text-xs font-bold text-white hover:bg-orange-600 transition-all cursor-pointer uppercase tracking-wider"
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
