/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useCatalog.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useProducts } from './useProducts';

interface FilterOptions {
  brands: string[];
  categories: string[];
  genders: string[];
  colors: string[];
  sizes: number[];
  priceRange: { min: number; max: number };
}

interface ActiveFilters {
  brands: string[];
  categories: string[];
  genders: string[];
  colors: string[];
  sizes: number[];
  priceMin: number;
  priceMax: number;
  search: string;
}

interface UseCatalogReturn {
  products: any[];
  loading: boolean;
  error: string | null;
  filterOptions: FilterOptions;
  activeFilters: ActiveFilters;
  sortBy: string;
  page: number;
  hasMore: boolean;
  setActiveFilters: (filters: ActiveFilters) => void;
  setSortBy: (sort: string) => void;
  loadMore: () => void;
  clearFilters: () => void;
}

export const useCatalog = (initialFilters?: Partial<ActiveFilters>): UseCatalogReturn => {
  const [activeFilters, setActiveFiltersState] = useState<ActiveFilters>({
    brands: [],
    categories: [],
    genders: [],
    colors: [],
    sizes: [],
    priceMin: 0,
    priceMax: 100000,
    search: '',
    ...initialFilters
  });

  const [sortBy, setSortBy] = useState('relevance');
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    brands: [],
    categories: [],
    genders: [],
    colors: [],
    sizes: [],
    priceRange: { min: 0, max: 100000 }
  });

  // Загружаем все продукты для фильтрации
  const { products: rawProducts, loading, error } = useProducts({ limit: 1000 });

  // Обновляем опции фильтров при загрузке продуктов
  useEffect(() => {
    if (rawProducts.length > 0) {
      const brands = new Set<string>();
      const categories = new Set<string>();
      const genders = new Set<string>();
      const colors = new Set<string>();
      const sizes = new Set<number>();
      let minPrice = Infinity;
      let maxPrice = 0;

      rawProducts.forEach(product => {
        // Бренды
        if (product.brandName) brands.add(product.brandName);
        
        // Категории
        if (product.categoryName) categories.add(product.categoryName);
        
        // Пол
        if (product.genders?.length > 0) {
          product.genders.forEach((gender: string) => genders.add(gender));
        }
        
        // Цвета
        if (product.colors?.length > 0) {
          product.colors.forEach((color: string) => colors.add(color));
        }
        
        // Размеры
        if (product.sizes?.length > 0) {
          product.sizes.forEach((size: number) => sizes.add(size));
        }
        
        // Цены
        if (product.Price < minPrice) minPrice = product.Price;
        if (product.Price > maxPrice) maxPrice = product.Price;
      });

      setFilterOptions({
        brands: Array.from(brands).sort(),
        categories: Array.from(categories).sort(),
        genders: Array.from(genders).sort(),
        colors: Array.from(colors).sort(),
        sizes: Array.from(sizes).sort((a, b) => a - b),
        priceRange: { min: minPrice === Infinity ? 0 : minPrice, max: maxPrice }
      });

      // Обновляем диапазон цен в активных фильтрах если он не был установлен
      if (activeFilters.priceMin === 0 && activeFilters.priceMax === 100000) {
        setActiveFiltersState(prev => ({
          ...prev,
          priceMin: minPrice === Infinity ? 0 : minPrice,
          priceMax: maxPrice
        }));
      }
    }
  }, [rawProducts]);

  // Фильтрация и сортировка продуктов
  const filteredAndSortedProducts = useCallback(() => {
    let filtered = [...rawProducts];

    // Применяем фильтры
    if (activeFilters.search) {
      const searchLower = activeFilters.search.toLowerCase();
      filtered = filtered.filter(product => 
        product.Name.toLowerCase().includes(searchLower) ||
        product.brandName.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower)
      );
    }

    if (activeFilters.brands.length > 0) {
      filtered = filtered.filter(product => 
        activeFilters.brands.includes(product.brandName)
      );
    }

    if (activeFilters.categories.length > 0) {
      filtered = filtered.filter(product => 
        product.categoryName && activeFilters.categories.includes(product.categoryName)
      );
    }

    if (activeFilters.genders.length > 0) {
      filtered = filtered.filter(product => 
        product.genders?.some((gender: string) => activeFilters.genders.includes(gender))
      );
    }

    if (activeFilters.colors.length > 0) {
      filtered = filtered.filter(product => 
        product.colors?.some((color: string) => activeFilters.colors.includes(color))
      );
    }

    if (activeFilters.sizes.length > 0) {
      filtered = filtered.filter(product => 
        product.sizes?.some((size: number) => activeFilters.sizes.includes(size))
      );
    }

    // Фильтр по цене
    filtered = filtered.filter(product => 
      product.Price >= activeFilters.priceMin && 
      product.Price <= activeFilters.priceMax
    );

    // Сортировка
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.Price - b.Price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.Price - a.Price);
        break;
      case 'name':
        filtered.sort((a, b) => a.Name.localeCompare(b.Name));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'new':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default: // relevance
        // Оставляем как есть или можно добавить логику релевантности
        break;
    }

    return filtered;
  }, [rawProducts, activeFilters, sortBy]);

  // Обновляем отфильтрованные продукты
  useEffect(() => {
    const filtered = filteredAndSortedProducts();
    setAllProducts(filtered);
    setPage(1); // Сброс пагинации при изменении фильтров
  }, [filteredAndSortedProducts]);

  // Продукты для отображения (с учетом пагинации)
  const itemsPerPage = 20;
  const displayedProducts = allProducts.slice(0, page * itemsPerPage);
  const hasMore = allProducts.length > displayedProducts.length;

  const setActiveFilters = useCallback((filters: ActiveFilters) => {
    setActiveFiltersState(filters);
  }, []);

  const loadMore = useCallback(() => {
    if (hasMore) {
      setPage(prev => prev + 1);
    }
  }, [hasMore]);

  const clearFilters = useCallback(() => {
    setActiveFiltersState({
      brands: [],
      categories: [],
      genders: [],
      colors: [],
      sizes: [],
      priceMin: filterOptions.priceRange.min,
      priceMax: filterOptions.priceRange.max,
      search: ''
    });
  }, [filterOptions.priceRange]);

  return {
    products: displayedProducts,
    loading,
    error,
    filterOptions,
    activeFilters,
    sortBy,
    page,
    hasMore,
    setActiveFilters,
    setSortBy,
    loadMore,
    clearFilters
  };
};