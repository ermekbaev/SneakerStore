// src/components/search/SearchFilters.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface SearchFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
  initialFilters?: SearchFilters;
  availableFilters?: {
    brands: string[];
    categories: string[];
    colors: string[];
    sizes: number[];
    priceRange: { min: number; max: number };
  };
}

export interface SearchFilters {
  brands: string[];
  categories: string[];
  colors: string[];
  sizes: number[];
  priceMin: number;
  priceMax: number;
  inStock: boolean;
  onSale: boolean;
  isNew: boolean;
}

const SearchFiltersComponent: React.FC<SearchFiltersProps> = ({
  onFiltersChange,
  initialFilters = {
    brands: [],
    categories: [],
    colors: [],
    sizes: [],
    priceMin: 0,
    priceMax: 50000,
    inStock: false,
    onSale: false,
    isNew: false,
  },
  availableFilters = {
    brands: ['Nike', 'Adidas', 'Jordan', 'Puma', 'New Balance'],
    categories: ['Беговые', 'Баскетбольные', 'Повседневные', 'Тренировочные'],
    colors: ['Черный', 'Белый', 'Красный', 'Синий', 'Серый'],
    sizes: [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46],
    priceRange: { min: 0, max: 50000 }
  }
}) => {
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [isOpen, setIsOpen] = useState(false);

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const toggleArrayFilter = (
    filterKey: 'brands' | 'categories' | 'colors' | 'sizes',
    value: string | number
  ) => {
    const currentArray = filters[filterKey] as (string | number)[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    updateFilters({ [filterKey]: newArray });
  };

  const clearAllFilters = () => {
    const clearedFilters: SearchFilters = {
      brands: [],
      categories: [],
      colors: [],
      sizes: [],
      priceMin: availableFilters.priceRange.min,
      priceMax: availableFilters.priceRange.max,
      inStock: false,
      onSale: false,
      isNew: false,
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    return (
      filters.brands.length +
      filters.categories.length +
      filters.colors.length +
      filters.sizes.length +
      (filters.inStock ? 1 : 0) +
      (filters.onSale ? 1 : 0) +
      (filters.isNew ? 1 : 0) +
      (filters.priceMin > availableFilters.priceRange.min ? 1 : 0) +
      (filters.priceMax < availableFilters.priceRange.max ? 1 : 0)
    );
  };

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-6">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between"
        >
          <span className="flex items-center">
            Фильтры
            {getActiveFiltersCount() > 0 && (
              <Badge variant="default" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </span>
          <svg
            className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </Button>
      </div>

      {/* Filters Content */}
      <div className={`lg:block ${isOpen ? 'block' : 'hidden'}`}>
        <div className="bg-white border border-emerald-200 rounded-xl p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Фильтры</h3>
            {getActiveFiltersCount() > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="text-gray-600 border-gray-300"
              >
                Очистить все
              </Button>
            )}
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Цена</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600">От</label>
                <input
                  type="number"
                  value={filters.priceMin || ''}
                  onChange={(e) => updateFilters({ priceMin: Number(e.target.value) || 0 })}
                  className="w-full mt-1 px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">До</label>
                <input
                  type="number"
                  value={filters.priceMax || ''}
                  onChange={(e) => updateFilters({ priceMax: Number(e.target.value) || availableFilters.priceRange.max })}
                  className="w-full mt-1 px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  placeholder={availableFilters.priceRange.max.toString()}
                />
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {availableFilters.priceRange.min.toLocaleString()} - {availableFilters.priceRange.max.toLocaleString()} ₽
            </div>
          </div>

          {/* Quick Filters */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Быстрые фильтры</h4>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => updateFilters({ inStock: e.target.checked })}
                  className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="ml-2 text-sm text-gray-700">В наличии</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.onSale}
                  onChange={(e) => updateFilters({ onSale: e.target.checked })}
                  className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="ml-2 text-sm text-gray-700">Скидка</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.isNew}
                  onChange={(e) => updateFilters({ isNew: e.target.checked })}
                  className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="ml-2 text-sm text-gray-700">Новинки</span>
              </label>
            </div>
          </div>

          {/* Brands */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Бренды</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {availableFilters.brands.map((brand) => (
                <label key={brand} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => toggleArrayFilter('brands', brand)}
                    className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Категории</h4>
            <div className="space-y-2">
              {availableFilters.categories.map((category) => (
                <label key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category)}
                    onChange={() => toggleArrayFilter('categories', category)}
                    className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Размеры</h4>
            <div className="grid grid-cols-4 gap-2">
              {availableFilters.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => toggleArrayFilter('sizes', size)}
                  className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                    filters.sizes.includes(size)
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Цвета</h4>
            <div className="flex flex-wrap gap-2">
              {availableFilters.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => toggleArrayFilter('colors', color)}
                  className={`px-3 py-1 text-xs border rounded-full transition-colors ${
                    filters.colors.includes(color)
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-300'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchFiltersComponent;