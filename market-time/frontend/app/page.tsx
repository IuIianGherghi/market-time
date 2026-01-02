import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { getLatestProducts, getTopDeals } from "@/lib/api";
import type { Product } from "@/types/product";
import { generateWebsiteSchema } from "@/lib/seo";

export default async function Home() {
  // Fetch latest products and top deals
  const [latestResponse, topDealsResponse] = await Promise.all([
    getLatestProducts(12),
    getTopDeals(6),
  ]);

  const latestProducts = latestResponse.data;
  const topDeals = topDealsResponse.data;

  // Generate structured data
  const websiteSchema = generateWebsiteSchema();

  return (
    <>
      {/* Structured Data - JSON-LD */}
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Market-Time.ro</h1>
          <p className="text-gray-600 mt-1">Găsește cele mai bune oferte</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Deals Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Oferte de Top</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {topDeals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Latest Products Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Produse Noi</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {latestProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>
    </div>
    </>
  );
}

function ProductCard({ product }: { product: Product }) {
  const affiliateLink = `${product.affiliate_code}${encodeURIComponent(product.product_url)}`;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
      {/* Product Image - Clickable */}
      <Link href={`/p/${product.category_ids[0]}/${product.id}`}>
        <div className="relative h-64 bg-gray-100 cursor-pointer group">
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {product.discount_percentage > 0 && (
            <span className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-md font-bold text-sm">
              -{product.discount_percentage}%
            </span>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <Link href={`/p/${product.category_ids[0]}/${product.id}`}>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 h-10 hover:text-blue-600 cursor-pointer">
            {product.title}
          </h3>
        </Link>

        {product.brand && (
          <p className="text-xs text-gray-500 mb-2">{product.brand}</p>
        )}

        {/* Price */}
        <div className="mb-3">
          {product.on_sale && product.price_regular && (
            <p className="text-sm text-gray-400 line-through">
              {product.price_regular.toFixed(2)} RON
            </p>
          )}
          <p className={`text-xl font-bold ${product.on_sale ? 'text-red-600' : 'text-gray-900'}`}>
            {product.price.toFixed(2)} RON
          </p>
        </div>

        {/* Merchant */}
        <p className="text-xs text-gray-600 mb-3">
          la <span className="font-medium">{product.merchant.name}</span>
        </p>

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Buy Now Button - External Affiliate Link */}
          <a
            href={affiliateLink}
            target="_blank"
            rel="nofollow noopener"
            className="w-full block bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded-md transition-colors text-center"
          >
            Comandă Acum pe {product.merchant.name}
          </a>

          {/* View Details Button - Internal Link */}
          <Link
            href={`/p/${product.category_ids[0]}/${product.id}`}
            className="w-full block bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded-md transition-colors text-center"
          >
            Vezi Detalii
          </Link>
        </div>
      </div>
    </div>
  );
}
