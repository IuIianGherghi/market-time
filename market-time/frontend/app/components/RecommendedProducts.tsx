'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getRecommendedProducts } from "@/lib/api";
import type { Product } from "@/types/product";
import { trackAffiliateClick, enhanceAffiliateLink } from "@/lib/tracking";

interface RecommendedProductsProps {
  currentProductId: number;
  categorySlug: string;
}

export default function RecommendedProducts({
  currentProductId,
  categorySlug,
}: RecommendedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecommendedProducts() {
      try {
        const response = await getRecommendedProducts(currentProductId, categorySlug, 6);
        setProducts(response.data);
      } catch (error) {
        console.error('Error loading recommended products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    loadRecommendedProducts();
  }, [currentProductId, categorySlug]);

  if (loading) {
    return (
      <div className="py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600 text-sm">Se încarcă produsele recomandate...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Produse Recomandate</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} categorySlug={categorySlug} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product, categorySlug }: { product: Product; categorySlug: string }) {
  const baseAffiliateLink = `${product.affiliate_code}${encodeURIComponent(product.product_url)}`;
  const affiliateLink = enhanceAffiliateLink(baseAffiliateLink);

  const handleAffiliateClick = () => {
    trackAffiliateClick(product, categorySlug);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow overflow-hidden">
      {/* Product Image - Clickable */}
      <Link href={`/p/${product.category_ids[0]}/${product.slug}`}>
        <div className="relative h-32 bg-gray-100 cursor-pointer group">
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          />
          {product.discount_percentage > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">
              -{product.discount_percentage}%
            </span>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-3">
        <Link href={`/p/${product.category_ids[0]}/${product.slug}`}>
          <h3 className="text-xs font-medium text-gray-900 line-clamp-2 mb-2 h-8 hover:text-blue-600 cursor-pointer">
            {product.title}
          </h3>
        </Link>

        {/* Price */}
        <div className="mb-2">
          {product.on_sale && product.price_regular && (
            <p className="text-xs text-gray-400 line-through">
              {product.price_regular.toFixed(2)} RON
            </p>
          )}
          <p className={`text-base font-bold ${product.on_sale ? 'text-red-600' : 'text-gray-900'}`}>
            {product.price.toFixed(2)} RON
          </p>
        </div>

        {/* Merchant */}
        <p className="text-xs text-gray-600 mb-2 truncate">
          {product.merchant.name}
        </p>

        {/* Action Buttons */}
        <div className="space-y-1">
          {/* View Details Button */}
          <Link
            href={`/p/${product.category_ids[0]}/${product.slug}`}
            className="w-full block bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-1.5 px-2 rounded transition-colors text-center"
          >
            Vezi Detalii
          </Link>

          {/* Buy Now Button */}
          <a
            href={affiliateLink}
            target="_blank"
            rel="nofollow noopener"
            onClick={handleAffiliateClick}
            className="w-full block bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-1.5 px-2 rounded transition-colors text-center"
          >
            Cumpără
          </a>
        </div>
      </div>
    </div>
  );
}
