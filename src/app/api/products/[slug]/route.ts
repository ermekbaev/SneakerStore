// 📁 src/app/api/products/[slug]/route.ts
import { NextRequest } from 'next/server';
import { fetchProductById, fetchModels } from '../../../../services/api';
import { formatApiProduct } from '../../../../utils/apiHelpers';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    console.log('🔍 [Product API] Ищем товар с slug:', slug);
    
    const response = await fetchProductById(slug);
    
    if (!response.data || response.data.length === 0) {
      console.log('❌ [Product API] Товар не найден в базе данных');
      return Response.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    const productData = response.data[0];
    console.log('✅ [Product API] Найден товар:', productData.Name);
    
    // Получаем модели для правильных изображений и цветов
    console.log('🎨 [Product API] Загружаем модели...');
    const models = await fetchModels(productData.slug);
    console.log('🎨 [Product API] Найдено моделей:', models.length);
    
    // ✅ ЛОГИ ДЛЯ ОТЛАДКИ ЦВЕТОВ
    console.log('🎨 [Product API] Цвета из моделей:', models.map(m => ({
      id: m.colors?.id,
      name: m.colors?.Name,
      colorCode: m.colors?.colorCode,
      hasColorCode: !!m.colors?.colorCode
    })));
    
    // Форматируем продукт
    const formattedProduct = await formatApiProduct(productData, models);
    
    // Создаем галерею
    const gallery = formattedProduct.imageUrls.map((url, index) => ({
      url,
      alt: `${formattedProduct.Name} - изображение ${index + 1}`,
      formats: {
        small: url,
        medium: url,
        large: url,
      }
    }));
    
    // ✅ ПРАВИЛЬНО ОБРАБАТЫВАЕМ ЦВЕТА ИЗ МОДЕЛЕЙ
    let finalColors = [];
    
    if (models && models.length > 0) {
      // Используем цвета из моделей (с colorCode)
      const modelColors = models
        .filter(model => model.colors && model.colors.Name) // Только модели с цветами
        .map(model => ({
          id: model.colors.id || Math.random(),
          name: model.colors.Name,
          colorCode: model.colors.colorCode || undefined // ✅ Сохраняем colorCode!
        }))
        .filter((color, index, self) => 
          // Убираем дубликаты по имени
          index === self.findIndex(c => c.name === color.name)
        );
      
      console.log('🎨 [Product API] Обработанные цвета из моделей:', modelColors);
      finalColors = modelColors;
    }
    
    // Если цветов из моделей нет, используем цвета из основного продукта
    if (finalColors.length === 0 && productData.colors) {
      finalColors = productData.colors.map(color => ({
        id: color.id || Math.random(),
        name: color.Name,
        colorCode: color.colorCode || undefined // ✅ И здесь тоже сохраняем!
      }));
      
      console.log('🎨 [Product API] Используем цвета из основного продукта:', finalColors);
    }
    
    // Если все еще нет цветов, создаем fallback
    if (finalColors.length === 0) {
      finalColors = [
        { id: 1, name: 'Стандартный', colorCode: undefined }
      ];
      
      console.log('🎨 [Product API] Используем fallback цвет');
    }
    
    const product = {
      slug: formattedProduct.slug,
      Name: formattedProduct.Name,
      brandName: formattedProduct.brandName,
      Price: formattedProduct.Price,
      imageUrl: formattedProduct.imageUrl,
      gallery: gallery.length > 0 ? gallery : [
        {
          url: formattedProduct.imageUrl,
          alt: formattedProduct.Name,
          formats: {
            small: formattedProduct.imageUrl,
            medium: formattedProduct.imageUrl,
            large: formattedProduct.imageUrl,
          }
        }
      ],
      colors: finalColors, // ✅ Теперь с правильными colorCode!
      sizes: formattedProduct.sizes.map((size, index) => ({
        id: index + 1,
        value: size.toString(),
        available: true,
      })),
      genders: formattedProduct.genders,
      categoryName: formattedProduct.categoryNames[0] || 'Кроссовки',
      description: formattedProduct.Description || 'Описание будет добавлено позже.',
      features: [],
      models: [],
      originalPrice: undefined,
      isNew: false,
      isSale: false,
      featured: false,
      rating: 4.0 + Math.random(),
      reviewsCount: Math.floor(Math.random() * 100),
      stock: Math.floor(Math.random() * 50) + 10,
    };
    
    console.log('🎯 [Product API] Финальные цвета:', product.colors);
    
    return Response.json({ product });
    
  } catch (error) {
    console.error('💥 [Product API] Критическая ошибка:', error);
    
    return Response.json(
      { 
        error: 'Failed to fetch product',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}