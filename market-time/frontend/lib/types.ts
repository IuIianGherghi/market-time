/**
 * TypeScript Types for Market-Time API
 * TASK 43
 */

export interface Product {
  id: number;
  title: string;
  price: number;
  merchant: {
    id: number;
    name: string;
  };
  image_url: string;
  product_url: string;
  category_ids: number[];
  last_updated: string;
  description_full?: string;
  seo?: {
    title: string;
    description: string;
    canonical: string;
  };
}

export interface ApiResponse<T> {
  data: T;
  pagination?: {
    page: number;
    per_page: number;
    total_count: number;
    total_pages: number;
  };
}

export interface Merchant {
  id: number;
  name: string;
  product_count: number;
  avg_price: number;
  min_price: number;
  max_price: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface ProductsQueryParams {
  page?: number;
  per_page?: number;
  merchant_id?: number;
  min_price?: number;
  max_price?: number;
  orderby?: 'price' | 'date' | 'title';
  order?: 'ASC' | 'DESC';
}
