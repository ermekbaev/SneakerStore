// src/components/search/MobileSearchModal.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import AdvancedSearchBar from './AdvancedSearchBar';

interface MobileSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSearchModal: React.FC<MobileSearchModalProps> = ({
  isOpen,
  onClose
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Закрытие по клику вне модального окна
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
      
      // Фокус на поле ввода
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Закрытие по Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        ref={modalRef}
        className="absolute top-0 left-0 right-0 bg-white shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Поиск товаров
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        {/* Search Content */}
        <div className="p-4">
          <AdvancedSearchBar 
            placeholder="Поиск кроссовок..."
            showHistory={true}
            className="w-full"
          />
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Быстрый поиск:
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              'Nike',
              'Adidas', 
              'Jordan',
              'Белые кроссовки',
              'Черные кроссовки',
              'Беговые'
            ].map((quickSearch) => (
              <Button
                key={quickSearch}
                variant="outline"
                size="sm"
                onClick={() => {
                  window.location.href = `/search?q=${encodeURIComponent(quickSearch)}`;
                  onClose();
                }}
                className="text-gray-600 border-gray-300 hover:border-emerald-300 hover:text-emerald-600"
              >
                {quickSearch}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSearchModal;