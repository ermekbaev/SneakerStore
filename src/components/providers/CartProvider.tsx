// src/contexts/CartContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

// Интерфейсы
export interface CartItem {
  id: string;
  productSlug: string;
  name: string;
  price: number;
  imageUrl: string;
  color: { id: number; name: string };
  size: number;
  quantity: number;
}

export interface CartSummary {
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
}

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  error: string | null;
  addToCart: (
    product: { slug: string; Name: string; Price: number; imageUrl: string },
    color: { id: number; Name: string },
    size: number
  ) => Promise<boolean>;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  calculateSummary: () => CartSummary;
  clearCart: () => Promise<boolean>;
  loadCart: () => void;
  isInCart: (productSlug: string, colorId: number, size: number) => boolean;
  getItemQuantity: (productSlug: string, colorId: number, size: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загружаем корзину при инициализации
  useEffect(() => {
    console.log('🛒 CartProvider: Инициализация провайдера корзины');
    loadCart();
  }, []);

  // Сохраняем корзину в localStorage при изменении
  useEffect(() => {
    if (!loading && typeof window !== 'undefined') {
      try {
        console.log('💾 CartProvider: Сохраняем корзину в localStorage:', cartItems.length, 'товаров');
        localStorage.setItem('cart', JSON.stringify(cartItems));
      } catch (err) {
        console.error('❌ CartProvider: Ошибка при сохранении корзины:', err);
      }
    }
  }, [cartItems, loading]);

  // Функция загрузки корзины из localStorage
  const loadCart = useCallback(() => {
    console.log('📂 CartProvider: Загружаем корзину из localStorage');
    
    try {
      setLoading(true);
      
      if (typeof window !== 'undefined') {
        const storedCart = localStorage.getItem('cart');
        console.log('📋 CartProvider: Данные из localStorage:', storedCart ? 'найдены' : 'отсутствуют');
        
        if (storedCart) {
          const parsedCart = JSON.parse(storedCart);
          
          // Валидируем структуру данных
          if (Array.isArray(parsedCart)) {
            setCartItems(parsedCart);
            console.log('✅ CartProvider: Корзина загружена успешно, товаров:', parsedCart.length);
          } else {
            console.warn('⚠️ CartProvider: Некорректные данные в localStorage');
            setCartItems([]);
          }
        } else {
          console.log('📭 CartProvider: Корзина пуста в localStorage');
          setCartItems([]);
        }
      }
      
      setError(null);
    } catch (err) {
      console.error('❌ CartProvider: Ошибка при загрузке корзины:', err);
      setError('Не удалось загрузить корзину');
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Функция добавления товара в корзину
  const addToCart = useCallback(async (
    product: { slug: string; Name: string; Price: number; imageUrl: string },
    color: { id: number; Name: string },
    size: number
  ): Promise<boolean> => {
    console.log('🛒 CartProvider: Добавляем товар в корзину:', product.slug);
    
    try {
      const itemId = `${product.slug}-${color.id}-${size}`;
      console.log('🔗 CartProvider: ID товара:', itemId);
      
      setCartItems(prevItems => {
        console.log('📋 CartProvider: Текущие товары в корзине:', prevItems.length);
        
        const existingItemIndex = prevItems.findIndex(item => item.id === itemId);
        
        if (existingItemIndex !== -1) {
          // Увеличиваем количество существующего товара
          console.log('➕ CartProvider: Увеличиваем количество существующего товара');
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + 1
          };
          return updatedItems;
        } else {
          // Добавляем новый товар
          console.log('🆕 CartProvider: Добавляем новый товар');
          const newItem: CartItem = {
            id: itemId,
            productSlug: product.slug,
            name: product.Name,
            price: product.Price,
            imageUrl: product.imageUrl,
            color: { id: color.id, name: color.Name },
            size,
            quantity: 1
          };
          
          const newItems = [...prevItems, newItem];
          console.log('✅ CartProvider: Новая корзина содержит товаров:', newItems.length);
          return newItems;
        }
      });
      
      setError(null);
      console.log('🎉 CartProvider: Товар успешно добавлен');
      return true;
    } catch (err) {
      console.error('💥 CartProvider: Ошибка при добавлении в корзину:', err);
      setError('Не удалось добавить товар в корзину');
      return false;
    }
  }, []);

  // Функция удаления товара из корзины
  const removeFromCart = useCallback((itemId: string) => {
    console.log('🗑️ CartProvider: Удаляем товар:', itemId);
    setCartItems(prevItems => {
      const filteredItems = prevItems.filter(item => item.id !== itemId);
      console.log('✅ CartProvider: Товар удален, осталось товаров:', filteredItems.length);
      return filteredItems;
    });
    setError(null);
  }, []);

  // Функция обновления количества товара
  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    console.log('🔄 CartProvider: Обновляем количество товара:', itemId, 'новое количество:', quantity);
    
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === itemId 
          ? { ...item, quantity }
          : item
      )
    );
    setError(null);
  }, [removeFromCart]);

  // Функция расчета итогов корзины
  const calculateSummary = useCallback((): CartSummary => {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    
    // Логика расчета доставки (бесплатная доставка от 5000 рублей)
    const shipping = subtotal >= 5000 ? 0 : 500;
    const total = subtotal + shipping;
    
    return {
      subtotal,
      shipping,
      total,
      itemCount
    };
  }, [cartItems]);

  // Функция очистки корзины
  const clearCart = useCallback(async (): Promise<boolean> => {
    console.log('🧹 CartProvider: Очищаем корзину');
    try {
      setCartItems([]);
      setError(null);
      return true;
    } catch (err) {
      console.error('❌ CartProvider: Ошибка при очистке корзины:', err);
      setError('Не удалось очистить корзину');
      return false;
    }
  }, []);

  // Функция проверки наличия товара в корзине
  const isInCart = useCallback((productSlug: string, colorId: number, size: number): boolean => {
    const itemId = `${productSlug}-${colorId}-${size}`;
    return cartItems.some(item => item.id === itemId);
  }, [cartItems]);

  // Функция получения количества конкретного товара в корзине
  const getItemQuantity = useCallback((productSlug: string, colorId: number, size: number): number => {
    const itemId = `${productSlug}-${colorId}-${size}`;
    const item = cartItems.find(item => item.id === itemId);
    return item ? item.quantity : 0;
  }, [cartItems]);

  const value: CartContextType = {
    cartItems,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    calculateSummary,
    clearCart,
    loadCart,
    isInCart,
    getItemQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// Хук для использования контекста корзины
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default useCart;