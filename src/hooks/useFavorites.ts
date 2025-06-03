/* eslint-disable react-hooks/exhaustive-deps */
// src/hooks/useFavorites.ts
'use client';

import { useState, useEffect, useCallback } from 'react';

export interface FavoriteItem {
  productSlug: string;
  addedAt: string;
}

export interface UseFavoritesReturn {
  favorites: FavoriteItem[];
  loading: boolean;
  error: string | null;
  addToFavorites: (productSlug: string) => Promise<boolean>;
  removeFromFavorites: (productSlug: string) => Promise<boolean>;
  toggleFavorite: (productSlug: string) => Promise<boolean>;
  isFavorite: (productSlug: string) => boolean;
  clearFavorites: () => Promise<boolean>;
  loadFavorites: () => void;
  getFavoritesCount: () => number;
}

/**
 * Хук для управления избранными товарами
 */
export const useFavorites = (): UseFavoritesReturn => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загружаем избранное при инициализации
  useEffect(() => {
    loadFavorites();
  }, []);

  // Сохраняем избранное в localStorage при изменении
  useEffect(() => {
    if (!loading && typeof window !== 'undefined') {
      try {
        localStorage.setItem('favorites', JSON.stringify(favorites));
      } catch (err) {
        console.error('Ошибка при сохранении избранного:', err);
      }
    }
  }, [favorites, loading]);

  // Функция загрузки избранного из localStorage
  const loadFavorites = useCallback(() => {
    try {
      setLoading(true);
      
      if (typeof window !== 'undefined') {
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
          const parsedFavorites = JSON.parse(storedFavorites);
          // Валидируем структуру данных
          if (Array.isArray(parsedFavorites)) {
            setFavorites(parsedFavorites);
          }
        }
      }
      
      setError(null);
    } catch (err) {
      console.error('Ошибка при загрузке избранного:', err);
      setError('Не удалось загрузить избранное');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Функция добавления товара в избранное
  const addToFavorites = useCallback(async (productSlug: string): Promise<boolean> => {
    try {
      if (isFavorite(productSlug)) {
        return true; // Уже в избранном
      }

      const newFavorite: FavoriteItem = {
        productSlug,
        addedAt: new Date().toISOString(),
      };

      setFavorites(prevFavorites => [...prevFavorites, newFavorite]);
      setError(null);
      return true;
    } catch (err) {
      console.error('Ошибка при добавлении в избранное:', err);
      setError('Не удалось добавить товар в избранное');
      return false;
    }
  }, [favorites]);

  // Функция удаления товара из избранного
  const removeFromFavorites = useCallback(async (productSlug: string): Promise<boolean> => {
    try {
      setFavorites(prevFavorites => 
        prevFavorites.filter(item => item.productSlug !== productSlug)
      );
      setError(null);
      return true;
    } catch (err) {
      console.error('Ошибка при удалении из избранного:', err);
      setError('Не удалось удалить товар из избранного');
      return false;
    }
  }, []);

  // Функция переключения статуса избранного
  const toggleFavorite = useCallback(async (productSlug: string): Promise<boolean> => {
    try {
      if (isFavorite(productSlug)) {
        return await removeFromFavorites(productSlug);
      } else {
        return await addToFavorites(productSlug);
      }
    } catch (err) {
      console.error('Ошибка при переключении избранного:', err);
      setError('Не удалось обновить избранное');
      return false;
    }
  }, [favorites]);

  // Функция проверки наличия товара в избранном
  const isFavorite = useCallback((productSlug: string): boolean => {
    return favorites.some(item => item.productSlug === productSlug);
  }, [favorites]);

  // Функция очистки избранного
  const clearFavorites = useCallback(async (): Promise<boolean> => {
    try {
      setFavorites([]);
      setError(null);
      return true;
    } catch (err) {
      console.error('Ошибка при очистке избранного:', err);
      setError('Не удалось очистить избранное');
      return false;
    }
  }, []);

  // Функция получения количества избранных товаров
  const getFavoritesCount = useCallback((): number => {
    return favorites.length;
  }, [favorites]);

  return {
    favorites,
    loading,
    error,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    loadFavorites,
    getFavoritesCount,
  };
};