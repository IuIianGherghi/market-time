import Link from "next/link";
import { Metadata } from "next";
import { getMerchants } from "@/lib/api";

export const metadata: Metadata = {
  title: "Magazine Partenere - Market-Time.ro",
  description: "Explorează toate magazinele partenere pe Market-Time.ro. Descoperă ofertele de la magazinele tale preferate.",
  keywords: ["magazine online", "parteneri", "merchant", "magazine partenere"],
};

export default async function MerchantsPage() {
  const merchants = await getMerchants();

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
            <span className="text-gray-900">Magazine</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Magazine Partenere</h1>
          <p className="text-gray-600">
            Descoperă toate magazinele partenere și explorează ofertele lor.
          </p>
        </div>

        {/* Merchants Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {merchants.map((merchant) => (
            <Link
              key={merchant.id}
              href={`/magazin/${merchant.slug}`}
              className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 group"
            >
              <div className="flex flex-col h-full">
                {/* Merchant Icon */}
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>

                {/* Merchant Name */}
                <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                  {merchant.name}
                </h2>

                {/* Merchant Description */}
                {merchant.description && (
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-grow">
                    {merchant.description.replace(/<[^>]*>/g, '')}
                  </p>
                )}

                {/* Product Count */}
                {merchant.count > 0 && (
                  <div className="text-sm text-gray-500 mt-auto">
                    {merchant.count} {merchant.count === 1 ? 'produs' : 'produse'}
                  </div>
                )}

                {/* View Link */}
                <div className="mt-4 text-green-600 font-medium text-sm group-hover:text-green-700">
                  Vezi produse →
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {merchants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Nu există magazine partenere momentan.</p>
          </div>
        )}
      </main>
    </div>
  );
}
