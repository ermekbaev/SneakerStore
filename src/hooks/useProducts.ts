/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useProducts.ts
'use client';

import { useState, useEffect, useCallback } from 'react';

export interface Product {
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

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface UseProductsOptions {
  featured?: boolean;
  category?: string;
  brand?: string;
  limit?: number;
  search?: string;
}

export const useProducts = (options: UseProductsOptions = {}): UseProductsReturn => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Формируем параметры запроса
      const params = new URLSearchParams();
      
      if (options.featured) params.append('featured', 'true');
      if (options.category) params.append('category', options.category);
      if (options.brand) params.append('brand', options.brand);
      if (options.limit) params.append('limit', options.limit.toString());
      if (options.search) params.append('q', options.search);
      
      // Добавляем случайный параметр для обхода кэша при featured товарах
      if (options.featured) {
        params.append('refresh', Date.now().toString());
      }

      const url = `/api/products${params.toString() ? `?${params.toString()}` : ''}`;
      
      console.log('🚀 Fetching products from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: options.featured ? 'no-store' : 'default', // Отключаем кэш для featured
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      console.log('📦 Products API response:', data);

      if (data.products && Array.isArray(data.products)) {
        // Обрабатываем данные и добавляем fallback значения
        const processedProducts = data.products.map((product: any) => ({
          slug: product.slug || `product-${Date.now()}`,
          Name: product.Name || 'Без названия',
          Price: product.Price || 0,
          originalPrice: product.originalPrice,
          imageUrl: product.imageUrl || 'https://placehold.co/400x400/f3f4f6/9ca3af?text=No+Image',
          brandName: product.brandName || 'Unknown',
          categoryName: product.categoryName,
          description: product.description,
          isNew: product.isNew || false,
          isSale: product.isSale || false,
          rating: product.rating || (4.0 + Math.random()),
          colors: Array.isArray(product.colors) ? product.colors : [],
          sizes: Array.isArray(product.sizes) ? product.sizes : [],
          genders: Array.isArray(product.genders) ? product.genders : [],
        }));

        console.log(`✅ Processed ${processedProducts.length} products`);
        setProducts(processedProducts);
      } else {
        console.warn('⚠️ Invalid products data structure:', data);
        setProducts([]);
      }

    } catch (err) {
      console.error('❌ Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Ошибка загрузки товаров');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [options.featured, options.category, options.brand, options.limit, options.search]);

  const refetch = useCallback(() => {
    console.log('🔄 Refetching products...');
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch
  };
};