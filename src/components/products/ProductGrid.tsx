// src/components/products/ProductGrid.tsx
'use client';

import React from 'react';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/Button';

interface Product {
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
}

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
  showLoadMore?: boolean;
  className?: string;
  onAddToCart?: (product: Product) => void;
  onToggleFavorite?: (product: Product) => void;
  favoriteIds?: string[];
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  error = null,
  onLoadMore,
  hasMore = false,
  loadingMore = false,
  showLoadMore = true,
  className = '',
  onAddToCart,
  onToggleFavorite,
  favoriteIds = []
}) => {
  if (loading && products.length === 0) {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        {[...Array(8)].map((_, i) => (
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
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Ошибка загрузки товаров</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Попробовать снова
        </Button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Товары не найдены</h3>
        <p className="text-gray-600">Попробуйте изменить фильтры или поисковый запрос</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Products Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        {products.map((product) => (
          <ProductCard
            key={product.slug}
            product={product}
            onAddToCart={() => onAddToCart?.(product)}
            onToggleFavorite={() => onToggleFavorite?.(product)}
            isFavorite={favoriteIds.includes(product.slug)}
          />
        ))}
      </div>

      {/* Load More Button */}
      {showLoadMore && hasMore && (
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={onLoadMore}
            disabled={loadingMore}
            className="min-w-48"
          >
            {loadingMore ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Загрузка...
              </>
            ) : (
              'Показать еще'
            )}
          </Button>
        </div>
      )}

      {/* Loading More Indicator */}
      {loadingMore && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      )}
    </div>
  );
};

export default ProductGrid;