/**
 * SEO Utilities for Market-Time.ro
 *
 * Helpers for generating meta tags, structured data, and SEO-optimized content
 */

import type { Product } from '@/types/product';

const SITE_NAME = 'Market-Time.ro';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://market-time.ro';
const SITE_DESCRIPTION = 'Compară prețurile la mii de produse din magazine online. Găsește cele mai bune oferte la fashion, electronice, casă și grădină.';

export interface MetaData {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'product' | 'article';
  keywords?: string;
  noindex?: boolean;
}

/**
 * Generate complete page metadata
 */
export function generateMetadata(meta: MetaData) {
  const title = meta.title.includes(SITE_NAME)
    ? meta.title
    : `${meta.title} | ${SITE_NAME}`;

  return {
    title,
    description: meta.description,
    keywords: meta.keywords,
    robots: meta.noindex ? 'noindex, nofollow' : 'index, follow',
    canonical: meta.canonical || SITE_URL,
    openGraph: {
      title,
      description: meta.description,
      url: meta.canonical || SITE_URL,
      siteName: SITE_NAME,
      type: meta.ogType || 'website',
      images: meta.ogImage ? [
        {
          url: meta.ogImage,
          width: 1200,
          height: 630,
          alt: meta.title,
        }
      ] : [],
      locale: 'ro_RO',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: meta.description,
      images: meta.ogImage ? [meta.ogImage] : [],
    },
  };
}

/**
 * Generate homepage metadata
 */
export function getHomeMetadata(): MetaData {
  return {
    title: `${SITE_NAME} - Compară Prețuri Online`,
    description: SITE_DESCRIPTION,
    canonical: SITE_URL,
    keywords: 'comparator preturi, oferte online, reduceri, produse ieftine, shopping online romania',
    ogType: 'website',
  };
}

/**
 * Generate category page metadata
 */
export function getCategoryMetadata(categorySlug: string, productCount: number = 0): MetaData {
  const categoryName = categorySlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${categoryName} - Compară Prețuri`,
    description: `Descoperă ${productCount} produse din categoria ${categoryName}. Compară prețurile și găsește cele mai bune oferte la ${categoryName.toLowerCase()}.`,
    canonical: `${SITE_URL}/c/${categorySlug}`,
    keywords: `${categoryName}, preturi ${categoryName.toLowerCase()}, oferte ${categoryName.toLowerCase()}, ${categoryName.toLowerCase()} online`,
    ogType: 'website',
  };
}

/**
 * Generate product page metadata
 */
export function getProductMetadata(product: Product, categorySlug: string): MetaData {
  const priceText = product.on_sale && product.price_regular
    ? `${product.price.toFixed(2)} RON (redus de la ${product.price_regular.toFixed(2)} RON)`
    : `${product.price.toFixed(2)} RON`;

  const description = product.short_description
    ? `${product.short_description.slice(0, 150)}... Preț: ${priceText} la ${product.merchant.name}.`
    : `${product.title} - Preț: ${priceText} la ${product.merchant.name}. Compară prețuri și cumpără acum!`;

  return {
    title: product.title,
    description,
    canonical: `${SITE_URL}/p/${categorySlug}/${product.id}`,
    ogImage: product.image_url,
    ogType: 'product',
    keywords: `${product.title}, ${product.brand || ''}, pret ${product.title}, ${product.merchant.name}`.trim(),
  };
}

/**
 * Generate all products page metadata
 */
export function getAllProductsMetadata(productCount: number = 0): MetaData {
  return {
    title: 'Toate Produsele - Compară Prețuri',
    description: `Descoperă toate cele ${productCount} produse disponibile. Compară prețurile din toate categoriile și găsește ofertele potrivite pentru tine.`,
    canonical: `${SITE_URL}/produse`,
    keywords: 'toate produsele, catalog complet, comparator preturi, oferte online',
    ogType: 'website',
  };
}

/**
 * Generate Product Schema.org structured data (JSON-LD)
 */
export function generateProductSchema(product: Product, categorySlug: string) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    image: [product.image_url, ...product.gallery_images].filter(Boolean),
    description: product.short_description || product.title,
    sku: product.sku,
    brand: product.brand ? {
      '@type': 'Brand',
      name: product.brand,
    } : undefined,
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/p/${categorySlug}/${product.id}`,
      priceCurrency: 'RON',
      price: product.price.toFixed(2),
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: product.merchant.name,
      },
    },
    aggregateRating: undefined, // TODO: Add when reviews are implemented
  };

  return schema;
}

/**
 * Generate BreadcrumbList Schema.org structured data
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate ItemList Schema.org for product listings
 */
export function generateProductListSchema(products: Product[], categorySlug?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/p/${categorySlug || product.category_ids[0]}/${product.id}`,
      name: product.title,
    })),
  };
}

/**
 * Generate WebSite Schema.org for homepage
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/produse?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Helper to inject JSON-LD script into page
 */
export function generateJsonLd(schema: object) {
  return {
    __html: JSON.stringify(schema),
  };
}
