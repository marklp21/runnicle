import React from 'react';
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, CreditCard } from 'lucide-react';
import { type Product } from '../data/mockData';

export interface CartItem {
  product: Product;
  quantity: number;
  color: string;
  size: string;
}

interface CartPageProps {
  cartItems: CartItem[];
  onUpdateQuantity: (idx: number, delta: number) => void;
  onRemoveItem: (idx: number) => void;
  onBackToStore: () => void;
  onCheckout: () => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onBackToStore,
  onCheckout,
}) => {
  
  
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = subtotal > 3000 ? 0 : subtotal === 0 ? 0 : 250;
  const tax = subtotal * 0.12; 
  const total = subtotal + shipping + tax;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      
      {}
      <button
        onClick={onBackToStore}
        className="inline-flex items-center gap-2 text-xs font-bold text-zinc-500 hover:text-orange-500 uppercase tracking-wider transition-colors mb-8 cursor-pointer group"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Store
      </button>

      {}
      <div className="border-b border-zinc-200 pb-5 mb-8">
        <h1 className="font-display text-4xl font-black text-zinc-900 tracking-tight">
          Your Shopping Cart
        </h1>
        <p className="mt-2 text-sm text-zinc-500 font-medium">
          Review your selected race apparel and training equipment items before proceeding to checkout.
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-20 rounded-xl border border-zinc-200 bg-zinc-50">
          <ShoppingBag className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
          <h3 className="text-zinc-800 font-bold text-lg">Your cart is empty</h3>
          <p className="text-zinc-550 text-xs mt-1.5 font-medium mb-6">You haven't added any items to your shopping cart yet.</p>
          <button
            onClick={onBackToStore}
            className="rounded-md bg-orange-500 px-6 py-3.5 text-xs font-bold text-white hover:bg-orange-600 transition-colors uppercase tracking-wider cursor-pointer"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          {/* Items list */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-4 rounded-xl border border-zinc-200 bg-white hover:border-orange-200 hover:shadow-sm transition-colors shadow-sm"
              >
                {/* Product image */}
                <div className="h-20 w-20 rounded-lg overflow-hidden bg-zinc-50 flex-shrink-0 flex items-center justify-center border border-zinc-100">
                  <img src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-zinc-900 truncate">{item.product.name}</h3>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-zinc-500 mt-1 font-semibold">
                    <span>Color: {item.color}</span>
                    <span>•</span>
                    <span>Size: {item.size}</span>
                    <span>•</span>
                    <span>Price: ₱{item.product.price.toLocaleString()}</span>
                  </div>

                  {/* Quantity and Actions (Mobile layouts merge) */}
                  <div className="flex sm:hidden items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(idx, -1)}
                        className="p-1 rounded bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 cursor-pointer"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-xs font-bold text-zinc-900 px-1">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(idx, 1)}
                        className="p-1 rounded bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 cursor-pointer"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(idx)}
                      className="text-zinc-400 hover:text-red-500 transition-colors p-1.5 cursor-pointer"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>

                {/* Quantity and Actions (Desktop layout) */}
                <div className="hidden sm:flex items-center gap-6">
                  {/* Quantity selector */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onUpdateQuantity(idx, -1)}
                      className="p-1 rounded bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 transition-colors cursor-pointer"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-xs font-bold text-zinc-900 w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(idx, 1)}
                      className="p-1 rounded bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 transition-colors cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Total price */}
                  <span className="text-sm font-bold text-zinc-900 w-20 text-right font-mono">
                    ₱{(item.product.price * item.quantity).toLocaleString()}
                  </span>

                  {/* Trash action */}
                  <button
                    onClick={() => onRemoveItem(idx)}
                    className="text-zinc-400 hover:text-red-500 transition-colors p-1.5 cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* Checkout Card Summary */}
          <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm space-y-6">
            <h3 className="font-sans text-base font-bold text-zinc-900 tracking-tight uppercase border-b border-zinc-200 pb-4">
              Order Summary
            </h3>

            <div className="space-y-3.5 text-xs font-semibold text-zinc-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-zinc-900">₱{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Est.</span>
                <span className="text-zinc-900">
                  {shipping === 0 ? 'Free Shipping' : `₱${shipping.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated VAT (12%)</span>
                <span className="text-zinc-900">₱{tax.toLocaleString()}</span>
              </div>
              
              <div className="border-t border-zinc-200 pt-4 flex justify-between text-sm font-bold">
                <span className="text-zinc-900">Total Est.</span>
                <span className="text-orange-600 font-mono font-bold">₱{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={onCheckout}
              className="w-full rounded-md bg-orange-500 py-4 mt-6 text-sm font-black text-white hover:bg-orange-600 active:scale-98 transition-all duration-200 uppercase tracking-wider cursor-pointer inline-flex items-center justify-center gap-2 shadow-md shadow-orange-500/10"
            >
              <CreditCard className="h-4 w-4" />
              Proceed to Checkout
            </button>

            {shipping > 0 && (
              <p className="text-[10px] text-zinc-550 text-center font-medium leading-relaxed">
                Add <span className="text-zinc-800 font-bold">₱{(3000 - subtotal).toLocaleString()}</span> more to qualify for Free Shipping!
              </p>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
export default CartPage;
