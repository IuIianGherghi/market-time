import Script from "next/script";
import { Metadata } from "next";
import { getProductsByCategory, getCategoryBySlug } from "@/lib/api";
import { generateProductListSchema, generateBreadcrumbSchema } from "@/lib/seo";
import CategoryClient from "./CategoryClient";

interface CategoryPageProps {
  params: {
    category: string;
  };
}

// Generate dynamic metadata for SEO from WordPress category data
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  try {
    // Fetch category with SEO data from WordPress
    const category = await getCategoryBySlug(params.category);
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://market-time.ro';

    // Use SEO fields if available, fallback to auto-generated
    const title = category.seo?.seo_title || `${category.name} - Compară Prețuri`;
    const description = category.seo?.seo_meta_description || category.description || `Descoperă produse din categoria ${category.name}. Compară prețuri și găsește cele mai bune oferte.`;
    const keywords = category.seo?.seo_meta_keywords || `${category.name}, preturi ${category.name.toLowerCase()}, oferte ${category.name.toLowerCase()}`;

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/c/${params.category}`,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
      alternates: {
        canonical: `${SITE_URL}/c/${params.category}`,
      },
    };
  } catch (error) {
    console.error('Error fetching category metadata:', error);
    // Fallback metadata
    return {
      title: `${params.category.replace(/-/g, ' ')} - Compară Prețuri`,
      description: `Descoperă produse și compară prețuri în categoria ${params.category.replace(/-/g, ' ')}.`,
    };
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Fetch category data and initial products on server side for SEO
  const [category, response] = await Promise.all([
    getCategoryBySlug(params.category),
    getProductsByCategory(params.category, {
      page: 1,
      per_page: 20,
      orderby: 'date',
      order: 'desc',
    }),
  ]);

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://market-time.ro';
  const productListSchema = response.data.length > 0 ? generateProductListSchema(response.data, params.category) : null;
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Acasă', url: SITE_URL },
    { name: category.name, url: `${SITE_URL}/c/${params.category}` },
  ]);

  return (
    <>
      {/* Structured Data - JSON-LD */}
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        strategy="beforeInteractive"
      />
      {productListSchema && (
        <Script
          id="product-list-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productListSchema) }}
          strategy="beforeInteractive"
        />
      )}

      <CategoryClient
        initialProducts={response.data}
        initialTotalCount={response.pagination.total_count}
        initialTotalPages={response.pagination.total_pages}
        category={params.category}
        categoryDescription={category.seo?.description || category.description}
        categorySeoContent={category.seo?.seo_content}
      />
    </>
  );
}
