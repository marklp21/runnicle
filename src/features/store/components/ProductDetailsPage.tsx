import React, { useState } from 'react';
import { ArrowLeft, Star, ShoppingBag, Truck, RotateCcw, ShieldCheck } from 'lucide-react';

interface ProductDetailsPageProps {
  product: any;
  onBack: () => void;
  onAddToCart: () => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  product,
  onBack,
  onAddToCart,
}) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-orange-500 uppercase tracking-wider transition-colors mb-8 cursor-pointer group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Equipment
      </button>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {}
        <div className="space-y-6">
          <div className="aspect-square bg-zinc-50 rounded-2xl overflow-hidden border border-zinc-200 flex items-center justify-center relative shadow-sm">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            <span className="absolute top-4 left-4 bg-zinc-900 rounded px-2.5 py-1 text-[9px] font-black uppercase text-white tracking-widest">
              Runnicle {product.category}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="aspect-square bg-zinc-50 rounded-xl border border-zinc-200 overflow-hidden opacity-70 hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center shadow-sm">
              <img src={product.image} alt="Thumbnail 1" className="h-full w-full object-cover" />
            </div>
            <div className="aspect-square bg-zinc-50 rounded-xl border border-zinc-200 overflow-hidden opacity-50 hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center shadow-sm">
              <img src={product.image} alt="Thumbnail 2" className="h-full w-full object-cover" />
            </div>
            <div className="aspect-square bg-zinc-50 rounded-xl border border-zinc-200 overflow-hidden opacity-50 hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center shadow-sm">
              <img src={product.image} alt="Thumbnail 3" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>

        {}
        <div className="space-y-8">
          
          {}
          <div className="border-b border-zinc-200 pb-5 space-y-3">
            <h1 className="font-display text-3xl font-black text-zinc-900 tracking-tight leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1 text-zinc-900">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-orange-500 stroke-none" />
                ))}
                <span className="ml-1 mt-0.5">5.0</span>
              </div>
              <span className="text-zinc-300">|</span>
              <span className="text-zinc-500">42 Customer Reviews</span>
            </div>

            <span className="text-2xl font-mono font-bold text-zinc-900 block mt-3">₱{product.price.toLocaleString()}</span>
          </div>

          {}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase text-zinc-900 tracking-wider">Product Overview</h4>
            <p className="text-zinc-600 text-sm leading-relaxed font-semibold">
              {product.description}
            </p>
            <p className="text-zinc-500 text-xs leading-relaxed font-semibold">
              Designed and engineered directly by the Runnicle sports lab. We source lightweight performance elements that withstand intense daily runs, ensuring moisture control, heat cooling, and durability.
            </p>
          </div>

          {}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase text-zinc-900 tracking-wider">Select Color</h4>
            <div className="flex gap-2.5">
              {product.colors.map((col: string) => (
                <button
                  key={col}
                  onClick={() => setSelectedColor(col)}
                  className={`rounded-md border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    selectedColor === col
                      ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/10'
                      : 'border-zinc-200 text-zinc-650 bg-white hover:border-zinc-350 hover:text-orange-500'
                  }`}
                >
                  {col}
                </button>
              ))}
            </div>
          </div>

          {}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase text-zinc-900 tracking-wider">Select Size</h4>
            <div className="flex flex-wrap gap-2.5">
              {product.sizes.map((sz: string) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`rounded-md border px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    selectedSize === sz
                      ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/10'
                      : 'border-zinc-200 text-zinc-650 bg-white hover:border-zinc-350 hover:text-orange-500'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {}
          <div className="pt-4 border-t border-zinc-200">
            <button
              onClick={onAddToCart}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3.5 rounded-md bg-orange-500 px-10 py-4 text-sm font-black text-white hover:bg-orange-600 active:scale-98 transition-all duration-200 cursor-pointer uppercase tracking-wider shadow-lg shadow-orange-500/10"
            >
              <ShoppingBag className="h-5 w-5" />
              Add to Cart
            </button>
          </div>

          {}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-[10px] text-zinc-500 font-bold border-t border-zinc-200 pt-6">
            <div className="flex gap-2 items-start">
              <Truck className="h-4.5 w-4.5 text-zinc-400 flex-shrink-0" />
              <div>
                <span className="text-zinc-800 block font-black">Free Shipping</span>
                <span className="mt-0.5 block">On all orders over ₱3,000</span>
              </div>
            </div>
            <div className="flex gap-2 items-start">
              <RotateCcw className="h-4.5 w-4.5 text-zinc-400 flex-shrink-0" />
              <div>
                <span className="text-zinc-800 block font-black">30-Day Returns</span>
                <span className="mt-0.5 block">Hassle-free sizing exchanges</span>
              </div>
            </div>
            <div className="flex gap-2 items-start">
              <ShieldCheck className="h-4.5 w-4.5 text-zinc-400 flex-shrink-0" />
              <div>
                <span className="text-zinc-800 block font-black">Official Warranty</span>
                <span className="mt-0.5 block">100% performance satisfaction</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
export default ProductDetailsPage;
