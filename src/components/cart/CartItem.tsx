// src/components/cart/CartItem.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import type { CartItem as CartItemType } from '@/hooks/useCart';

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
  compact?: boolean; // Для компактного отображения в drawer vs полной странице
}

const CartItem: React.FC<CartItemProps> = ({ 
  item, 
  onQuantityChange, 
  onRemove,
  compact = false 
}) => {
  const [imageError, setImageError] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 0) return;
    
    setIsUpdating(true);
    try {
      await onQuantityChange(newQuantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const totalPrice = item.price * item.quantity;

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
      isUpdating ? 'opacity-50' : ''
    }`}>
      <div className="flex gap-4">
        {/* Product Image */}
        <div className={`flex-shrink-0 ${compact ? 'w-16 h-16' : 'w-20 h-20'} bg-gray-100 rounded-lg overflow-hidden`}>
          <Link href={`/product/${item.productSlug}`}>
            {!imageError && item.imageUrl ? (
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={compact ? 64 : 80}
                height={compact ? 64 : 80}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                onError={() => setImageError(true)}
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
                <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </Link>
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              {/* Product Name */}
              <Link 
                href={`/product/${item.productSlug}`}
                className="block hover:text-emerald-600 transition-colors"
              >
                <h3 className={`font-semibold text-gray-900 line-clamp-2 ${
                  compact ? 'text-sm' : 'text-base'
                }`}>
                  {item.name}
                </h3>
              </Link>

              {/* Product Details */}
              <div className={`mt-1 space-y-1 ${compact ? 'text-xs' : 'text-sm'} text-gray-600`}>
                <div className="flex items-center gap-4">
                  <span>Цвет: {item.color.name}</span>
                  <span>Размер: {item.size}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">
                    {formatPrice(item.price)} за шт.
                  </span>
                  
                  {!compact && item.quantity > 1 && (
                    <span className="text-emerald-600 font-medium">
                      = {formatPrice(totalPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Remove Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              disabled={isUpdating}
              className="text-gray-400 hover:text-red-500 transition-colors ml-2"
              title="Удалить из корзины"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </Button>
          </div>

          {/* Quantity Controls */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center border border-gray-200 rounded-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1 || isUpdating}
                className="px-2 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                </svg>
              </Button>
              
              <span className={`px-3 py-1 font-medium text-gray-900 min-w-[40px] text-center ${
                compact ? 'text-sm' : 'text-base'
              }`}>
                {item.quantity}
              </span>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={isUpdating || item.quantity >= 10} // Ограничение на 10 штук
                className="px-2 py-1 text-gray-600 hover:text-gray-800 disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </Button>
            </div>

            {/* Total Price */}
            <div className="text-right">
              <div className={`font-bold text-emerald-600 ${
                compact ? 'text-sm' : 'text-lg'
              }`}>
                {formatPrice(totalPrice)}
              </div>
              
              {compact && item.quantity > 1 && (
                <div className="text-xs text-gray-500">
                  {item.quantity} × {formatPrice(item.price)}
                </div>
              )}
            </div>
          </div>

          {/* Stock Warning */}
          {item.quantity >= 5 && (
            <div className="mt-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
              ⚠️ Большое количество товара
            </div>
          )}
        </div>
      </div>

      {/* Mobile: Simplified Layout */}
      <div className="sm:hidden">
        {/* Mobile layout can be different if needed */}
      </div>
    </div>
  );
};

export default CartItem;