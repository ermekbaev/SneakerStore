// src/app/api/products/route.ts
import { NextRequest } from 'next/server';
import { 
  fetchProducts, 
  searchProducts, 
  fetchModels, 
  getFullImageUrl, 
  type Product 
} from '../../../services/api';
import { formatApiProduct } from '../../../utils/apiHelpers';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '25');
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const search = searchParams.get('q');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const refresh = searchParams.get('refresh'); // Параметр для обхода кэша
    
    console.log('🚀 Products API route - Параметры запроса:', {
      limit, featured, category, brand, search, minPrice, maxPrice, refresh
    });
    
    let products: Product[] = [];
    
    // Если есть поисковые параметры, используем searchProducts
    if (search || category || brand || minPrice || maxPrice) {
      const filters = {
        categories: category ? [category] : undefined,
        brands: brand ? [brand] : undefined,
        minPrice: minPrice ? parseInt(minPrice) : undefined,
        maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      };
      
      console.log('🔍 Используем поиск с фильтрами:', filters);
      products = await searchProducts(search || '', filters);
    } else {
      // Иначе получаем все продукты
      console.log('📦 Загружаем все продукты');
      products = await fetchProducts();
    }
    
    console.log(`📊 Получено ${products.length} продуктов из API`);
    
    // НОВАЯ ЛОГИКА: Фильтрация featured товаров с рандомизацией
    if (featured === 'true') {
      console.log('⭐ Генерируем новую подборку featured товаров');
      
      // Добавляем случайное время для уникальности запросов
      const timestamp = Date.now();
      console.log(`🕒 Запрос в ${timestamp}`);
      
      // Полная рандомизация всех товаров
      const shuffled = [...products].sort(() => Math.random() - 0.5);
      
      // Выбираем разные категории товаров для разнообразия
      const segments = {
        expensive: shuffled.filter(p => p.Price > 10000),
        midRange: shuffled.filter(p => p.Price >= 5000 && p.Price <= 10000),
        affordable: shuffled.filter(p => p.Price < 5000),
        popular: shuffled.filter(p => 
          p.Name.toLowerCase().includes('nike') || 
          p.Name.toLowerCase().includes('adidas') ||
          p.Name.toLowerCase().includes('jordan') ||
          p.Name.toLowerCase().includes('puma')
        )
      };
      
      // Собираем микс из разных сегментов
      const featuredSelection = [
        ...segments.expensive.slice(0, 2),
        ...segments.popular.slice(0, 3), 
        ...segments.midRange.slice(0, 2),
        ...segments.affordable.slice(0, 1)
      ].filter((item, index, arr) => 
        // Убираем дубликаты
        arr.findIndex(p => p.slug === item.slug) === index
      );
      
      // Если товаров меньше чем нужно, добавляем случайные
      if (featuredSelection.length < limit) {
        const remaining = shuffled.filter(p => 
          !featuredSelection.find(f => f.slug === p.slug)
        );
        featuredSelection.push(...remaining.slice(0, limit - featuredSelection.length));
      }
      
      // Финальное перемешивание
      products = featuredSelection
        .sort(() => Math.random() - 0.5)
        .slice(0, limit);
        
      console.log(`⭐ Выбрано ${products.length} уникальных featured товаров`);
      console.log('📋 Товары:', products.map(p => `${p.Name} (${p.Price}₽)`));
    } else {
      // Ограичиваем результаты для обычных запросов
      products = products.slice(0, limit);
    }
    
    console.log(`📏 Итого к обработке: ${products.length} товаров`);
    
    // ✅ ИСПОЛЬЗУЕМ formatApiProduct для правильной обработки изображений
    console.log('🔄 Начинаем обработку продуктов с formatApiProduct...');
    
    const transformedProducts = await Promise.all(
      products.map(async (product, index) => {
        console.log(`🔄 Обрабатываем продукт ${index + 1}/${products.length}: ${product.Name}`);
        
        try {
          // ✅ Получаем модели для этого продукта
          const models = await fetchModels(product.slug);
          console.log(`🎨 Для продукта ${product.slug} найдено ${models.length} моделей`);
          
          // ✅ Форматируем продукт с моделями
          const formatted = await formatApiProduct(product, models);
          console.log(`✅ Продукт ${product.slug} отформатирован`);
          
          // ✅ Преобразуем в нужный формат для фронтенда
          const result = {
            slug: formatted.slug,
            Name: formatted.Name,
            brandName: formatted.brandName,
            Price: formatted.Price,
            imageUrl: formatted.imageUrl, // ✅ Теперь будет правильное изображение
            colors: formatted.colors, // ✅ Теперь будут правильные цвета
            sizes: formatted.sizes, // ✅ Правильные размеры
            genders: formatted.genders,
            categoryName: formatted.categoryNames[0] || product.category?.Name || null,
            description: formatted.Description,
            
            // Дополнительные поля для UI
            originalPrice: undefined,
            isNew: false,
            isSale: false,
            rating: 4.0 + Math.random(),
          };
          
          return result;
          
        } catch (error) {
          console.error(`❌ Ошибка обработки продукта ${product.slug}:`, error);
          
          // ✅ Fallback версия если formatApiProduct не сработал
          const fallback = {
            slug: product.slug,
            Name: product.Name,
            brandName: product.brand?.Brand_Name || 'Unknown',
            Price: product.Price,
            imageUrl: getFullImageUrl(product.Image?.url),
            colors: product.colors?.map(color => color.Name).filter(Boolean) || ['Черный'],
            sizes: product.sizes?.map(size => size.Size) || [42],
            genders: product.genders?.map(gender => gender.Geander_Name).filter(Boolean) || [],
            categoryName: product.category?.Name || null,
            description: product.Description || '',
            originalPrice: undefined,
            isNew: false,
            isSale: false,
            rating: 4.0 + Math.random(),
          };
          
          console.log(`⚠️ Используем fallback для продукта ${product.slug}`);
          return fallback;
        }
      })
    );
    
    console.log('✅ Все продукты обработаны в API route');
    
    return Response.json({
      products: transformedProducts,
      total: products.length,
      page: 1,
      limit,
    });
    
  } catch (error) {
    console.error('❌ Products API Error:', error);
    return Response.json(
      { 
        error: 'Failed to fetch products',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}