// src/components/product/ProductBreadcrumbs.tsx
'use client';

import React from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href: string;
  current?: boolean;
}

interface ProductBreadcrumbsProps {
  items: BreadcrumbItem[];
}

const ProductBreadcrumbs: React.FC<ProductBreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index > 0 && (
              <svg
                className="w-4 h-4 text-gray-400 mx-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {item.current ? (
              <span className="text-gray-500 text-sm font-medium">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default ProductBreadcrumbs;