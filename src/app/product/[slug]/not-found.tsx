// src/app/product/[slug]/not-found.tsx
"use client"
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-md">
        {/* Большая иконка кроссовка */}
        <div className="relative">
          <div className="w-32 h-32 mx-auto mb-6 relative">
            {/* Кроссовка иконка */}
            <svg 
              className="w-full h-full text-emerald-400" 
              fill="currentColor" 
              viewBox="0 0 100 100"
            >
              <path d="M15 45c-2 0-4 1-5 3l-5 15c-1 2 0 4 2 5l65 15c2 1 4 0 5-2l10-20c1-2 0-4-2-5L20 40c-2-1-3-1-5 5z"/>
              <path d="M25 35c0-3 2-5 5-5h40c3 0 5 2 5 5v10H25V35z"/>
              <circle cx="35" cy="50" r="3"/>
              <circle cx="50" cy="52" r="3"/>
              <circle cx="65" cy="54" r="3"/>
            </svg>
            
            {/* Анимированный знак вопроса */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
              <span className="text-white font-bold text-lg">?</span>
            </div>
          </div>
        </div>
        
        {/* Заголовок */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-gray-900">
            Товар не найден
          </h1>
          <p className="text-xl text-gray-600">
            К сожалению, запрашиваемый товар не существует или был удален из каталога
          </p>
        </div>

        {/* Описание проблемы */}
        <div className="bg-gray-100 rounded-xl p-6 text-left">
          <h3 className="font-semibold text-gray-900 mb-3">Возможные причины:</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-1">•</span>
              Товар был снят с продажи
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-1">•</span>
              Неверная ссылка или устаревшая закладка
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 mt-1">•</span>
              Товар временно недоступен
            </li>
          </ul>
        </div>
        
        {/* Кнопки действий */}
        <div className="space-y-4">
          <Link href="/catalog">
            <Button variant="gradient" size="lg" className="w-full">
              Перейти в каталог
            </Button>
          </Link>
          
          <div className="flex gap-3">
            <Link href="/" className="flex-1">
              <Button variant="outline" size="lg" className="w-full">
                На главную
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg" 
              className="flex-1"
              onClick={() => window.history.back()}
            >
              Назад
            </Button>
          </div>
        </div>
        
        {/* Поиск */}
        <div className="pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Или попробуйте найти товар через поиск:
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Поиск кроссовок..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const query = (e.target as HTMLInputElement).value;
                  if (query.trim()) {
                    window.location.href = `/catalog?search=${encodeURIComponent(query.trim())}`;
                  }
                }
              }}
            />
            <Button variant="outline" size="lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Популярные категории */}
        <div className="pt-6">
          <p className="text-sm text-gray-500 mb-4">
            Популярные категории:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link 
              href="/catalog?brand=nike"
              className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm hover:bg-emerald-200 transition-colors"
            >
              Nike
            </Link>
            <Link 
              href="/catalog?brand=adidas"
              className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm hover:bg-emerald-200 transition-colors"
            >
              Adidas
            </Link>
            <Link 
              href="/catalog?gender=men"
              className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm hover:bg-emerald-200 transition-colors"
            >
              Мужские
            </Link>
            <Link 
              href="/catalog?gender=women"
              className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm hover:bg-emerald-200 transition-colors"
            >
              Женские
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}