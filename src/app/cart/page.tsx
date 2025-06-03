// src/app/cart/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import CartItem from '@/components/cart/CartItem';
import useCart from '@/components/providers/CartProvider';
import { useToast } from '@/components/providers/ToastProvider';

const CartPage = () => {
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

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Загрузка корзины...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Ошибка загрузки корзины</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Попробовать снова
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[500px]">
            <div className="text-center max-w-md">
              <div className="text-gray-400 mb-8">
                <svg className="w-32 h-32 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293A1 1 0 005 17h16M16 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
                </svg>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Ваша корзина пуста</h1>
              <p className="text-lg text-gray-600 mb-8">
                Добавьте товары в корзину, чтобы продолжить покупки
              </p>
              
              <div className="space-y-4">
                <Link href="/catalog">
                  <Button variant="gradient" size="lg" className="w-full">
                    Перейти в каталог
                  </Button>
                </Link>
                
                <Link href="/">
                  <Button variant="outline" size="lg" className="w-full">
                    На главную
                  </Button>
                </Link>
              </div>

              {/* Popular Categories */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-4">Популярные категории:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Link 
                    href="/catalog?brand=nike"
                    className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm hover:bg-emerald-200 transition-colors"
                  >
                    Nike
                  </Link>
                  <Link 
                    href="/catalog?brand=adidas"
                    className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm hover:bg-emerald-200 transition-colors"
                  >
                    Adidas
                  </Link>
                  <Link 
                    href="/catalog?gender=men"
                    className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm hover:bg-emerald-200 transition-colors"
                  >
                    Мужские
                  </Link>
                  <Link 
                    href="/catalog?gender=women"
                    className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm hover:bg-emerald-200 transition-colors"
                  >
                    Женские
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Cart Content
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-gray-900">Корзина</h1>
              <Badge variant="default" className="bg-emerald-600">
                {summary.itemCount} {summary.itemCount === 1 ? 'товар' : 'товаров'}
              </Badge>
            </div>
            
            <Button
              variant="outline"
              onClick={handleClearCart}
              className="text-gray-600 hover:text-red-600 hover:border-red-300"
            >
              Очистить корзину
            </Button>
          </div>
          
          {/* Breadcrumbs */}
          <nav className="flex mt-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link href="/" className="text-emerald-600 hover:text-emerald-700">
                  Главная
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-500">Корзина</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onQuantityChange={(quantity) => handleQuantityChange(item.id, quantity)}
                onRemove={() => handleRemoveItem(item.id)}
                compact={false}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Итоги заказа</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Товары ({summary.itemCount})</span>
                  <span className="font-medium">{formatPrice(summary.subtotal)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Доставка</span>
                  <span className={`font-medium ${summary.shipping === 0 ? 'text-emerald-600' : ''}`}>
                    {summary.shipping === 0 ? 'Бесплатно' : formatPrice(summary.shipping)}
                  </span>
                </div>
                
                {summary.shipping === 0 && summary.subtotal >= 5000 && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-emerald-700">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm font-medium">Бесплатная доставка!</span>
                    </div>
                    <p className="text-xs text-emerald-600 mt-1">
                      При заказе от 5000₽
                    </p>
                  </div>
                )}
                
                {summary.subtotal < 5000 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="text-blue-700 text-sm">
                      <strong>До бесплатной доставки: {formatPrice(5000 - summary.subtotal)}</strong>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(summary.subtotal / 5000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Итого</span>
                    <span className="text-lg font-bold text-emerald-600">
                      {formatPrice(summary.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="mt-6 space-y-3">
                <Link href="/checkout">
                  <Button variant="gradient" size="lg" className="w-full">
                    Оформить заказ
                  </Button>
                </Link>
                
                <Link href="/catalog">
                  <Button variant="outline" size="lg" className="w-full">
                    Продолжить покупки
                  </Button>
                </Link>
              </div>

              {/* Security Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Безопасная оплата</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    <span>30 дней на возврат</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span>Быстрая доставка</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;