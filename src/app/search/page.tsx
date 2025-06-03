/* eslint-disable react/no-unescaped-entities */
// src/app/search/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductGrid from '@/components/products/ProductGrid';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import AdvancedSearchBar from '@/components/search/AdvancedSearchBar';

interface SearchResult {
  slug: string;
  Name: string;
  brandName: string;
  Price: number;
  imageUrl: string;
  categoryName?: string;
  colors?: string[];
  sizes?: number[];
  genders?: string[];
  description?: string;
  originalPrice?: number;
  isNew?: boolean;
  isSale?: boolean;
  rating?: number;
}

interface SearchResponse {
  results: SearchResult[];
  query: string;
  total: number;
  filters: {
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
  };
  sort: string;
}

const SearchPage = () => {
  const searchParams = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchData, setSearchData] = useState<SearchResponse | null>(null);
  const [sortBy, setSortBy] = useState('relevance');

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';

  // Функция поиска
  const performSearch = async (searchQuery: string, currentSort: string = sortBy) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setSearchData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append('q', searchQuery);
      if (category) params.append('category', category);
      if (brand) params.append('brand', brand);
      params.append('sort', currentSort);
      params.append('limit', '20');

      const response = await fetch(`/api/search?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const data: SearchResponse = await response.json();
      setResults(data.results || []);
      setSearchData(data);
      
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Ошибка поиска');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Выполняем поиск при загрузке или изменении параметров
  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query, category, brand]);

  // Обработка смены сортировки
  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    if (query) {
      performSearch(query, newSort);
    }
  };

  // Обработка добавления в корзину
  const handleAddToCart = (product: SearchResult) => {
    console.log('Add to cart:', product.slug);
    // TODO: Интеграция с корзиной
  };

  // Обработка добавления в избранное
  const handleToggleFavorite = (product: SearchResult) => {
    console.log('Toggle favorite:', product.slug);
    // TODO: Интеграция с избранным
  };

  const sortOptions = [
    { value: 'relevance', label: 'По релевантности' },
    { value: 'price-asc', label: 'Цена: по возрастанию' },
    { value: 'price-desc', label: 'Цена: по убыванию' },
    { value: 'name', label: 'По алфавиту' },
    { value: 'rating', label: 'По рейтингу' },
    { value: 'new', label: 'Сначала новые' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto mb-6">
            <AdvancedSearchBar 
              placeholder="Поиск кроссовок..."
              showHistory={true}
            />
          </div>
          
          {/* Search Info */}
          {query && (
            <div className="text-center mb-6">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Результаты поиска
              </h1>
              <p className="text-lg text-gray-600">
                по запросу: <span className="font-semibold">"{query}"</span>
              </p>
              
              {/* Active Filters */}
              {(category || brand) && (
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {category && (
                    <Badge variant="outline" className="text-emerald-700 border-emerald-300">
                      Категория: {category}
                    </Badge>
                  )}
                  {brand && (
                    <Badge variant="outline" className="text-emerald-700 border-emerald-300">
                      Бренд: {brand}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Section */}
        {query && (
          <>
            {/* Sort and Results Count */}
            {!loading && searchData && (
              <div className="flex items-center justify-between mb-6">
                <div className="text-gray-600">
                  <span className="font-medium text-gray-900">
                    {searchData.total}
                  </span> 
                  {' '}товаров найдено
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 hidden sm:block">Сортировка:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm bg-white text-gray-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Results Grid */}
            <ProductGrid
              products={results}
              loading={loading}
              error={error}
              onAddToCart={handleAddToCart}
              onToggleFavorite={handleToggleFavorite}
              className="lg:grid-cols-4"
            />

            {/* No Results */}
            {!loading && !error && results.length === 0 && query && (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-6">
                  <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  Ничего не найдено
                </h3>
                <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                  К сожалению, по вашему запросу "{query}" ничего не найдено. 
                  Попробуйте изменить поисковый запрос.
                </p>
                
                {/* Search Suggestions */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-700">
                    Возможно, вас заинтересует:
                  </h4>
                  <div className="flex flex-wrap justify-center gap-3">
                    {[
                      'Nike Air Max',
                      'Adidas Ultraboost',
                      'Jordan',
                      'Белые кроссовки',
                      'Беговые кроссовки'
                    ].map((suggestion) => (
                      <Button
                        key={suggestion}
                        variant="outline"
                        onClick={() => {
                          window.location.href = `/search?q=${encodeURIComponent(suggestion)}`;
                        }}
                        className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Browse Categories */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">
                    Или посмотрите наш каталог:
                  </h4>
                  <Button 
                    variant="gradient" 
                    size="lg"
                    onClick={() => window.location.href = '/catalog'}
                  >
                    Перейти в каталог
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty State - No Query */}
        {!query && (
          <div className="text-center py-16">
            <div className="text-emerald-400 mb-6">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Поиск кроссовок
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Найдите идеальную пару кроссовок из нашей коллекции. 
              Используйте поиск выше или выберите популярные запросы.
            </p>
            
            {/* Popular Searches */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-700">
                Популярные поиски:
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  'Nike Air Max',
                  'Adidas Ultraboost',
                  'Jordan',
                  'Puma',
                  'Белые кроссовки',
                  'Черные кроссовки',
                  'Беговые кроссовки',
                  'Баскетбольные кроссовки'
                ].map((popularQuery) => (
                  <Button
                    key={popularQuery}
                    variant="outline"
                    onClick={() => {
                      window.location.href = `/search?q=${encodeURIComponent(popularQuery)}`;
                    }}
                    className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                  >
                    {popularQuery}
                  </Button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-gray-700 mb-6">
                Категории товаров:
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Мужские', query: 'мужские кроссовки' },
                  { name: 'Женские', query: 'женские кроссовки' },
                  { name: 'Детские', query: 'детские кроссовки' },
                  { name: 'Спортивные', query: 'спортивные кроссовки' }
                ].map((category) => (
                  <Button
                    key={category.name}
                    variant="ghost"
                    className="h-20 flex flex-col bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                    onClick={() => {
                      window.location.href = `/search?q=${encodeURIComponent(category.query)}`;
                    }}
                  >
                    <span className="font-semibold">{category.name}</span>
                    <span className="text-sm">кроссовки</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;