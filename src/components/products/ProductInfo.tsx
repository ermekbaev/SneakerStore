// src/components/product/ProductInfo.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface Color {
  id: number;
  name: string;
  colorCode?: string;
}

interface Size {
  id: number;
  value: string;
  available: boolean;
}

interface Product {
  slug: string;
  Name: string;
  brandName: string;
  Price: number;
  originalPrice?: number;
  colors: Color[];
  sizes: Size[];
  genders: string[];
  categoryName: string;
  description: string;
  isNew: boolean;
  isSale: boolean;
  rating: number;
  reviewsCount: number;
  stock: number;
  gallery: Array<{
    url: string;
    alt: string;
    colorName?: string;
  }>;
}

interface ProductInfoProps {
  product: Product;
  selectedColor: Color | null;
  selectedSize: { id: number; value: string } | null;
  quantity: number;
  onColorChange: (color: Color) => void;
  onSizeChange: (size: { id: number; value: string }) => void;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  onToggleFavorite: () => void;
  isAddingToCart: boolean;
  isInCart: boolean;
  quantityInCart: number;
  isFavorite: boolean;
  onImageChange?: (imageIndex: number) => void; // ✅ Добавляем недостающий проп
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  selectedColor,
  selectedSize,
  quantity,
  onColorChange,
  onSizeChange,
  onQuantityChange,
  onAddToCart,
  onToggleFavorite,
  isAddingToCart,
  isInCart,
  quantityInCart,
  isFavorite,
  onImageChange // ✅ Добавляем в деструктуризацию
}) => {
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
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="half-fill">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#e5e7eb" />
              </linearGradient>
            </defs>
            <path fill="url(#half-fill)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} className="w-5 h-5 text-gray-200" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        );
      }
    }

    return stars;
  };

  // ✅ ФУНКЦИЯ ПОЛУЧЕНИЯ ЦВЕТА
  const getColorCode = (color: Color): string => {
    // Если есть colorCode из API - используем его
    if (color.colorCode) {
      console.log('🎨 Используем colorCode из API:', color.name, '→', color.colorCode);
      return color.colorCode;
    }
    
    // Если нет colorCode из API - используем маппинг по названию
    console.log('🎨 ColorCode не найден в API для:', color.name, 'используем маппинг');
    
    const colorMap: Record<string, string> = {
      'Черный': '#1a1a1a', 'Чёрный': '#1a1a1a', 'Black': '#1a1a1a',
      'Белый': '#ffffff', 'White': '#ffffff',
      'Красный': '#dc2626', 'Red': '#dc2626', 'Красная': '#dc2626',
      'Синий': '#2563eb', 'Blue': '#2563eb', 'Синяя': '#2563eb', 'Синие': '#2563eb',
      'Зеленый': '#059669', 'Зелёный': '#059669', 'Green': '#059669', 'Зеленая': '#059669', 'Зеленые': '#059669',
      'Желтый': '#eab308', 'Жёлтый': '#eab308', 'Yellow': '#eab308', 'Желтая': '#eab308',
      'Серый': '#6b7280', 'Gray': '#6b7280', 'Grey': '#6b7280', 'Серая': '#6b7280',
      'Коричневый': '#92400e', 'Brown': '#92400e', 'Коричневая': '#92400e',
      'Розовый': '#ec4899', 'Pink': '#ec4899', 'Розовая': '#ec4899',
      'Фиолетовый': '#7c3aed', 'Purple': '#7c3aed', 'Фиолетовая': '#7c3aed',
      'Оранжевый': '#ea580c', 'Orange': '#ea580c', 'Оранжевая': '#ea580c',
    };

    return colorMap[color.name] || '#6b7280';
  };

  // ✅ ФУНКЦИЯ СМЕНЫ ЦВЕТА С ПЕРЕКЛЮЧЕНИЕМ ИЗОБРАЖЕНИЯ
  const handleColorChange = (color: Color) => {
    console.log('🎨 Смена цвета на:', color.name);
    
    // Меняем выбранный цвет
    onColorChange(color);
    
    // ✅ Ищем первое изображение для этого цвета в галерее
    if (onImageChange && product.gallery) {
      const colorImageIndex = product.gallery.findIndex(img => 
        img.alt && img.alt.toLowerCase().includes(color.name.toLowerCase())
      );
      
      if (colorImageIndex !== -1) {
        console.log('🖼️ Найдено изображение для цвета:', color.name, 'индекс:', colorImageIndex);
        onImageChange(colorImageIndex);
      } else {
        console.log('🖼️ Изображение для цвета не найдено, остаемся на текущем');
      }
    }
  };

  const availableSizes = product.sizes.filter(size => size.available);
  const discount = product.originalPrice && product.originalPrice > product.Price 
    ? Math.round(((product.originalPrice - product.Price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Badges */}
      <div className="flex flex-wrap gap-2">
        {product.isNew && <Badge variant="new">Новинка</Badge>}
        {product.isSale && <Badge variant="sale">Скидка</Badge>}
        {discount > 0 && <Badge variant="sale">-{discount}%</Badge>}
        {product.stock <= 5 && product.stock > 0 && (
          <Badge variant="warning">Осталось {product.stock} шт.</Badge>
        )}
        {product.stock === 0 && <Badge variant="destructive">Нет в наличии</Badge>}
      </div>

      {/* Brand */}
      <div className="text-emerald-600 font-semibold text-lg">
        {product.brandName}
      </div>

      {/* Product Name */}
      <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
        {product.Name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          {renderStars(product.rating)}
        </div>
        <span className="text-lg font-medium text-gray-700">
          {product.rating.toFixed(1)}
        </span>
        <span className="text-gray-500">
          ({product.reviewsCount} отзывов)
        </span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-4">
        <span className="text-3xl font-bold text-gray-900">
          {formatPrice(product.Price)}
        </span>
        {product.originalPrice && product.originalPrice > product.Price && (
          <span className="text-xl text-gray-500 line-through">
            {formatPrice(product.originalPrice)}
          </span>
        )}
      </div>

      {/* Short Description */}
      {product.description && (
        <p className="text-gray-600 leading-relaxed">
          {product.description.slice(0, 200)}
          {product.description.length > 200 && '...'}
        </p>
      )}

      {/* Color Selection */}
      {product.colors.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Цвет: {selectedColor?.name || 'Выберите цвет'}
          </h3>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color) => {
              const colorCode = getColorCode(color);
              
              return (
                <button
                  key={color.id}
                  onClick={() => handleColorChange(color)} // ✅ Используем нашу функцию
                  className={`relative flex items-center gap-3 px-4 py-3 border-2 rounded-lg transition-all duration-200 min-w-[120px] ${
                    selectedColor?.id === color.id
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-emerald-300 bg-white'
                  }`}
                >
                  <div
                    className="w-6 h-6 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: colorCode }}
                    title={`Цвет: ${color.name}${color.colorCode ? ` (${color.colorCode})` : ''}`}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {color.name}
                  </span>
                  {selectedColor?.id === color.id && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {availableSizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Размер: {selectedSize?.value || 'Выберите размер'}
            </h3>
            <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
              Таблица размеров
            </button>
          </div>
          <div className="grid grid-cols-4 lg:grid-cols-6 gap-3">
            {product.sizes.map((size) => (
              <button
                key={size.id}
                onClick={() => size.available && onSizeChange({ id: size.id, value: size.value })}
                disabled={!size.available}
                className={`px-4 py-3 border-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedSize?.id === size.id
                    ? 'border-emerald-500 bg-emerald-500 text-white'
                    : size.available
                    ? 'border-gray-200 hover:border-emerald-300 bg-white text-gray-700'
                    : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {size.value}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">Количество</h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-gray-200 rounded-lg">
            <button
              onClick={() => quantity > 1 && onQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
              </svg>
            </button>
            <span className="px-4 py-2 font-medium text-gray-900 min-w-[50px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => quantity < product.stock && onQuantityChange(quantity + 1)}
              disabled={quantity >= product.stock}
              className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </div>
          {quantityInCart > 0 && (
            <span className="text-sm text-gray-500">
              В корзине: {quantityInCart} шт.
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-4 pt-4">
        <div className="flex gap-4">
          <Button
            variant="gradient"
            size="lg"
            onClick={onAddToCart}
            disabled={isAddingToCart || !selectedColor || !selectedSize || product.stock <= 0}
            className="flex-1"
          >
            {isAddingToCart ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Добавление...
              </>
            ) : isInCart ? (
              'Уже в корзине'
            ) : product.stock <= 0 ? (
              'Нет в наличии'
            ) : (
              'Добавить в корзину'
            )}
          </Button>

          <Button
            variant={isFavorite ? "default" : "outline"}
            size="lg"
            onClick={onToggleFavorite}
          >
            <svg
              className={`w-5 h-5 ${isFavorite ? 'text-white' : 'text-gray-600'}`}
              fill={isFavorite ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </Button>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Быстрая доставка
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Гарантия качества
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            Легкий возврат
          </div>
        </div>
      </div>

      {/* Product Meta */}
      <div className="pt-4 border-t border-gray-200 space-y-2 text-sm text-gray-600">
        <div>Артикул: {product.slug.toUpperCase()}</div>
        <div>Категория: {product.categoryName}</div>
        <div>Пол: {product.genders.join(', ')}</div>
      </div>
    </div>
  );
};

export default ProductInfo;