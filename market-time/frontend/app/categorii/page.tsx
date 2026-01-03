import Link from "next/link";
import { Metadata } from "next";
import { getCategories } from "@/lib/api";

export const metadata: Metadata = {
  title: "Categorii Produse - Market-Time.ro",
  description: "Explorează toate categoriile de produse disponibile pe Market-Time.ro. Găsește produse din îmbrăcăminte, electronice, casă și grădină și multe altele.",
  keywords: ["categorii produse", "categorii market-time", "liste categorii", "tipuri produse"],
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  // Group categories by parent if needed (for now, show all flat)
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
            <span className="text-gray-900">Categorii</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Categorii de Produse</h1>
          <p className="text-gray-600">
            Explorează toate categoriile noastre și găsește produsele potrivite pentru tine.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/c/${category.slug}`}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 group"
            >
              <div className="flex flex-col h-full">
                {/* Category Icon/Image placeholder */}
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>

                {/* Category Name */}
                <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h2>

                {/* Category Description */}
                {category.description && (
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow">
                    {category.description.replace(/<[^>]*>/g, '')}
                  </p>
                )}

                {/* Product Count */}
                {category.count > 0 && (
                  <div className="text-sm text-gray-500 mt-auto">
                    {category.count} {category.count === 1 ? 'produs' : 'produse'}
                  </div>
                )}

                {/* View Link */}
                <div className="mt-4 text-blue-600 font-medium text-sm group-hover:text-blue-700">
                  Vezi produse →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Nu există categorii disponibile momentan.</p>
          </div>
        )}
      </main>
    </div>
  );
}
