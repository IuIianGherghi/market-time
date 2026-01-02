import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://market-time.ro';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/produse`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // TODO: Dynamic pages - fetch from API
  // You can add categories and products dynamically here by fetching from your API
  // Example:
  // const categories = await fetch(`${API_URL}/categories`).then(r => r.json());
  // const categoryPages = categories.map(cat => ({
  //   url: `${SITE_URL}/c/${cat.slug}`,
  //   lastModified: new Date(),
  //   changeFrequency: 'daily' as const,
  //   priority: 0.8,
  // }));

  return staticPages;
}
