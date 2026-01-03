/**
 * Market-Time Product Types
 *
 * TypeScript definitions for API responses from WordPress backend
 */

export interface Product {
  id: number;
  slug?: string;
  sku: string;
  title: string;
  price: number;
  price_regular: number | null;
  discount_percentage: number;
  on_sale: boolean;
  merchant: {
    id: number;
    name: string;
  };
  brand: string | null;
  vendor: string;
  image_url: string;
  gallery_images: string[];
  product_url: string;
  affiliate_code: string;
  short_description: string;
  category_ids: string[];
  last_updated: string;
}

export interface ProductsResponse {
  data: Product[];
  pagination: {
    page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
  };
}

export interface CategorySEO {
  seo_title: string;
  seo_meta_description: string;
  seo_meta_keywords: string;
  seo_content: string;
  description: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  count: number;
  parent?: number;
  seo?: CategorySEO;
}

export type CategoriesResponse = Category[];

export interface BrandSEO {
  seo_title: string;
  seo_meta_description: string;
  seo_meta_keywords: string;
  seo_content: string;
  description: string;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  count: number;
  description?: string;
  seo?: BrandSEO;
}

export type BrandsResponse = Brand[];

export interface MerchantSEO {
  merchant_id: number;
  seo_title: string;
  seo_meta_description: string;
  seo_meta_keywords: string;
  seo_content: string;
  description: string;
}

export interface Merchant {
  id: number;
  name: string;
  slug: string;
  count: number;
  description?: string;
  seo?: MerchantSEO;
}

export type MerchantsResponse = Merchant[];

// API Query Parameters
export interface ProductsQueryParams {
  page?: number;
  per_page?: number;
  category?: string;
  brand?: string;
  merchant_id?: string; // Merchant ID or comma-separated list of merchant IDs
  min_price?: number;
  max_price?: number;
  min_discount?: number;
  on_sale?: boolean;
  orderby?: 'price' | 'discount' | 'date' | 'title';
  order?: 'asc' | 'desc';
  search?: string;
}

// API Error Response
export interface APIError {
  code: string;
  message: string;
  data?: {
    status: number;
  };
}
