// src/components/product/ProductImages.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

interface ProductImage {
  url: string;
  alt: string;
  formats?: {
    small?: string;
    medium?: string;
    large?: string;
  };
}

interface ProductImagesProps {
  images: ProductImage[];
  selectedIndex: number;
  onImageSelect: (index: number) => void;
  productName: string;
}

const ProductImages: React.FC<ProductImagesProps> = ({
  images,
  selectedIndex,
  onImageSelect,
  productName
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});

  const handleImageError = (index: number) => {
    console.log('🖼️ Image failed to load at index:', index, 'URL:', images[index]?.url);
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const currentImage = images[selectedIndex] || images[0];
  
  // ✅ ИСПРАВЛЕНО: Правильная обработка изображений
  const displayImages = images.length > 0 ? images : [
    { 
      url: 'https://placehold.co/600x600/f3f4f6/9ca3af?text=No+Image', 
      alt: productName,
      formats: {}
    }
  ];

  console.log('🖼️ ProductImages render:', {
    imagesCount: images.length,
    selectedIndex,
    currentImageUrl: currentImage?.url,
    hasCurrentImage: !!currentImage,
    imageErrors
  });

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden">
        <div 
          className="relative aspect-square cursor-crosshair"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          {!imageErrors[selectedIndex] && currentImage ? (
            <Image
              src={currentImage.formats?.large || currentImage.url}
              alt={currentImage.alt || productName}
              fill
              className={`object-cover transition-transform duration-300 ${
                isZoomed ? 'scale-150' : 'scale-100'
              }`}
              style={isZoomed ? {
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
              } : {}}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
              onError={() => handleImageError(selectedIndex)}
              unoptimized={true} // ✅ Принудительно отключаем оптимизацию для отладки
              onLoad={() => console.log('🖼️ Main image loaded:', currentImage.url)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
              <div className="text-center text-emerald-400">
                <svg className="w-24 h-24 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <span className="text-lg font-medium">{productName}</span>
                <p className="text-sm mt-2 text-emerald-300">Изображение товара</p>
                {/* ✅ ДОБАВЛЯЕМ отладочную информацию */}
                <p className="text-xs mt-1 text-emerald-200">
                  URL: {currentImage?.url || 'не найден'}
                </p>
              </div>
            </div>
          )}

          {/* Zoom Hint */}
          {!isZoomed && currentImage && !imageErrors[selectedIndex] && (
            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
              <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Увеличить
            </div>
          )}
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg"
              onClick={() => onImageSelect(selectedIndex > 0 ? selectedIndex - 1 : images.length - 1)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg"
              onClick={() => onImageSelect(selectedIndex < images.length - 1 ? selectedIndex + 1 : 0)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 lg:grid-cols-4 gap-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => onImageSelect(index)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                selectedIndex === index
                  ? 'border-emerald-500 shadow-lg scale-105'
                  : 'border-gray-200 hover:border-emerald-300'
              }`}
            >
              {!imageErrors[index] ? (
                <Image
                  src={image.formats?.small || image.url}
                  alt={image.alt || productName}
                  fill
                  className="object-cover"
                  sizes="150px"
                  onError={() => handleImageError(index)}
                  unoptimized={true} // ✅ Принудительно отключаем оптимизацию для отладки
                  onLoad={() => console.log('🖼️ Thumbnail loaded:', image.url)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              
              {/* Selection Indicator */}
              {selectedIndex === index && (
                <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Mobile Swipe Hint */}
      <div className="lg:hidden text-center text-sm text-gray-500 mt-2">
        Смахните для просмотра других изображений
      </div>

      {/* ✅ ОТЛАДОЧНАЯ ИНФОРМАЦИЯ (можно удалить после исправления) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
          <strong>Debug Info:</strong>
          <br />Images count: {images.length}
          <br />Current image URL: {currentImage?.url || 'none'}
          <br />Image errors: {Object.keys(imageErrors).length}
        </div>
      )}
    </div>
  );
};

export default ProductImages;