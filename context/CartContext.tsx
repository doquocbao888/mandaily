'use client';

import React, { createContext, useContext, useState, useSyncExternalStore } from 'react';

export interface CartItem {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  numericPrice: number;
  quantity: number;
  imageSrc: string;
  variantName?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (id: string, variantName?: string) => void;
  updateQuantity: (id: string, quantity: number, variantName?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  openCheckout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const subscribe = (callback: () => void) => {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener('local-storage-updated', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('local-storage-updated', callback);
  };
};

const getCartSnapshot = () => {
  try {
    return localStorage.getItem('manscaped_cart_v1') || '[]';
  } catch {
    return '[]';
  }
};

const getServerCartSnapshot = () => '[]';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const cartJson = useSyncExternalStore(subscribe, getCartSnapshot, getServerCartSnapshot);
  const cart: CartItem[] = JSON.parse(cartJson);

  const saveCartToStorage = (updated: CartItem[]) => {
    try {
      localStorage.setItem('manscaped_cart_v1', JSON.stringify(updated));
      window.dispatchEvent(new Event('local-storage-updated'));
    } catch {
      // ignore
    }
  };

  const openCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const addToCart = (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    const qtyToAdd = newItem.quantity || 1;
    const existingIndex = cart.findIndex(
      (item) => item.id === newItem.id && item.variantName === newItem.variantName
    );
    let updated: CartItem[];
    if (existingIndex > -1) {
      updated = [...cart];
      updated[existingIndex].quantity += qtyToAdd;
    } else {
      updated = [...cart, { ...newItem, quantity: qtyToAdd }];
    }
    saveCartToStorage(updated);
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string, variantName?: string) => {
    const updated = cart.filter((item) => !(item.id === id && item.variantName === variantName));
    saveCartToStorage(updated);
  };

  const updateQuantity = (id: string, quantity: number, variantName?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, variantName);
      return;
    }
    const updated = cart.map((item) =>
      item.id === id && item.variantName === variantName ? { ...item, quantity } : item
    );
    saveCartToStorage(updated);
  };

  const clearCart = () => {
    saveCartToStorage([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.numericPrice * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        openCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
