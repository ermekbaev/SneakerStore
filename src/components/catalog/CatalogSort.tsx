// src/components/catalog/CatalogSort.tsx
'use client';

import React from 'react';

interface CatalogSortProps {
  sortBy: string;
  onSortChange: (sortBy: string) => void;
  resultsCount: number;
}

const CatalogSort: React.FC<CatalogSortProps> = ({
  sortBy,
  onSortChange,
  resultsCount
}) => {
  const sortOptions = [
    { value: 'relevance', label: 'По релевантности' },
    { value: 'price-asc', label: 'Цена: по возрастанию' },
    { value: 'price-desc', label: 'Цена: по убыванию' },
    { value: 'name', label: 'По алфавиту' },
    { value: 'rating', label: 'По рейтингу' },
    { value: 'new', label: 'Сначала новые' },
  ];

  return (
    <div className="flex items-center justify-between mb-6">
      {/* Results Count */}
      <div className="text-gray-600">
        <span className="font-medium text-gray-900">{resultsCount}</span> товаров найдено
      </div>

      {/* Sort Dropdown */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600 hidden sm:block ">Сортировка:</span>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
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
  );
};

export default CatalogSort;