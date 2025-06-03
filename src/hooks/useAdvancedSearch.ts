// src/hooks/useAdvancedSearch.ts
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useDebounce } from './useDebounce';

interface SearchSuggestion {
  id: string;
  type: 'product' | 'brand' | 'category' | 'query';
  title: string;
  subtitle?: string;
  imageUrl?: string;
  url: string;
}

interface UseAdvancedSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  suggestions: SearchSuggestion[];
  isLoading: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  searchHistory: string[];
  popularQueries: string[];
  handleSearch: (searchQuery?: string) => void;
  clearHistory: () => void;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}

export const useAdvancedSearch = (): UseAdvancedSearchReturn => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  // Debounce поискового запроса
  const debouncedQuery = useDebounce(query, 300);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  // Популярные запросы (можно загружать с сервера)
  const popularQueries = [
    'Nike Air Max',
    'Adidas Ultraboost', 
    'Jordan',
    'Puma',
    'Белые кроссовки',
    'Черные кроссовки',
    'Беговые кроссовки',
    'Баскетбольные кроссовки'
  ];

  // Загружаем историю поиска из localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('searchHistory');
        if (stored) {
          const parsed = JSON.parse(stored);
          setSearchHistory(Array.isArray(parsed) ? parsed.slice(0, 10) : []);
        }
      } catch (error) {
        console.error('Ошибка загрузки истории поиска:', error);
      }
    }
  }, []);

  // Сохраняем историю поиска в localStorage
  const saveSearchHistory = useCallback((searchQuery: string) => {
    if (!searchQuery.trim() || typeof window === 'undefined') return;
    
    try {
      const newHistory = [
        searchQuery,
        ...searchHistory.filter(item => item !== searchQuery)
      ].slice(0, 10);
      
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error('Ошибка сохранения истории поиска:', error);
    }
  }, [searchHistory]);

  // Очистка истории поиска
  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('searchHistory');
    }
  }, []);

  // Получение suggestions с сервера
  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    // Отменяем предыдущий запрос
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/search/suggestions?q=${encodeURIComponent(searchQuery)}&limit=8`,
        { signal: abortControllerRef.current.signal }
      );

      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();
      
      // Преобразуем результаты в suggestions
      const newSuggestions: SearchSuggestion[] = [];

      // Добавляем товары
      if (data.products && data.products.length > 0) {
        data.products.slice(0, 4).forEach((product: any) => {
          newSuggestions.push({
            id: `product-${product.slug}`,
            type: 'product',
            title: product.Name,
            subtitle: `${product.brandName} • ${product.Price?.toLocaleString('ru-RU')}₽`,
            imageUrl: product.imageUrl,
            url: `/product/${product.slug}`
          });
        });
      }

      // Добавляем бренды
      if (data.brands && data.brands.length > 0) {
        data.brands.slice(0, 2).forEach((brand: string) => {
          newSuggestions.push({
            id: `brand-${brand}`,
            type: 'brand',
            title: brand,
            subtitle: 'Бренд',
            url: `/catalog?brand=${encodeURIComponent(brand)}`
          });
        });
      }

      // Добавляем категории
      if (data.categories && data.categories.length > 0) {
        data.categories.slice(0, 2).forEach((category: string) => {
          newSuggestions.push({
            id: `category-${category}`,
            type: 'category', 
            title: category,
            subtitle: 'Категория',
            url: `/catalog?category=${encodeURIComponent(category)}`
          });
        });
      }

      // Добавляем общий поиск
      newSuggestions.push({
        id: `search-${searchQuery}`,
        type: 'query',
        title: `Поиск "${searchQuery}"`,
        subtitle: 'Показать все результаты',
        url: `/catalog?search=${encodeURIComponent(searchQuery)}`
      });

      setSuggestions(newSuggestions);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Ошибка получения suggestions:', error);
        setSuggestions([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Выполняем поиск при изменении debouncedQuery
  useEffect(() => {
    if (debouncedQuery && isOpen) {
      fetchSuggestions(debouncedQuery);
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery, isOpen, fetchSuggestions]);

  // Сброс selectedIndex при изменении suggestions
  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions]);

  // Функция поиска
  const handleSearch = useCallback((searchQuery?: string) => {
    const finalQuery = searchQuery || query;
    if (!finalQuery.trim()) return;

    saveSearchHistory(finalQuery);
    setIsOpen(false);
    setQuery('');
    
    // Перенаправляем на страницу поиска
    window.location.href = `/search?q=${encodeURIComponent(finalQuery)}`;
  }, [query, saveSearchHistory]);

  // Обработка клавиатуры
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          const suggestion = suggestions[selectedIndex];
          if (suggestion.type === 'query') {
            handleSearch(query);
          } else {
            window.location.href = suggestion.url;
          }
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  }, [isOpen, selectedIndex, suggestions, query, handleSearch]);

  return {
    query,
    setQuery,
    suggestions,
    isLoading,
    isOpen,
    setIsOpen,
    searchHistory,
    popularQueries,
    handleSearch,
    clearHistory,
    selectedIndex,
    setSelectedIndex,
    handleKeyDown
  };
};