/**
 * Market-Time API Client
 *
 * Centralized API communication layer for WordPress REST API
 */

import type {
  Product,
  ProductsResponse,
  Category,
  CategoriesResponse,
  Brand,
  BrandsResponse,
  Merchant,
  MerchantsResponse,
  ProductsQueryParams,
  APIError,
} from '@/types/product';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.market-time.ro/wp-json/market-time/v1';
const WP_API_URL = process.env.NEXT_PUBLIC_WP_API_URL || 'https://api.market-time.ro/wp-json';
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000', 10);

/**
 * Generic fetch wrapper with error handling and timeout
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(endpoint, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error: APIError = await response.json();
      throw new Error(error.message || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - server took too long to respond');
      }
      throw error;
    }

    throw new Error('Unknown error occurred');
  }
}

/**
 * Build query string from params object
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Get products with optional filtering, sorting, and pagination
 */
export async function getProducts(
  params: ProductsQueryParams = {}
): Promise<ProductsResponse> {
  const queryString = buildQueryString(params);

  return apiFetch<ProductsResponse>(`${API_URL}/products${queryString}`, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });
}

/**
 * Get single product by ID
 */
export async function getProduct(id: number): Promise<Product> {
  return apiFetch<Product>(`${API_URL}/products/${id}`, {
    next: { revalidate: 3600 },
  });
}

/**
 * Get single product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product> {
  const response = await apiFetch<ProductsResponse>(`${API_URL}/products?slug=${slug}&per_page=1`, {
    next: { revalidate: 3600 },
  });

  if (!response.data || response.data.length === 0) {
    throw new Error(`Product with slug "${slug}" not found`);
  }

  return response.data[0];
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<CategoriesResponse> {
  return apiFetch<CategoriesResponse>(`${WP_API_URL}/wp/v2/product_category?per_page=100`, {
    next: { revalidate: 7200 }, // Cache for 2 hours (categories change rarely)
  });
}

/**
 * Get a single category by slug with SEO data
 */
export async function getCategoryBySlug(slug: string): Promise<Category> {
  const categories = await apiFetch<Category[]>(`${WP_API_URL}/wp/v2/product_category?slug=${slug}`, {
    next: { revalidate: 3600 },
  });

  if (!categories || categories.length === 0) {
    throw new Error(`Category "${slug}" not found`);
  }

  return categories[0];
}

/**
 * Get all brands
 */
export async function getBrands(): Promise<BrandsResponse> {
  return apiFetch<BrandsResponse>(`${WP_API_URL}/wp/v2/product_brand?per_page=100`, {
    next: { revalidate: 7200 },
  });
}

/**
 * Get a single brand by slug with SEO data
 */
export async function getBrandBySlug(slug: string): Promise<Brand> {
  const brands = await apiFetch<Brand[]>(`${WP_API_URL}/wp/v2/product_brand?slug=${slug}`, {
    next: { revalidate: 3600 },
  });

  if (!brands || brands.length === 0) {
    throw new Error(`Brand "${slug}" not found`);
  }

  return brands[0];
}

/**
 * Get all merchants (stores)
 */
export async function getMerchants(): Promise<MerchantsResponse> {
  return apiFetch<MerchantsResponse>(`${WP_API_URL}/wp/v2/merchant?per_page=100`, {
    next: { revalidate: 7200 },
  });
}

/**
 * Get a single merchant by slug with SEO data
 */
export async function getMerchantBySlug(slug: string): Promise<Merchant> {
  const merchants = await apiFetch<Merchant[]>(`${WP_API_URL}/wp/v2/merchant?slug=${slug}`, {
    next: { revalidate: 3600 },
  });

  if (!merchants || merchants.length === 0) {
    throw new Error(`Merchant "${slug}" not found`);
  }

  return merchants[0];
}

/**
 * Search products by query string
 */
export async function searchProducts(
  query: string,
  params: Omit<ProductsQueryParams, 'search'> = {}
): Promise<ProductsResponse> {
  return getProducts({
    ...params,
    search: query,
  });
}

/**
 * Get products by category slug
 */
export async function getProductsByCategory(
  categorySlug: string,
  params: Omit<ProductsQueryParams, 'category'> = {}
): Promise<ProductsResponse> {
  return getProducts({
    ...params,
    category: categorySlug,
  });
}

/**
 * Get products by brand slug
 */
export async function getProductsByBrand(
  brandSlug: string,
  params: Omit<ProductsQueryParams, 'brand'> = {}
): Promise<ProductsResponse> {
  return getProducts({
    ...params,
    brand: brandSlug,
  });
}

/**
 * Get products by merchant slug
 */
export async function getProductsByMerchant(
  merchantSlug: string,
  params: Omit<ProductsQueryParams, 'merchant'> = {}
): Promise<ProductsResponse> {
  return getProducts({
    ...params,
    merchant: merchantSlug,
  });
}

/**
 * Get products on sale only
 */
export async function getOnSaleProducts(
  params: Omit<ProductsQueryParams, 'on_sale'> = {}
): Promise<ProductsResponse> {
  return getProducts({
    ...params,
    on_sale: true,
  });
}

/**
 * Get top deals (highest discount products)
 */
export async function getTopDeals(limit: number = 10): Promise<ProductsResponse> {
  return getProducts({
    orderby: 'discount',
    order: 'desc',
    per_page: limit,
  });
}

/**
 * Get latest products
 */
export async function getLatestProducts(limit: number = 10): Promise<ProductsResponse> {
  return getProducts({
    orderby: 'date',
    order: 'desc',
    per_page: limit,
  });
}

/**
 * Get all available filter options (categories, brands, merchants)
 */
export async function getFilterOptions(): Promise<{
  categories: Array<{id: number; slug: string; name: string; count: number}>;
  brands: Array<{id: number; slug: string; name: string; count: number}>;
  merchants: Array<{id: number; slug: string; name: string; count: number}>;
}> {
  return apiFetch(`${API_URL}/filters`, {
    next: { revalidate: 1800 }, // Cache for 30 minutes
  });
}
