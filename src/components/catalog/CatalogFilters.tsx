/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/catalog/CatalogFilters.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

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

interface CatalogFiltersProps {
  filterOptions: FilterOptions;
  activeFilters: ActiveFilters;
  onFiltersChange: (filters: ActiveFilters) => void;
  onClearFilters: () => void;
  resultsCount: number;
}

const CatalogFilters: React.FC<CatalogFiltersProps> = ({
  filterOptions,
  activeFilters,
  onFiltersChange,
  onClearFilters,
  resultsCount
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleFilterChange = (filterType: keyof ActiveFilters, value: any) => {
    const newFilters = { ...activeFilters };
    
    if (filterType === 'brands' || filterType === 'categories' || filterType === 'genders' || filterType === 'colors') {
      const currentArray = newFilters[filterType] as string[];
      if (currentArray.includes(value)) {
        newFilters[filterType] = currentArray.filter(item => item !== value);
      } else {
        newFilters[filterType] = [...currentArray, value];
      }
    } else if (filterType === 'sizes') {
      const currentArray = newFilters.sizes;
      if (currentArray.includes(value)) {
        newFilters.sizes = currentArray.filter(item => item !== value);
      } else {
        newFilters.sizes = [...currentArray, value];
      }
    } else {
    //@ts-ignore
      newFilters[filterType] = value;
    }
    
    onFiltersChange(newFilters);
  };

  const getActiveFiltersCount = () => {
    return (
      activeFilters.brands.length +
      activeFilters.categories.length +
      activeFilters.genders.length +
      activeFilters.colors.length +
      activeFilters.sizes.length +
      (activeFilters.search ? 1 : 0) +
      (activeFilters.priceMin > filterOptions.priceRange.min ? 1 : 0) +
      (activeFilters.priceMax < filterOptions.priceRange.max ? 1 : 0)
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
          {/* Results Count */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Фильтры</h3>
            <span className="text-sm text-gray-500">
              {resultsCount} товаров
            </span>
          </div>

          {/* Clear Filters */}
          {getActiveFiltersCount() > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="w-full text-gray-600 border-gray-300"
            >
              Очистить все фильтры
            </Button>
          )}

          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Поиск</label>
            <input
              type="text"
              placeholder="Поиск товаров..."
              value={activeFilters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-500"
            />
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Цена</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="От"
                value={activeFilters.priceMin || ''}
                onChange={(e) => handleFilterChange('priceMin', Number(e.target.value) || 0)}
                className="px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-gray-500"
              />
              <input
                type="number"
                placeholder="До"
                value={activeFilters.priceMax || ''}
                onChange={(e) => handleFilterChange('priceMax', Number(e.target.value) || filterOptions.priceRange.max)}
                className="px-3 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-gray-500"
              />
            </div>
            <div className="text-xs text-gray-500">
              {filterOptions.priceRange.min.toLocaleString()} - {filterOptions.priceRange.max.toLocaleString()} ₽
            </div>
          </div>

          {/* Brands */}
          {filterOptions.brands.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Бренды</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {filterOptions.brands.map((brand) => (
                  <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeFilters.brands.includes(brand)}
                      onChange={() => handleFilterChange('brands', brand)}
                      className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          {filterOptions.categories.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Категории</label>
              <div className="space-y-2">
                {filterOptions.categories.map((category) => (
                  <label key={category} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeFilters.categories.includes(category)}
                      onChange={() => handleFilterChange('categories', category)}
                      className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Genders */}
          {filterOptions.genders.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Пол</label>
              <div className="space-y-2">
                {filterOptions.genders.map((gender) => (
                  <label key={gender} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeFilters.genders.includes(gender)}
                      onChange={() => handleFilterChange('genders', gender)}
                      className="rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-gray-700">{gender}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {filterOptions.sizes.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Размеры</label>
              <div className="grid grid-cols-4 gap-2">
                {filterOptions.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleFilterChange('sizes', size)}
                    className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                      activeFilters.sizes.includes(size)
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {filterOptions.colors.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Цвета</label>
              <div className="flex flex-wrap gap-2">
                {filterOptions.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleFilterChange('colors', color)}
                    className={`px-3 py-1 text-xs border rounded-full transition-colors ${
                      activeFilters.colors.includes(color)
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-300'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CatalogFilters;