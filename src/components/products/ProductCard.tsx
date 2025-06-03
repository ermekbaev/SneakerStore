// src/components/products/ProductCard.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

// Утилита для получения кода цвета
const getColorCode = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    // Основные цвета
    'Черный': '#1a1a1a',
    'Чёрный': '#1a1a1a',
    'Black': '#1a1a1a',
    'Белый': '#ffffff',
    'White': '#ffffff',
    'Красный': '#dc2626',
    'Red': '#dc2626',
    'Синий': '#2563eb',
    'Blue': '#2563eb',
    'Зеленый': '#059669',
    'Зелёный': '#059669',
    'Green': '#059669',
    'Желтый': '#eab308',
    'Жёлтый': '#eab308',
    'Yellow': '#eab308',
    'Серый': '#6b7280',
    'Gray': '#6b7280',
    'Grey': '#6b7280',
    'Коричневый': '#92400e',
    'Brown': '#92400e',
    'Розовый': '#ec4899',
    'Pink': '#ec4899',
    'Фиолетовый': '#7c3aed',
    'Purple': '#7c3aed',
    'Оранжевый': '#ea580c',
    'Orange': '#ea580c',
    'Голубой': '#0ea5e9',
    'Navy': '#1e3a8a',
    'Темно-синий': '#1e3a8a',
    
    // Дополнительные оттенки
    'Бежевый': '#f5f5dc',
    'Beige': '#f5f5dc',
    'Хаки': '#9ca3af',
    'Khaki': '#9ca3af',
    'Золотой': '#fbbf24',
    'Gold': '#fbbf24',
    'Серебряный': '#e5e7eb',
    'Silver': '#e5e7eb',
    'Бордовый': '#991b1b',
    'Maroon': '#991b1b',
    'Teal': '#0d9488',
    'Бирюзовый': '#0d9488',
    'Lime': '#65a30d',
    'Лайм': '#65a30d',
    'Индиго': '#4338ca',
    'Indigo': '#4338ca',
    
    // Сложные названия
    'Темно-серый': '#374151',
    'Светло-серый': '#d1d5db',
    'Темно-зеленый': '#064e3b',
    'Светло-голубой': '#7dd3fc',
    'Мультиколор': 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #f9ca24)',
    'Multicolor': 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #f9ca24)',
  };

  // Проверяем точное совпадение
  if (colorMap[colorName]) {
    return colorMap[colorName];
  }
  
  // Проверяем частичное совпадение (без учета регистра)
  const lowerColorName = colorName.toLowerCase();
  for (const [key, value] of Object.entries(colorMap)) {
    if (key.toLowerCase().includes(lowerColorName) || lowerColorName.includes(key.toLowerCase())) {
      return value;
    }
  }
  
  // Если цвет не найден, возвращаем серый
  return '#6b7280';
};

interface ProductCardProps {
  product: {
    slug: string;
    Name: string;
    Price: number;
    originalPrice?: number;
    imageUrl: string;
    brandName: string;
    categoryName?: string;
    description?: string;
    isNew?: boolean;
    isSale?: boolean;
    rating?: number;
    colors?: string[];
    sizes?: number[];
    genders?: string[];
  };
  onAddToCart?: () => void;
  onToggleFavorite?: () => void;
  isFavorite?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);

    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg 
          key={i} 
          className={`w-4 h-4 ${i < fullStars ? 'text-yellow-400' : 'text-gray-200'}`}
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

  return (
    <Card 
      className="group cursor-pointer overflow-hidden bg-white hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <Link href={`/product/${product.slug}`}>
            {!imageError && product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.Name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onError={() => {
                  console.log('Image failed to load:', product.imageUrl);
                  setImageError(true);
                }}
                priority={false}
                unoptimized={process.env.NODE_ENV === 'development'}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
                <div className="text-center text-emerald-400">
                  <svg className="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">{product.brandName}</span>
                  <span className="text-xs block mt-1 text-emerald-300">Товар</span>
                </div>
              </div>
            )}
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <Badge variant="new" className="text-xs">
                NEW
              </Badge>
            )}
            {product.isSale && (
              <Badge variant="sale" className="text-xs">
                SALE
              </Badge>
            )}
          </div>

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-3 right-3 bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg transition-all duration-200 ${
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite?.();
            }}
          >
            <svg
              className={`h-5 w-5 transition-colors ${
                isFavorite ? 'text-red-500' : 'text-gray-600'
              }`}
              fill={isFavorite ? 'currentColor' : 'none'}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </Button>

          {/* Quick Actions */}
          <div className={`absolute bottom-3 left-3 right-3 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <Button
              variant="gradient"
              className="w-full shadow-lg"
              onClick={(e) => {
                e.preventDefault();
                onAddToCart?.();
              }}
            >
              Добавить в корзину
            </Button>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Brand */}
          <div className="text-sm text-emerald-600 font-medium">
            {product.brandName}
          </div>

          {/* Product Name */}
          <Link href={`/product/${product.slug}`}>
            <h3 className="font-semibold text-gray-900 line-clamp-2 hover:text-emerald-600 transition-colors leading-tight">
              {product.Name}
            </h3>
          </Link>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {renderStars(product.rating)}
              </div>
              <span className="text-sm text-gray-500">
                {product.rating.toFixed(1)}
              </span>
            </div>
          )}

          {/* Colors */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Цвета:</span>
              <div className="flex gap-1">
                {product.colors.slice(0, 4).map((color, index) => {
                  const colorCode = getColorCode(color);
                  const isGradient = colorCode.includes('gradient');
                  
                  return (
                    <div
                      key={index}
                      className="w-4 h-4 rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors"
                      style={isGradient 
                        ? { background: colorCode } 
                        : { backgroundColor: colorCode }
                      }
                      title={color}
                    />
                  );
                })}
                {product.colors.length > 4 && (
                  <span className="text-xs text-gray-400 ml-1">
                    +{product.colors.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="text-sm text-gray-500">
              Размеры: {product.sizes.slice(0, 3).join(', ')}
              {product.sizes.length > 3 && '...'}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                {formatPrice(product.Price)}
              </span>
              {product.originalPrice && product.originalPrice > product.Price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            
            {product.isSale && product.originalPrice && (
              <Badge variant="sale" className="text-xs">
                -{Math.round(((product.originalPrice - product.Price) / product.originalPrice) * 100)}%
              </Badge>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default ProductCard;