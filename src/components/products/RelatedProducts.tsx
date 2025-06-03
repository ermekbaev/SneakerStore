/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/product/RelatedProducts.tsx
'use client';

import React from 'react';
import ProductCard from '@/components/products/ProductCard';
import { useProducts } from '@/hooks/useProducts';

interface Product {
  slug: string;
  Name: string;
  brandName: string;
  Price: number;
  imageUrl: string;
  colors: any[];
  sizes: any[];
  genders: string[];
  categoryName: string;
  description: string;
}

interface RelatedProductsProps {
  currentProduct: Product;
  category: string;
  brand: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProduct,
  category,
  brand
}) => {
  // Сначала пытаемся загрузить товары той же категории
  const { products: categoryProducts, loading: categoryLoading } = useProducts({ 
    category, 
    limit: 8 
  });

  // Если товаров категории мало, загружаем товары того же бренда
  const { products: brandProducts, loading: brandLoading } = useProducts({ 
    brand, 
    limit: 8 
  });

  const loading = categoryLoading || brandLoading;

  // Объединяем и фильтруем товары
  const allRelatedProducts = [...categoryProducts, ...brandProducts];
  
  // Убираем текущий товар и дубликаты
  const uniqueProducts = allRelatedProducts
    .filter(product => product.slug !== currentProduct.slug)
    .filter((product, index, self) => 
      index === self.findIndex(p => p.slug === product.slug)
    )
    .slice(0, 4); // Показываем максимум 4 товара

  if (loading && uniqueProducts.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Похожие товары</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 aspect-square rounded-xl mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-6 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (uniqueProducts.length === 0) {
    return null; // Не показываем секцию, если нет похожих товаров
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Похожие товары</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {uniqueProducts.map((product) => (
          <ProductCard
            key={product.slug}
            product={product}
            onAddToCart={() => console.log('Add to cart:', product.slug)}
            onToggleFavorite={() => console.log('Toggle favorite:', product.slug)}
          />
        ))}
      </div>

      {/* Ссылка на больше товаров */}
      <div className="text-center mt-8">
        <a
          href={`/catalog?category=${encodeURIComponent(category)}`}
          className="inline-flex items-center px-6 py-3 border border-emerald-300 text-emerald-700 font-medium rounded-lg hover:bg-emerald-50 transition-colors"
        >
          Смотреть все товары в категории "{category}"
          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default RelatedProducts;