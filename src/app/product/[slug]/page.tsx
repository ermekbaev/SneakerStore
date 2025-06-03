// src/app/product/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductPage from '@/components/products/ProductPage';

interface Product {
  slug: string;
  Name: string;
  brandName: string;
  Price: number;
  imageUrl: string;
  gallery: Array<{
    url: string;
    alt: string;
    formats?: {
      small?: string;
      medium?: string;
      large?: string;
    };
  }>;
  colors: Array<{
    id: number;
    name: string;
    colorCode?: string;
  }>;
  sizes: Array<{
    id: number;
    value: string;
    available: boolean;
  }>;
  genders: string[];
  categoryName: string;
  description: string;
  features?: string[];
  models: any[];
  originalPrice?: number;
  isNew: boolean;
  isSale: boolean;
  featured: boolean;
  rating: number;
  reviewsCount: number;
  stock: number;
}

async function getProduct(slug: string): Promise<{ product: Product } | null> {
  try {
    const response = await fetch(
      `${ 'http://localhost:3000'}/api/products/${slug}`,
      {
        cache: 'no-store', // Всегда получаем свежие данные
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Обновляем generateMetadata для Next.js 15
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> // Теперь params это Promise
}): Promise<Metadata> {
  // Await params для Next.js 15
  const { slug } = await params;
  const data = await getProduct(slug);
  
  if (!data) {
    return {
      title: 'Товар не найден',
      description: 'Запрашиваемый товар не найден'
    };
  }

  const { product } = data;

  return {
    title: `${product.Name} - ${product.brandName} | SneakerStore`,
    description: product.description || `${product.Name} от ${product.brandName}. Цена ${product.Price} ₽. Купить оригинальные кроссовки в интернет-магазине SneakerStore.`,
    keywords: `${product.Name}, ${product.brandName}, кроссовки, спортивная обувь, ${product.categoryName}`,
    openGraph: {
      title: `${product.Name} - ${product.brandName}`,
      description: product.description || `${product.Name} от ${product.brandName}`,
      images: [
        {
          url: product.imageUrl,
          width: 800,
          height: 600,
          alt: product.Name,
        }
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.Name} - ${product.brandName}`,
      description: product.description || `${product.Name} от ${product.brandName}`,
      images: [product.imageUrl],
    }
  };
}

// Обновляем основной компонент для Next.js 15
export default async function ProductDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> // Теперь params это Promise
}) {
  // Await params для Next.js 15
  const { slug } = await params;
  const data = await getProduct(slug);

  if (!data) {
    notFound();
  }

  // Структурированные данные для SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.product.Name,
    brand: {
      '@type': 'Brand',
      name: data.product.brandName
    },
    description: data.product.description,
    image: data.product.imageUrl,
    offers: {
      '@type': 'Offer',
      price: data.product.Price,
      priceCurrency: 'RUB',
      availability: data.product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'SneakerStore'
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: data.product.rating,
      reviewCount: data.product.reviewsCount
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ProductPage product={data.product} />
    </>
  );
}