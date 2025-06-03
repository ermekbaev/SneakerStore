// src/components/cart/CartDrawer.tsx
'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import CartItem from './CartItem';
import useCart from '../providers/CartProvider';
import { useToast } from '@/components/providers/ToastProvider';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { 
    cartItems, 
    loading, 
    error, 
    updateQuantity, 
    removeFromCart, 
    calculateSummary,
    clearCart 
  } = useCart();
  
  const { success, error: showError } = useToast();
  const summary = calculateSummary();

  // Закрытие при нажатии Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Блокируем скролл body
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleQuantityChange = async (itemId: string, quantity: number) => {
    try {
      updateQuantity(itemId, quantity);
      if (quantity === 0) {
        success('Товар удален из корзины');
      }
    } catch (error) {
      showError('Не удалось обновить количество');
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      removeFromCart(itemId);
      success('Товар удален из корзины');
    } catch (error) {
      showError('Не удалось удалить товар');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Вы уверены, что хотите очистить корзину?')) {
      try {
        await clearCart();
        success('Корзина очищена');
        onClose();
      } catch (error) {
        showError('Не удалось очистить корзину');
      }
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen 
            ? 'opacity-100 pointer-events-auto' 
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
      </div>

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900">Корзина</h2>
              {summary.itemCount > 0 && (
                <Badge variant="default" className="bg-emerald-600">
                  {summary.itemCount}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {cartItems.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearCart}
                  className="text-gray-500 hover:text-red-600"
                >
                  Очистить
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {loading ? (
              // Loading State
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Загрузка корзины...</p>
                </div>
              </div>
            ) : error ? (
              // Error State
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center">
                  <div className="text-red-500 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ошибка загрузки</h3>
                  <p className="text-gray-600 mb-4">{error}</p>
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Попробовать снова
                  </Button>
                </div>
              </div>
            ) : cartItems.length === 0 ? (
              // Empty State
              <div className="flex-1 flex items-center justify-center p-6">
                <div className="text-center">
                  <div className="text-gray-400 mb-6">
                    <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293A1 1 0 005 17h16M16 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Корзина пуста</h3>
                  <p className="text-gray-600 mb-6">Добавьте товары в корзину, чтобы продолжить покупки</p>
                  
                  <Link href="/catalog" onClick={onClose}>
                    <Button variant="gradient" size="lg" className="w-full">
                      Перейти в каталог
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              // Cart Items
              <>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {cartItems.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onQuantityChange={(quantity) => handleQuantityChange(item.id, quantity)}
                      onRemove={() => handleRemoveItem(item.id)}
                    />
                  ))}
                </div>

                {/* Summary */}
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Товары ({summary.itemCount})</span>
                      <span className="font-medium">{formatPrice(summary.subtotal)}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Доставка</span>
                      <span className={`font-medium ${summary.shipping === 0 ? 'text-emerald-600' : ''}`}>
                        {summary.shipping === 0 ? 'Бесплатно' : formatPrice(summary.shipping)}
                      </span>
                    </div>
                    
                    {summary.shipping === 0 && summary.subtotal >= 5000 && (
                      <div className="text-xs text-emerald-600 bg-emerald-50 p-2 rounded">
                        🎉 Бесплатная доставка при заказе от 5000₽
                      </div>
                    )}
                    
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-gray-900">Итого</span>
                        <span className="text-lg font-bold text-emerald-600">
                          {formatPrice(summary.total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Link href="/checkout" onClick={onClose}>
                      <Button variant="gradient" size="lg" className="w-full">
                        Оформить заказ
                      </Button>
                    </Link>
                    
                    <Link href="/cart" onClick={onClose}>
                      <Button variant="outline" size="lg" className="w-full">
                        Перейти в корзину
                      </Button>
                    </Link>
                  </div>

                  {/* Security Badge */}
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Безопасная оплата
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;