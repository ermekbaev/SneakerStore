/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/product/ProductTabs.tsx
'use client';

import React, { useState } from 'react';

interface Specifications {
  brand: string;
  category: string;
  colors: string[];
  sizes: string[];
  genders: string[];
}

interface Reviews {
  rating: number;
  count: number;
  reviews: any[];
}

interface ProductTabsProps {
  description: string;
  features: string[];
  specifications: Specifications;
  reviews: Reviews;
}

const ProductTabs: React.FC<ProductTabsProps> = ({
  description,
  features,
  specifications,
  reviews
}) => {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Описание', count: null },
    { id: 'specifications', label: 'Характеристики', count: null },
    { id: 'reviews', label: 'Отзывы', count: reviews.count },
    { id: 'delivery', label: 'Доставка', count: null },
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);

    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg 
          key={i} 
          className={`w-5 h-5 ${i < fullStars ? 'text-yellow-400' : 'text-gray-200'}`}
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
      {/* Tab Headers */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-emerald-100 text-emerald-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'description' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Описание товара</h3>
            <div className="prose prose-emerald max-w-none">
              <p className="text-gray-700 leading-relaxed">
                {description || 'Описание товара будет добавлено позже.'}
              </p>
            </div>
            
            {features.length > 0 && (
              <div className="mt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Особенности</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'specifications' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Характеристики</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="grid grid-cols-2 py-3 border-b border-gray-200">
                <dt className="font-medium text-gray-900">Бренд</dt>
                <dd className="text-gray-700">{specifications.brand}</dd>
              </div>
              <div className="grid grid-cols-2 py-3 border-b border-gray-200">
                <dt className="font-medium text-gray-900">Категория</dt>
                <dd className="text-gray-700">{specifications.category}</dd>
              </div>
              <div className="grid grid-cols-2 py-3 border-b border-gray-200">
                <dt className="font-medium text-gray-900">Пол</dt>
                <dd className="text-gray-700">{specifications.genders.join(', ')}</dd>
              </div>
              <div className="grid grid-cols-2 py-3 border-b border-gray-200">
                <dt className="font-medium text-gray-900">Доступные цвета</dt>
                <dd className="text-gray-700">{specifications.colors.join(', ')}</dd>
              </div>
              <div className="grid grid-cols-2 py-3 border-b border-gray-200">
                <dt className="font-medium text-gray-900">Размеры</dt>
                <dd className="text-gray-700">{specifications.sizes.join(', ')}</dd>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Отзывы покупателей</h3>
              <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                Написать отзыв
              </button>
            </div>
            
            {/* Rating Summary */}
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl font-bold text-gray-900">
                  {reviews.rating.toFixed(1)}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {renderStars(reviews.rating)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {reviews.count} отзывов
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            {reviews.reviews.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Пока нет отзывов</h4>
                <p className="text-gray-600">Станьте первым, кто оставит отзыв о этом товаре</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.reviews.map((review, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6">
                    {/* Review content would go here */}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'delivery' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Доставка и возврат</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Delivery */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Доставка</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium text-gray-900">Курьерская доставка</div>
                      <div className="text-sm text-gray-600">1-2 дня по Москве - 500₽</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium text-gray-900">Почта России</div>
                      <div className="text-sm text-gray-600">3-7 дней по России - от 300₽</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium text-gray-900">Пункт выдачи</div>
                      <div className="text-sm text-gray-600">2-3 дня - 200₽</div>
                    </div>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-emerald-800">
                      Бесплатная доставка при заказе от 5000₽
                    </div>
                  </div>
                </div>
              </div>

              {/* Returns */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Возврат</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium text-gray-900">30 дней на возврат</div>
                      <div className="text-sm text-gray-600">С момента получения товара</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium text-gray-900">Условия возврата</div>
                      <div className="text-sm text-gray-600">Товар в оригинальной упаковке</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                    <div>
                      <div className="font-medium text-gray-900">Возврат средств</div>
                      <div className="text-sm text-gray-600">В течение 7 рабочих дней</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional info */}
            <div className="bg-blue-50 rounded-xl p-6 mt-6">
              <h4 className="font-semibold text-blue-900 mb-3">Дополнительная информация</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Примерка возможна только в пунктах выдачи</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>При возврате покупатель оплачивает доставку</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Товар должен быть в первоначальном виде с бирками</span>
                </div>
              </div>
            </div>

            {/* Contact info */}
            <div className="border-t pt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Есть вопросы по доставке?</h4>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+7 (800) 123-45-67</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>support@sneakerstore.ru</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;