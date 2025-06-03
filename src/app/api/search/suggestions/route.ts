// src/app/api/search/suggestions/route.ts - ИСПРАВЛЕНО ДЛЯ ИЗОБРАЖЕНИЙ
import { NextRequest } from 'next/server';
import { 
  searchProducts, 
  fetchBrands,
  fetchCategories,
  fetchModels,
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
    
    try {
      // Поиск товаров с правильными изображениями
      console.log('🔄 [Suggestions] Ищем товары...');
      const productsData = await searchProducts(query, {});
      
      if (productsData && productsData.length > 0) {
        console.log(`📦 [Suggestions] Найдено ${productsData.length} товаров, обрабатываем первые 4...`);
        
        // ✅ КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ: Обрабатываем товары с моделями
        const processedProducts = [];
        
        for (let i = 0; i < Math.min(4, productsData.length); i++) {
          const product = productsData[i];
          
          try {
            console.log(`🎨 [Suggestions] Обрабатываем товар ${i + 1}: ${product.Name} (${product.slug})`);
            
            // ✅ Загружаем модели для правильных изображений
            const models = await fetchModels(product.slug);
            console.log(`🖼️ [Suggestions] Найдено ${models.length} моделей для ${product.slug}`);
            
            if (models.length > 0) {
              // ✅ Используем formatApiProduct для правильной обработки
              const formatted = await formatApiProduct(product, models);
              
              const result = {
                slug: formatted.slug,
                Name: formatted.Name,
                brandName: formatted.brandName,
                Price: formatted.Price,
                imageUrl: formatted.imageUrl, // ✅ Правильное изображение из модели!
                categoryName: formatted.categoryNames[0] || product.category?.Name
              };
              
              console.log(`✅ [Suggestions] Товар ${product.slug} обработан:`);
              console.log(`   - Название: ${result.Name}`);
              console.log(`   - Изображение: ${result.imageUrl}`);
              console.log(`   - Реальное изображение: ${result.imageUrl && !result.imageUrl.includes('placehold') ? 'ДА' : 'НЕТ'}`);
              
              processedProducts.push(result);
            } else {
              console.log(`⚠️ [Suggestions] Нет моделей для ${product.slug}, используем fallback`);
              
              // Fallback без моделей
              processedProducts.push({
                slug: product.slug,
                Name: product.Name,
                brandName: product.brand?.Brand_Name || 'Unknown',
                Price: product.Price,
                imageUrl: getFullImageUrl(product.Image?.url),
                categoryName: product.category?.Name
              });
            }
            
          } catch (error) {
            console.error(`❌ [Suggestions] Ошибка обработки товара ${product.slug}:`, error);
            
            // Fallback при ошибке
            processedProducts.push({
              slug: product.slug || `product-${Date.now()}`,
              Name: product.Name || 'Без названия',
              brandName: product.brand?.Brand_Name || 'Unknown',
              Price: product.Price || 0,
              imageUrl: getFullImageUrl(product.Image?.url),
              categoryName: product.category?.Name || null
            });
          }
        }
        
        results.products = processedProducts as any[];
        console.log(`✅ [Suggestions] Итого обработано ${results.products.length} товаров с изображениями`);
      }
      
      // Параллельно загружаем бренды и категории
      const [brandsData, categoriesData] = await Promise.allSettled([
        fetchBrands().then(brands => 
          brands.filter((brand: { Brand_Name: string; }) => 
            brand.Brand_Name && brand.Brand_Name.toLowerCase().includes(query.toLowerCase())
          ).map((brand: { Brand_Name: any; }) => brand.Brand_Name)
        ),
        
        fetchCategories().then(categories =>
          categories.filter(category =>
            category.Name && (
              category.Name.toLowerCase().includes(query.toLowerCase()) ||
              (category.NameEngl && category.NameEngl.toLowerCase().includes(query.toLowerCase()))
            )
          ).map(category => category.Name)
        )
      ]);
      
      // Обрабатываем бренды
      if (brandsData.status === 'fulfilled') {
        results.brands = brandsData.value.slice(0, 3) as any[];
        console.log(`🏷️ [Suggestions] Найдено брендов: ${results.brands.length}`);
      }
      
      // Обрабатываем категории  
      if (categoriesData.status === 'fulfilled') {
        results.categories = categoriesData.value.slice(0, 3) as any[];
        console.log(`📂 [Suggestions] Найдено категорий: ${results.categories.length}`);
      }
      
    } catch (error) {
      console.error('❌ [Suggestions] Ошибка загрузки данных:', error);
    }
    
    // Добавляем умные предложения
    const smartSuggestions = generateSmartSuggestions(query);
    results.brands = [...new Set([...results.brands, ...smartSuggestions.brands])].slice(0, 3) as any[];
    results.categories = [...new Set([...results.categories, ...smartSuggestions.categories])].slice(0, 3) as any[];
    
    results.total = results.products.length + results.brands.length + results.categories.length;
    
    console.log('🎯 [Suggestions API] ФИНАЛЬНЫЕ РЕЗУЛЬТАТЫ:', {
      products: results.products.length,
      brands: results.brands.length,
      categories: results.categories.length,
      total: results.total,
      firstProductImage: results.products[0]?.imageUrl,
      productsWithRealImages: results.products.filter(p => p.imageUrl && !p.imageUrl.includes('placehold')).length
    });
    
    return Response.json(results);
    
  } catch (error) {
    console.error('❌ [Suggestions API] Критическая ошибка:', error);
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

/**
 * Генерирует умные предложения на основе запроса
 */
function generateSmartSuggestions(query: string) {
  const queryLower = query.toLowerCase();
  const suggestions = {
    brands: [] as string[],
    categories: [] as string[]
  };
  
  // Анализируем популярные слова в запросе
  const keywords = [
    { word: 'бег', brands: ['Nike', 'Adidas', 'New Balance'], categories: ['Беговые'] },
    { word: 'баскет', brands: ['Nike', 'Jordan', 'Adidas'], categories: ['Баскетбольные'] },
    { word: 'футбол', brands: ['Nike', 'Adidas', 'Puma'], categories: ['Футбольные'] },
    { word: 'тренир', brands: ['Nike', 'Adidas', 'Under Armour'], categories: ['Тренировочные'] },
    { word: 'женск', brands: [], categories: ['Женские'] },
    { word: 'мужск', brands: [], categories: ['Мужские'] },
    { word: 'детск', brands: [], categories: ['Детские'] }
  ];
  
  // Ищем совпадения
  keywords.forEach(keyword => {
    if (queryLower.includes(keyword.word)) {
      suggestions.brands.push(...keyword.brands);
      suggestions.categories.push(...keyword.categories);
    }
  });
  
  // Предлагаем конкурентов для популярных брендов
  const competitors: Record<string, string[]> = {
    'nike': ['Adidas', 'Jordan', 'Puma'],
    'adidas': ['Nike', 'Puma', 'New Balance'],
    'jordan': ['Nike', 'Adidas'],
    'puma': ['Nike', 'Adidas'],
    'new balance': ['Nike', 'Adidas', 'ASICS']
  };
  
  Object.keys(competitors).forEach(brand => {
    if (queryLower.includes(brand)) {
      suggestions.brands.push(...competitors[brand]);
    }
  });
  
  // Убираем дубликаты
  suggestions.brands = [...new Set(suggestions.brands)];
  suggestions.categories = [...new Set(suggestions.categories)];
  
  return suggestions;
}