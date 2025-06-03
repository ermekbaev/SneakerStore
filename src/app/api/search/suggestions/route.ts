/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/app/api/search/suggestions/route.ts
import { NextRequest } from 'next/server';
import { 
  searchProducts, 
  fetchProducts,
  fetchBrands,
  fetchCategories,
  getFullImageUrl
} from '../../../../services/api';
import { formatApiProduct } from '../../../../utils/apiHelpers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '8');
    
    console.log('🔍 [Suggestions API] Запрос:', query, 'лимит:', limit);
    
    if (!query.trim()) {
      return Response.json({
        products: [],
        brands: [],
        categories: [],
        total: 0
      });
    }
    
    const results = {
      products: [],
      brands: [],
      categories: [],
      total: 0
    };
    
    // Параллельно выполняем все поиски
    const [productsData, brandsData, categoriesData] = await Promise.all([
      // Поиск товаров
      searchProducts(query, {}).catch(err => {
        console.error('Ошибка поиска товаров:', err);
        return [];
      }),
      
      // Поиск брендов
      fetchBrands().then(brands => 
        brands.filter((brand: { Brand_Name: string; }) => 
          brand.Brand_Name.toLowerCase().includes(query.toLowerCase())
        ).map((brand: { Brand_Name: any; }) => brand.Brand_Name)
      ).catch(err => {
        console.error('Ошибка поиска брендов:', err);
        return [];
      }),
      
      // Поиск категорий
      fetchCategories().then(categories =>
        categories.filter(category =>
          category.Name.toLowerCase().includes(query.toLowerCase()) ||
          (category.NameEngl && category.NameEngl.toLowerCase().includes(query.toLowerCase()))
        ).map(category => category.Name)
      ).catch(err => {
        console.error('Ошибка поиска категорий:', err);
        return [];
      })
    ]);
    
    // Обрабатываем товары (берем только топ-4)
    if (productsData.length > 0) {
      const processedProducts = await Promise.all(
        productsData.slice(0, 4).map(async (product) => {
          try {
            // Используем простое форматирование без моделей для быстроты
            return {
              slug: product.slug,
              Name: product.Name,
              brandName: product.brand?.Brand_Name || 'Unknown',
              Price: product.Price,
              imageUrl: getFullImageUrl(product.Image?.url),
              categoryName: product.category?.Name
            };
          } catch (error) {
            console.error('Ошибка форматирования товара:', error);
            return null;
          }
        })
      );
      //@ts-ignore
      results.products = processedProducts.filter(Boolean);
    }
    
    // Ограничиваем количество результатов
    results.brands = brandsData.slice(0, 3);
    //@ts-ignore
    results.categories = categoriesData.slice(0, 3);
    results.total = results.products.length + results.brands.length + results.categories.length;
    
    console.log('✅ [Suggestions API] Результаты:', {
      products: results.products.length,
      brands: results.brands.length,
      categories: results.categories.length,
      total: results.total
    });
    
    return Response.json(results);
    
  } catch (error) {
    console.error('❌ [Suggestions API] Ошибка:', error);
    return Response.json(
      { 
        error: 'Failed to fetch suggestions',
        products: [],
        brands: [],
        categories: [],
        total: 0
      },
      { status: 500 }
    );
  }
}