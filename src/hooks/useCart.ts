import { useState, useEffect } from 'react';
import { type CartItem } from '../pages/CartPage';
import { type Product } from '../types';

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const stored = localStorage.getItem('runnicle_cart_items');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('runnicle_cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (product: Product, size?: string, color?: string) => {
    const itemSize = size || product.sizes[0] || 'Standard';
    const itemColor = color || product.colors[0] || 'Default';

    setCartItems((prev) => {
      const existIdx = prev.findIndex(
        (item) => item.product.id === product.id && item.size === itemSize && item.color === itemColor
      );

      if (existIdx > -1) {
        const copy = [...prev];
        copy[existIdx].quantity += 1;
        return copy;
      } else {
        return [...prev, { product, quantity: 1, size: itemSize, color: itemColor }];
      }
    });
  };

  const handleUpdateCartQuantity = (idx: number, delta: number) => {
    setCartItems((prev) => {
      const copy = [...prev];
      const newQty = copy[idx].quantity + delta;

      if (newQty <= 0) {
        copy.splice(idx, 1);
      } else {
        copy[idx].quantity = newQty;
      }
      return copy;
    });
  };

  const handleRemoveCartItem = (idx: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  return {
    cartItems,
    setCartItems,
    handleAddToCart,
    handleUpdateCartQuantity,
    handleRemoveCartItem,
    handleClearCart
  };
}
export type UseCartReturn = ReturnType<typeof useCart>;
