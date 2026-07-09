import React from 'react';
import { type Product } from '../data/mockData';
import { ArrowRight } from 'lucide-react';

interface BibsAndMerchProps {
  products: Product[];
  onViewAllClick?: () => void;
  onProductClick?: (product: Product) => void;
}

export const BibsAndMerch: React.FC<BibsAndMerchProps> = ({ onViewAllClick }) => {
  const customProducts = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=800&q=80',
      tag: 'Running gear / accessories',
      title: 'MegaWorld Fun Run Singlet',
      sub: 'Includes sponsor logos',
      price: 'P 250',
      buttonClass: 'bg-[#FF4400] text-white hover:bg-[#E63D00]'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80',
      tag: 'Running gear / accessories',
      title: 'MegaWorld Fun Run Race Kit',
      sub: 'Includes race bib & gear',
      price: 'P 600',
      buttonClass: 'bg-[#FF4400] text-white hover:bg-[#E63D00]'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80',
      tag: 'Running gear / accessories',
      title: 'MegaWorld Fun Run Race Kit',
      sub: 'Includes race bib & gear',
      price: 'P 600',
      buttonClass: 'bg-zinc-400 text-white cursor-not-allowed',
      grayscale: true
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <h2 className="font-sans text-4xl font-bold tracking-tight text-zinc-900 mb-2">
              Bibs & <span className="font-serif italic text-[#FF4400] font-bold">Merch</span>
            </h2>
            <p className="text-sm text-black font-normal">
              Every race is a milestone. Wear yours proud.
            </p>
          </div>
          <button
            onClick={onViewAllClick}
            className="font-sans mt-4 sm:mt-0 text-sm sm:text-base font-bold tracking-wider text-black hover:text-[#FF4400] transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            View all <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {customProducts.map((product) => (
            <div key={product.id} className="flex flex-col bg-white overflow-hidden text-left rounded-[7px] border border-[#B0B0B0] h-full">
              <div className="relative aspect-square bg-zinc-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className={`w-full h-full object-cover ${product.grayscale ? 'grayscale opacity-80' : ''}`}
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="mb-4">
                  <span className="font-sans inline-block rounded-[4px] border border-[#FF4400] px-3 py-1 text-[11px] font-bold tracking-wider text-[#FF4400]">
                    {product.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-zinc-900 mb-2">{product.title}</h3>
                <p className="text-[11px] text-zinc-400 font-semibold mb-4 tracking-wide">
                  {product.sub}
                </p>
                <div className="text-lg font-bold text-zinc-900 mb-6">
                  {product.price}
                </div>
                <div className="mt-auto">
                  <button
                    className={`font-sans w-full py-3.5 text-[12px] font-bold tracking-wider transition-colors rounded-[7px] ${product.buttonClass}`}
                  >
                    View details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BibsAndMerch;
