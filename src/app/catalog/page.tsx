/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
// src/app/catalog/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductGrid from '@/components/products/ProductGrid';
import CatalogFilters from '@/components/catalog/CatalogFilters';
import CatalogSort from '@/components/catalog/CatalogSort';
import { useCatalog } from '@/hooks/useCatalog';
import { Badge } from '@/components/ui/Badge';

const CatalogPage = () => {
  const searchParams = useSearchParams();
  
  // Получаем начальные фильтры из URL
  const initialFilters = {
    search: searchParams.get('search') || '',
    brands: searchParams.get('brand') ? [searchParams.get('brand')!] : [],
    categories: searchParams.get('category') ? [searchParams.get('category')!] : [],
    genders: searchParams.get('gender') ? [searchParams.get('gender')!] : [],
  };

  const {
    products,
    loading,
    error,
    filterOptions,
    activeFilters,
    sortBy,
    hasMore,
    setActiveFilters,
    setSortBy,
    loadMore,
    clearFilters
  } = useCatalog(initialFilters);

  // Обновляем URL при изменении фильтров
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (activeFilters.search) params.set('search', activeFilters.search);
    if (activeFilters.brands.length > 0) params.set('brand', activeFilters.brands[0]);
    if (activeFilters.categories.length > 0) params.set('category', activeFilters.categories[0]);
    if (activeFilters.genders.length > 0) params.set('gender', activeFilters.genders[0]);
    
    const newUrl = params.toString() ? `?${params.toString()}` : '/catalog';
    window.history.replaceState(null, '', newUrl);
  }, [activeFilters]);

  const handleAddToCart = (product: any) => {
    console.log('Add to cart:', product.slug);
    // TODO: Интеграция с корзиной
  };

  const handleToggleFavorite = (product: any) => {
    console.log('Toggle favorite:', product.slug);
    // TODO: Интеграция с избранным
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Каталог кроссовок
          </h1>
          <p className="text-lg text-gray-600">
            Найдите идеальную пару из нашей коллекции
          </p>
          
          {/* Active Filters */}
          {(activeFilters.search || 
            activeFilters.brands.length > 0 || 
            activeFilters.categories.length > 0 || 
            activeFilters.genders.length > 0) && (
            <div className="mt-4 flex flex-wrap gap-2">
              {activeFilters.search && (
                <Badge variant="outline" className="text-emerald-700 border-emerald-300">
                  Поиск:"{activeFilters.search}"
                </Badge>
              )}
              {activeFilters.brands.map(brand => (
                <Badge key={brand} variant="outline" className="text-emerald-700 border-emerald-300">
                  Бренд: {brand}
                </Badge>
              ))}
              {activeFilters.categories.map(category => (
                <Badge key={category} variant="outline" className="text-emerald-700 border-emerald-300">
                  Категория: {category}
                </Badge>
              ))}
              {activeFilters.genders.map(gender => (
                <Badge key={gender} variant="outline" className="text-emerald-700 border-emerald-300">
                  Пол: {gender}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <CatalogFilters
              filterOptions={filterOptions}
              activeFilters={activeFilters}
              onFiltersChange={setActiveFilters}
              onClearFilters={clearFilters}
              resultsCount={products.length}
            />
          </div>

          {/* Products Content */}
          <div className="lg:col-span-3">
            {/* Sort and Results */}
            <CatalogSort
              sortBy={sortBy}
              onSortChange={setSortBy}
              resultsCount={products.length}
            />

            {/* Products Grid */}
            <ProductGrid
              products={products}
              loading={loading}
              error={error}
              onLoadMore={loadMore}
              hasMore={hasMore}
              showLoadMore={true}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              className="lg:grid-cols-3"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CatalogPage;