/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/page.tsx
'use client';

import React, { useState } from 'react';
// import Layout from '@/components/layout/Layout';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useProducts } from '@/hooks/useProducts';
import Link from 'next/link';

const HomePage = () => {
      const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { products, loading, error, refetch } = useProducts({ 
    featured: true, 
    limit: 8 
  });

  const handleRefreshProducts = () => {
    console.log('🔄 Обновляем рекомендуемые товары...');
    refetch();
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-white to-teal-50 overflow-hidden">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center space-y-8">
            <Badge variant="new" className="inline-flex">
              🔥 Новая коллекция 2024
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900">
              Стильные{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                кроссовки
              </span>{' '}
              для активной жизни
            </h1>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Откройте для себя эксклюзивную коллекцию премиальных кроссовок от ведущих мировых брендов
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="gradient" size="lg">
                <Link 
                href="/catalog" 
                className="px-2 py-2 text-white hover:text-emerald-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Смотреть каталог
              </Link>
              </Button>
              <Button variant="outline" size="lg" className='text-gray-400'>
                Новинки
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Быстрая доставка</h3>
              <p className="text-gray-600">Доставим ваш заказ в течение 1-2 дней по всей России</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Гарантия качества</h3>
              <p className="text-gray-600">100% оригинальные товары с официальной гарантией</p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Легкий возврат</h3>
              <p className="text-gray-600">30 дней на возврат без лишних вопросов</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Рекомендуемые товары
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Лучшие предложения специально для вас
            </p>
            
            {/* Кнопка обновления товаров */}
            <div className="flex justify-center gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefreshProducts}
                disabled={loading}
                className="bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Обновление...
                  </>
                ) : (
                  <>
                    🔄 Показать другие товары
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-square rounded-xl mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ошибка загрузки</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Попробовать снова
              </Button>
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.slug}
                  product={product}
                  onAddToCart={() => console.log('Add to cart:', product.slug)}
                  onToggleFavorite={() => console.log('Toggle favorite:', product.slug)}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && products.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Товары не найдены</h3>
              <p className="text-gray-600">Попробуйте обновить страницу</p>
            </div>
          )}

          {/* View All Button */}
          {!loading && !error && products.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                <Link 
                href="/catalog" 
                className="px-2 py-2 hover:text-emerald-600 text-gray-500"
                onClick={() => setIsMenuOpen(false)}
              >
                Смотреть все товары
              </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Будьте в курсе новинок
            </h2>
            <p className="text-xl text-emerald-100">
              Подпишитесь на рассылку и получайте информацию о скидках и новых коллекциях
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Ваш email"
                className="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-white border-white"
              />
              <Button variant="secondary" size="lg" className="bg-white text-emerald-600 hover:bg-gray-50">
                Подписаться
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;