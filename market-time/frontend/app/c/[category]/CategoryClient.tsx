'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getProductsByCategory } from "@/lib/api";
import type { Product } from "@/types/product";

interface CategoryClientProps {
  initialProducts: Product[];
  initialTotalCount: number;
  initialTotalPages: number;
  category: string;
  categoryDescription?: string;
  categorySeoContent?: string;
}

export default function CategoryClient({
  initialProducts,
  initialTotalCount,
  initialTotalPages,
  category,
  categoryDescription,
  categorySeoContent,
}: CategoryClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Filter states
  const [priceMin, setPriceMin] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedMerchants, setSelectedMerchants] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('date-desc');
  const [showFilters, setShowFilters] = useState(false);

  // Available filter options (extracted from products)
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);
  const [availableMerchants, setAvailableMerchants] = useState<{id: number, name: string}[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  const perPage = 20;

  useEffect(() => {
    const page = parseInt(searchParams.get('page') || '1', 10);
    const sort = searchParams.get('sort') || 'date-desc';
    setSortBy(sort);
    setCurrentPage(page);

    if (page !== 1 || sort !== 'date-desc') {
      loadProducts(page, sort);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, searchParams]);

  useEffect(() => {
    // Extract unique brands, merchants and categories from initial products
    const brands = new Set<string>();
    const merchants = new Map<number, string>();
    const categories = new Set<string>();

    initialProducts.forEach(product => {
      if (product.brand) brands.add(product.brand);
      merchants.set(product.merchant.id, product.merchant.name);
      product.category_ids.forEach(cat => categories.add(cat));
    });

    setAvailableBrands(Array.from(brands).sort());
    setAvailableMerchants(
      Array.from(merchants.entries())
        .map(([id, name]) => ({ id, name }))
        .sort((a, b) => a.name.localeCompare(b.name))
    );
    setAvailableCategories(Array.from(categories).sort());
  }, [initialProducts]);

  const loadProducts = async (page: number, sort: string = sortBy) => {
    setLoading(true);
    try {
      const minPrice = priceMin ? parseFloat(priceMin) : undefined;
      const maxPrice = priceMax ? parseFloat(priceMax) : undefined;

      // Parse sort parameter
      const [orderby, order] = sort.split('-') as ['date' | 'price' | 'discount' | 'title', 'asc' | 'desc'];

      const response = await getProductsByCategory(category, {
        page,
        per_page: perPage,
        min_price: minPrice,
        max_price: maxPrice,
        brand: selectedBrands.length > 0 ? selectedBrands.join(',') : undefined,
        merchant: selectedMerchants.length > 0 ? selectedMerchants.join(',') : undefined,
        orderby,
        order,
      });

      setProducts(response.data);
      setTotalCount(response.pagination.total_count);
      setTotalPages(response.pagination.total_pages);

      // Extract unique brands, merchants and categories
      const brands = new Set<string>();
      const merchants = new Map<number, string>();
      const categories = new Set<string>();

      response.data.forEach(product => {
        if (product.brand) brands.add(product.brand);
        merchants.set(product.merchant.id, product.merchant.name);
        product.category_ids.forEach(cat => categories.add(cat));
      });

      setAvailableBrands(Array.from(brands).sort());
      setAvailableMerchants(
        Array.from(merchants.entries())
          .map(([id, name]) => ({ id, name }))
          .sort((a, b) => a.name.localeCompare(b.name))
      );
      setAvailableCategories(Array.from(categories).sort());
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const params_url = new URLSearchParams();
    params_url.set('page', '1');
    params_url.set('sort', sortBy);
    router.push(`/c/${category}?${params_url.toString()}`);
    loadProducts(1, sortBy);
  };

  const resetFilters = () => {
    setPriceMin('');
    setPriceMax('');
    setSelectedBrands([]);
    setSelectedMerchants([]);
    setSelectedCategories([]);
    setSortBy('date-desc');
    router.push(`/c/${category}?page=1&sort=date-desc`);
    loadProducts(1, 'date-desc');
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    const params_url = new URLSearchParams();
    params_url.set('page', '1');
    params_url.set('sort', newSort);
    router.push(`/c/${category}?${params_url.toString()}`);
    loadProducts(1, newSort);
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const toggleMerchant = (merchantId: number) => {
    const merchantIdStr = merchantId.toString();
    setSelectedMerchants(prev =>
      prev.includes(merchantIdStr)
        ? prev.filter(m => m !== merchantIdStr)
        : [...prev, merchantIdStr]
    );
  };

  const toggleCategory = (categorySlug: string) => {
    setSelectedCategories(prev =>
      prev.includes(categorySlug)
        ? prev.filter(c => c !== categorySlug)
        : [...prev, categorySlug]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
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
            <span className="text-gray-900 capitalize">{category.replace(/-/g, ' ')}</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">
            {category.replace(/-/g, ' ')}
          </h1>

          {/* Category Description */}
          {categoryDescription && (
            <div
              className="text-gray-700 mb-4 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: categoryDescription }}
            />
          )}

          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="text-gray-600">
              {totalCount} produse găsite
            </p>
            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date-desc">Cele mai noi</option>
                <option value="date-asc">Cele mai vechi</option>
                <option value="price-asc">Preț: Crescător</option>
                <option value="price-desc">Preț: Descrescător</option>
                <option value="discount-desc">Discount: Mare → Mic</option>
                <option value="discount-asc">Discount: Mic → Mare</option>
                <option value="title-asc">Alfabetic: A → Z</option>
                <option value="title-desc">Alfabetic: Z → A</option>
              </select>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {showFilters ? 'Ascunde Filtre' : 'Arată Filtre'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Filtre</h2>
                <button
                  onClick={resetFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Resetează
                </button>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Preț (RON)</h3>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Brand Filter */}
              {availableBrands.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Brand</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {availableBrands.map(brand => (
                      <label key={brand} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Merchant Filter */}
              {availableMerchants.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Magazin</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {availableMerchants.map(merchant => (
                      <label key={merchant.id} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedMerchants.includes(merchant.id.toString())}
                          onChange={() => toggleMerchant(merchant.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{merchant.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Filter */}
              {availableCategories.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Categorie</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {availableCategories.map(cat => (
                      <label key={cat} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat)}
                          onChange={() => toggleCategory(cat)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{cat.replace(/-/g, ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Apply Filters Button */}
              <button
                onClick={applyFilters}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
              >
                Aplică Filtre
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Se încarcă produsele...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Nu s-au găsit produse cu filtrele selectate.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    {/* Previous Button */}
                    {currentPage > 1 && (
                      <Link
                        href={`/c/${category}?page=${currentPage - 1}&sort=${sortBy}`}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
                      >
                        ← Anterioare
                      </Link>
                    )}

                    {/* Page Numbers */}
                    <div className="flex gap-2">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <Link
                            key={pageNum}
                            href={`/c/${category}?page=${pageNum}&sort=${sortBy}`}
                            className={`px-4 py-2 rounded-md ${
                              pageNum === currentPage
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
                            }`}
                          >
                            {pageNum}
                          </Link>
                        );
                      })}
                    </div>

                    {/* Next Button */}
                    {currentPage < totalPages && (
                      <Link
                        href={`/c/${category}?page=${currentPage + 1}&sort=${sortBy}`}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
                      >
                        Următoare →
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* SEO Content Section - Displayed after products */}
        {categorySeoContent && (
          <div className="mt-12 bg-white rounded-lg shadow-md p-6">
            <div
              className="prose prose-lg max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: categorySeoContent }}
            />
          </div>
        )}
      </main>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const affiliateLink = `${product.affiliate_code}${encodeURIComponent(product.product_url)}`;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
      {/* Product Image - Clickable */}
      <Link href={`/p/${product.category_ids[0]}/${product.slug}`}>
        <div className="relative h-64 bg-gray-100 cursor-pointer group">
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
        <Link href={`/p/${product.category_ids[0]}/${product.slug}`}>
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
            href={`/p/${product.category_ids[0]}/${product.slug}`}
            className="w-full block bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2 px-4 rounded-md transition-colors text-center"
          >
            Vezi Detalii
          </Link>
        </div>
      </div>
    </div>
  );
}
