'use client';

import Image from "next/image";
import Link from "next/link";
import { notFound, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Product } from "@/types/product";
import { getProductMetadata, generateProductSchema, generateBreadcrumbSchema, generateJsonLd } from "@/lib/seo";
import { trackProductView, trackAffiliateClick, enhanceAffiliateLink } from "@/lib/tracking";
import RecommendedProducts from "@/app/components/RecommendedProducts";

interface ProductPageProps {
  params: {
    category: string;
    slug: string;
  };
}

// Helper function to update meta tags
function updateMetaTag(property: string, content: string) {
  let meta = document.querySelector(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!params.slug) return;

    // Extract product ID from slug (format: "title-slug-123" -> extract 123)
    const slugParts = params.slug.split('-');
    const productId = parseInt(slugParts[slugParts.length - 1]);

    if (isNaN(productId)) {
      notFound();
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://api.market-time.ro/wp-json/market-time/v1'}/products?id=${productId}`)
      .then(res => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then(response => {
        if (!response.data || response.data.length === 0) {
          throw new Error('Product not found');
        }
        setProduct(response.data[0]);
      })
      .catch((error) => {
        console.error('Error loading product:', error);
        notFound();
      });
  }, [params.slug]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update page metadata when product loads
  useEffect(() => {
    if (product) {
      const metadata = getProductMetadata(product, params.category);
      document.title = metadata.title;

      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', metadata.description);

      // Update canonical
      let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.href = metadata.canonical || '';

      // Update OG tags
      updateMetaTag('og:title', metadata.title);
      updateMetaTag('og:description', metadata.description);
      updateMetaTag('og:image', product.image_url);
      updateMetaTag('og:url', metadata.canonical || '');
      updateMetaTag('og:type', 'product');

      // Track product view
      trackProductView(product, params.category);
    }
  }, [product, params.category]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Se încarcă produsul...</p>
        </div>
      </div>
    );
  }

  // Build affiliate link with tracking parameters
  const baseAffiliateLink = `${product.affiliate_code}${encodeURIComponent(product.product_url)}`;
  const affiliateLink = enhanceAffiliateLink(baseAffiliateLink);

  // Handle affiliate link click
  const handleAffiliateClick = () => {
    trackAffiliateClick(product, params.category);
  };

  // Generate structured data
  const productSchema = generateProductSchema(product, params.category);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Acasă', url: process.env.NEXT_PUBLIC_SITE_URL || 'https://market-time.ro' },
    { name: params.category.replace(/-/g, ' '), url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://market-time.ro'}/c/${params.category}` },
    { name: product.title, url: pathname },
  ]);

  return (
    <>
      {/* Structured Data - JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateJsonLd(productSchema)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={generateJsonLd(breadcrumbSchema)}
      />

      <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700">
            Market-Time.ro
          </Link>
        </div>
      </header>

      {/* Breadcrumbs */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              Acasă
            </Link>
            <span>/</span>
            <span className="text-gray-900 line-clamp-1">{product.title}</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Product Images */}
            <div>
              {/* Main Image */}
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <Image
                  src={product.image_url}
                  alt={product.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {product.discount_percentage > 0 && (
                  <span className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-lg">
                    -{product.discount_percentage}%
                  </span>
                )}
              </div>

              {/* Gallery Thumbnails */}
              {product.gallery_images && product.gallery_images.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.gallery_images.slice(0, 4).map((image, index) => (
                    <div
                      key={index}
                      className="relative aspect-square bg-gray-100 rounded-md overflow-hidden cursor-pointer hover:opacity-75"
                    >
                      <Image
                        src={image}
                        alt={`${product.title} - ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 25vw, 12vw"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Title & Brand */}
              <div className="mb-4">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {product.title}
                </h1>
                {product.brand && (
                  <p className="text-base text-gray-600">
                    Brand: <span className="font-medium">{product.brand}</span>
                  </p>
                )}
                <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
              </div>

              {/* Price Section */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                {product.on_sale && product.price_regular && (
                  <p className="text-lg text-gray-400 line-through mb-1">
                    {product.price_regular.toFixed(2)} RON
                  </p>
                )}
                <p className={`text-3xl font-bold mb-3 ${product.on_sale ? 'text-red-600' : 'text-gray-900'}`}>
                  {product.price.toFixed(2)} RON
                </p>

                {/* Merchant Info */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Magazin:</p>
                    <p className="text-base font-semibold text-gray-900">
                      {product.merchant.name}
                    </p>
                  </div>
                  {product.on_sale && product.price_regular && (
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Economisești:</p>
                      <p className="text-base font-semibold text-green-600">
                        {(product.price_regular - product.price).toFixed(2)} RON
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Short Description */}
              {product.short_description && (
                <div className="mb-4">
                  <h2 className="text-lg font-bold text-gray-900 mb-2">Descriere</h2>
                  <div
                    className="text-gray-700 leading-relaxed text-sm"
                    dangerouslySetInnerHTML={{ __html: product.short_description }}
                  />
                </div>
              )}

              {/* Product Details */}
              <div className="border-t pt-4">
                <h2 className="text-lg font-bold text-gray-900 mb-2">Detalii Produs</h2>
                <dl className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Stare:</dt>
                    <dd className="font-medium text-gray-900">
                      {product.on_sale ? 'În Ofertă' : 'Disponibil'}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Cod Produs:</dt>
                    <dd className="font-medium text-gray-900">{product.sku}</dd>
                  </div>
                  {product.brand && (
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Brand:</dt>
                      <dd className="font-medium text-gray-900">{product.brand}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Ultima actualizare:</dt>
                    <dd className="font-medium text-gray-900">
                      {new Date(product.last_updated).toLocaleDateString('ro-RO')}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Recommended Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <RecommendedProducts
          currentProductId={product.id}
          categorySlug={params.category}
        />
      </div>

      {/* Sticky CTA Button - Normal size initially, shrinks 20% on scroll */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg transition-all duration-300">
        <div className={`max-w-7xl mx-auto px-4 transition-all duration-300 ${
          isScrolled ? 'py-2' : 'py-4'
        }`}>
          <a
            href={affiliateLink}
            target="_blank"
            rel="nofollow noopener"
            onClick={handleAffiliateClick}
            className={`block bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all duration-300 text-center ${
              isScrolled ? 'text-base py-3 px-6 max-w-md mx-auto' : 'text-xl py-4 px-8'
            }`}
          >
            Vezi Preț pe {product.merchant.name} →
          </a>
        </div>
      </div>
    </div>
    </>
  );
}
