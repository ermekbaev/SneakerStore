// src/components/layout/Header.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const Header = () => {
  const [cartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/90 border-b border-emerald-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              SneakerStore
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/catalog" 
              className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
            >
              Каталог
            </Link>
            <Link 
              href="/brands" 
              className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
            >
              Бренды
            </Link>
            <Link 
              href="/sale" 
              className="text-gray-700 hover:text-emerald-600 font-medium transition-colors relative"
            >
              Скидки
              <Badge variant="sale" className="absolute -top-2 -right-8 text-xs">
                HOT
              </Badge>
            </Link>
            <Link 
              href="/new" 
              className="text-gray-700 hover:text-emerald-600 font-medium transition-colors"
            >
              Новинки
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-sm mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Поиск кроссовок..."
                className="w-full px-4 py-2 pl-10 pr-4 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-emerald-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Favorites */}
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <svg
                className="h-5 w-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative">
              <svg
                className="h-5 w-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293A1 1 0 005 17h16M16 21a2 2 0 100-4 2 2 0 000 4zM9 21a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
              {cartCount > 0 && (
                <Badge 
                  variant="default" 
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>

            {/* Profile */}
            <Button variant="outline" size="sm" className="hidden sm:flex">
              Войти
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-emerald-100">
            <div className="flex flex-col space-y-4">
              {/* Mobile Search */}
              <div className="px-2">
                <input
                  type="text"
                  placeholder="Поиск кроссовок..."
                  className="w-full px-4 py-2 border border-emerald-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              
              <Link href="/catalog" className="px-2 py-2 text-gray-700 hover:text-emerald-600">
                Каталог
              </Link>
              <Link href="/brands" className="px-2 py-2 text-gray-700 hover:text-emerald-600">
                Бренды
              </Link>
              <Link href="/sale" className="px-2 py-2 text-gray-700 hover:text-emerald-600">
                Скидки
              </Link>
              <Link href="/new" className="px-2 py-2 text-gray-700 hover:text-emerald-600">
                Новинки
              </Link>
              
              <div className="px-2 pt-2 border-t border-emerald-100">
                <Button variant="gradient" className="w-full">
                  Войти
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;