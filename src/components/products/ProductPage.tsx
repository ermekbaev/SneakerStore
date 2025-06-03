// src/components/product/ProductPage.tsx - АДАПТИВНАЯ ВЕРСИЯ
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductImages from './ProductImages';
import ProductInfo from './ProductInfo';
import ProductTabs from './ProductTabs';
import ProductBreadcrumbs from './ProductBreadcrumbs';
import RelatedProducts from './RelatedProducts';
import useCart from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';
import { useToast } from '@/components/providers/ToastProvider';

interface Product {
  slug: string;
  Name: string;
  brandName: string;
  Price: number;
  imageUrl: string;
  gallery: Array<{
    url: string;
    alt: string;
    colorName?: string;
    colorId?: number;
    formats?: {
      small?: string;
      medium?: string;
      large?: string;
    };
  }>;
  colors: Array<{
    id: number;
    name: string;
    colorCode?: string;
  }>;
  sizes: Array<{
    id: number;
    value: string;
    available: boolean;
  }>;
  genders: string[];
  categoryName: string;
  description: string;
  features?: string[];
  models: any[];
  originalPrice?: number;
  isNew: boolean;
  isSale: boolean;
  featured: boolean;
  rating: number;
  reviewsCount: number;
  stock: number;
}

interface ProductPageProps {
  product: Product;
}

const ProductPage: React.FC<ProductPageProps> = ({ product }) => {
  const router = useRouter();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { success, error } = useToast();

  // Состояние выбранных вариантов
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || null);
  const [selectedSize, setSelectedSize] = useState<{ id: number; value: string } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Проверка наличия товара в корзине
  const isProductInCart = selectedColor && selectedSize 
    ? isInCart(product.slug, selectedColor.id, parseInt(selectedSize.value))
    : false;

  const currentQuantityInCart = selectedColor && selectedSize
    ? getItemQuantity(product.slug, selectedColor.id, parseInt(selectedSize.value))
    : 0;

  // Обработчик добавления в корзину
  const handleAddToCart = async () => {
    if (!selectedColor) {
      error('Выберите цвет товара');
      return;
    }

    if (!selectedSize) {
      error('Выберите размер товара');
      return;
    }

    if (product.stock <= 0) {
      error('Товар закончился');
      return;
    }

    setIsAddingToCart(true);

    try {
      const productForCart = {
        slug: product.slug,
        Name: product.Name,
        Price: product.Price,
        imageUrl: product.imageUrl
      };

      const colorForCart = {
        id: selectedColor.id,
        Name: selectedColor.name
      };

      const success_result = await addToCart(
        productForCart,
        colorForCart,
        parseInt(selectedSize.value)
      );

      if (success_result) {
        success(`${product.Name} добавлен в корзину`);
      } else {
        error('Не удалось добавить товар в корзину');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      error('Произошла ошибка при добавлении товара');
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Обработчик добавления в избранное
  const handleToggleFavorite = () => {
    try {
      toggleFavorite(product.slug);
      
      if (isFavorite(product.slug)) {
        success('Товар удален из избранного');
      } else {
        success('Товар добавлен в избранное');
      }
    } catch (err) {
      error('Не удалось обновить избранное');
    }
  };

  // Обработчик смены цвета
  const handleColorChange = (color: { id: number; name: string; colorCode?: string }) => {
    console.log('🎨 ProductPage: Смена цвета на:', color.name);
    setSelectedColor(color);
    // Сбрасываем выбранный размер при смене цвета
    setSelectedSize(null);
  };

  // Обработчик смены изображения
  const handleImageChange = (imageIndex: number) => {
    console.log('🖼️ ProductPage: Смена изображения на индекс:', imageIndex);
    setSelectedImageIndex(imageIndex);
  };

  // Обработчик смены размера
  const handleSizeChange = (size: { id: number; value: string }) => {
    setSelectedSize(size);
  };

  // Хлебные крошки
  const breadcrumbs = [
    { label: 'Главная', href: '/' },
    { label: 'Каталог', href: '/catalog' },
    { label: product.categoryName, href: `/catalog?category=${product.categoryName}` },
    { label: product.brandName, href: `/catalog?brand=${product.brandName}` },
    { label: product.Name, href: '', current: true }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ АДАПТИВНЫЙ КОНТЕЙНЕР */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Breadcrumbs */}
        <div className="mb-4 sm:mb-6">
          <ProductBreadcrumbs items={breadcrumbs} />
        </div>

        {/* ✅ АДАПТИВНАЯ ОСНОВНАЯ СЕКЦИЯ */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden mb-6 sm:mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">
            {/* ✅ АДАПТИВНЫЕ ИЗОБРАЖЕНИЯ */}
            <div className="order-1 lg:order-1">
              <ProductImages
                images={product.gallery.length > 0 ? product.gallery : [
                  { url: product.imageUrl, alt: product.Name }
                ]}
                selectedIndex={selectedImageIndex}
                onImageSelect={setSelectedImageIndex}
                productName={product.Name}
              />
            </div>

            {/* ✅ АДАПТИВНАЯ ИНФОРМАЦИЯ О ТОВАРЕ */}
            <div className="order-2 lg:order-2">
              <ProductInfo
                product={product}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                quantity={quantity}
                onColorChange={handleColorChange}
                onSizeChange={handleSizeChange}
                onQuantityChange={setQuantity}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
                isAddingToCart={isAddingToCart}
                isInCart={isProductInCart}
                quantityInCart={currentQuantityInCart}
                isFavorite={isFavorite(product.slug)}
                onImageChange={handleImageChange}
              />
            </div>
          </div>
        </div>

        {/* ✅ АДАПТИВНЫЕ ВКЛАДКИ */}
        <div className="mb-6 sm:mb-8">
          <ProductTabs 
            description={product.description}
            features={product.features || []}
            specifications={{
              brand: product.brandName,
              category: product.categoryName,
              colors: product.colors.map(c => c.name),
              sizes: product.sizes.map(s => s.value),
              genders: product.genders
            }}
            reviews={{
              rating: product.rating,
              count: product.reviewsCount,
              reviews: []
            }}
          />
        </div>

        {/* ✅ АДАПТИВНЫЕ ПОХОЖИЕ ТОВАРЫ */}
        <RelatedProducts 
          currentProduct={product}
          category={product.categoryName}
          brand={product.brandName}
        />
      </div>

      {/* ✅ МОБИЛЬНАЯ STICKY ПАНЕЛЬ С ЦЕНОЙ И КНОПКОЙ (только на мобильных) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">
              {new Intl.NumberFormat('ru-RU', {
                style: 'currency',
                currency: 'RUB',
                minimumFractionDigits: 0,
              }).format(product.Price)}
            </span>
            {product.originalPrice && product.originalPrice > product.Price && (
              <span className="text-sm text-gray-500 line-through">
                {new Intl.NumberFormat('ru-RU', {
                  style: 'currency',
                  currency: 'RUB',
                  minimumFractionDigits: 0,
                }).format(product.originalPrice)}
              </span>
            )}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart || !selectedColor || !selectedSize || product.stock <= 0}
            className="flex-1 bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isAddingToCart ? 'Добавление...' : 'В корзину'}
          </button>
        </div>
      </div>

      {/* ✅ ОТСТУП СНИЗУ ДЛЯ МОБИЛЬНОЙ ПАНЕЛИ */}
      <div className="lg:hidden h-20"></div>
    </div>
  );
};

export default ProductPage;