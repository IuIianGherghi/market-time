import Script from "next/script";
import { Metadata } from "next";
import { getProductsByMerchant, getMerchantBySlug } from "@/lib/api";
import { generateProductListSchema, generateBreadcrumbSchema } from "@/lib/seo";
import MerchantClient from "./MerchantClient";

interface MerchantPageProps {
  params: {
    merchant: string;
  };
}

// Generate dynamic metadata for SEO from WordPress merchant data
export async function generateMetadata({ params }: MerchantPageProps): Promise<Metadata> {
  try {
    // Fetch merchant with SEO data from WordPress
    const merchant = await getMerchantBySlug(params.merchant);
    const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://market-time.ro';

    // Use SEO fields if available, fallback to auto-generated
    const title = merchant.seo?.seo_title || `${merchant.name} - Produse și Oferte`;
    const description = merchant.seo?.seo_meta_description || merchant.description || `Descoperă produse de la ${merchant.name}. Compară prețuri și găsește cele mai bune oferte de la ${merchant.name}.`;
    const keywords = merchant.seo?.seo_meta_keywords || `${merchant.name}, ${merchant.name.toLowerCase()} romania, oferte ${merchant.name.toLowerCase()}`;

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/magazin/${params.merchant}`,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
      alternates: {
        canonical: `${SITE_URL}/magazin/${params.merchant}`,
      },
    };
  } catch (error) {
    console.error('Error fetching merchant metadata:', error);
    // Fallback metadata
    return {
      title: `${params.merchant.replace(/-/g, ' ')} - Produse și Oferte`,
      description: `Descoperă produse și compară prețuri de la ${params.merchant.replace(/-/g, ' ')}.`,
    };
  }
}

export default async function MerchantPage({ params }: MerchantPageProps) {
  // Fetch merchant data and initial products on server side for SEO
  const [merchant, response] = await Promise.all([
    getMerchantBySlug(params.merchant),
    getProductsByMerchant(params.merchant, {
      page: 1,
      per_page: 20,
      orderby: 'date',
      order: 'desc',
    }),
  ]);

  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://market-time.ro';
  const productListSchema = response.data.length > 0 ? generateProductListSchema(response.data, params.merchant) : null;
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Acasă', url: SITE_URL },
    { name: merchant.name, url: `${SITE_URL}/magazin/${params.merchant}` },
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

      <MerchantClient
        initialProducts={response.data}
        initialTotalCount={response.pagination.total_count}
        initialTotalPages={response.pagination.total_pages}
        merchant={params.merchant}
        merchantName={merchant.name}
        merchantDescription={merchant.seo?.description || merchant.description}
        merchantSeoContent={merchant.seo?.seo_content}
      />
    </>
  );
}
