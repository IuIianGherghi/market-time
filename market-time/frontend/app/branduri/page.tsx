import Link from "next/link";
import { Metadata } from "next";
import { getBrands } from "@/lib/api";

export const metadata: Metadata = {
  title: "Branduri Produse - Market-Time.ro",
  description: "Explorează toate brandurile disponibile pe Market-Time.ro. Găsește produse de la brandurile tale preferate.",
  keywords: ["branduri", "marci produse", "brand-uri populare", "producatori"],
};

export default async function BrandsPage() {
  const brands = await getBrands();

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
            <span className="text-gray-900">Branduri</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Branduri</h1>
          <p className="text-gray-600">
            Explorează toate brandurile disponibile și găsește produsele preferate.
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brand/${brand.slug}`}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-4 group text-center"
            >
              <div className="flex flex-col items-center h-full">
                {/* Brand Icon */}
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-200 transition-colors">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                    />
                  </svg>
                </div>

                {/* Brand Name */}
                <h2 className="text-sm font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                  {brand.name}
                </h2>

                {/* Product Count */}
                {brand.count > 0 && (
                  <div className="text-xs text-gray-500 mt-auto">
                    {brand.count} {brand.count === 1 ? 'produs' : 'produse'}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {brands.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Nu există branduri disponibile momentan.</p>
          </div>
        )}
      </main>
    </div>
  );
}
