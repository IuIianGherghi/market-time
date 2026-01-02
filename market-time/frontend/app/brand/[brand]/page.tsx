import Script from "next/script";
import { Metadata } from "next";
import { getProductsByBrand, getBrandBySlug } from "@/lib/api";
import { generateProductListSchema, generateBreadcrumbSchema } from "@/lib/seo";
import BrandClient from "./BrandClient";

interface BrandPageProps {
  params: {
    brand: string;
  };
}

// Generate dynamic metadata for SEO from WordPress brand data
export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  try {
    // Fetch brand with SEO data from WordPress
    const brand = await getBrandBySlug(params.brand);
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://market-time.ro';

    // Use SEO fields if available, fallback to auto-generated
    const title = brand.seo?.seo_title || `${brand.name} - Produse și Prețuri`;
    const description = brand.seo?.seo_meta_description || brand.description || `Descoperă produse ${brand.name}. Compară prețuri și găsește cele mai bune oferte pentru ${brand.name}.`;
    const keywords = brand.seo?.seo_meta_keywords || `${brand.name}, preturi ${brand.name.toLowerCase()}, oferte ${brand.name.toLowerCase()}`;

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/brand/${params.brand}`,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
      alternates: {
        canonical: `${SITE_URL}/brand/${params.brand}`,
      },
    };
  } catch (error) {
    console.error('Error fetching brand metadata:', error);
    // Fallback metadata
    return {
      title: `${params.brand.replace(/-/g, ' ')} - Produse și Prețuri`,
      description: `Descoperă produse și compară prețuri pentru ${params.brand.replace(/-/g, ' ')}.`,
    };
  }
}

export default async function BrandPage({ params }: BrandPageProps) {
  // Fetch brand data and initial products on server side for SEO
  const [brand, response] = await Promise.all([
    getBrandBySlug(params.brand),
    getProductsByBrand(params.brand, {
      page: 1,
      per_page: 20,
      orderby: 'date',
      order: 'desc',
    }),
  ]);

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://market-time.ro';
  const productListSchema = response.data.length > 0 ? generateProductListSchema(response.data, params.brand) : null;
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Acasă', url: SITE_URL },
    { name: brand.name, url: `${SITE_URL}/brand/${params.brand}` },
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

      <BrandClient
        initialProducts={response.data}
        initialTotalCount={response.pagination.total_count}
        initialTotalPages={response.pagination.total_pages}
        brand={params.brand}
        brandName={brand.name}
        brandDescription={brand.seo?.description || brand.description}
        brandSeoContent={brand.seo?.seo_content}
      />
    </>
  );
}
