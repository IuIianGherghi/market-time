import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termeni și Condiții - Market-Time.ro",
  description: "Termenii și condițiile de utilizare a platformei Market-Time.ro - Comparator de prețuri online",
  robots: "index, follow",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
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
            <span className="text-gray-900">Termeni și Condiții</span>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Termeni și Condiții
          </h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-sm text-gray-500 mb-6">
              Data ultimei actualizări: {new Date().toLocaleDateString('ro-RO')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introducere</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Bine ați venit pe Market-Time.ro! Acești Termeni și Condiții reglementează utilizarea platformei noastre de comparare a prețurilor.
                Prin accesarea și utilizarea acestui site, acceptați în totalitate acești termeni.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Descrierea Serviciului</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Market-Time.ro este o platformă de comparare a prețurilor care agregă informații despre produse din diverse magazine online.
                Furnizăm informații despre preț, disponibilitate și caracteristici pentru a vă ajuta să luați decizii informate de cumpărare.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Important:</strong> Market-Time.ro nu vinde produse direct. Suntem un serviciu de comparare care vă redirecționează către
                magazinele partenere pentru finalizarea achizițiilor.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Utilizarea Platformei</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Condiții de utilizare</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Trebuie să aveți minimum 18 ani pentru a utiliza acest serviciu</li>
                <li>Vă angajați să furnizați informații corecte și actuale</li>
                <li>Nu veți utiliza platforma în scopuri ilegale sau neautorizate</li>
                <li>Nu veți încerca să perturbați funcționarea normală a site-ului</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Linkuri afiliate</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Anumite linkuri către magazine partenere pot conține coduri afiliate. Când achiziționați produse prin aceste linkuri,
                putem primi o comision de la magazin, fără costuri suplimentare pentru dvs.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Prețuri și Disponibilitate</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Prețurile și disponibilitatea produselor afișate pe Market-Time.ro sunt furnizate de magazinele partenere și pot varia.
                Ne străduim să menținem informațiile actualizate, dar nu putem garanta acuratețea 100% în timp real.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Prețul final, costurile de livrare, și disponibilitatea vor fi confirmate de magazinul partener în momentul plasării comenzii.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Limitări de Răspundere</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Market-Time.ro nu este responsabil pentru:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Tranzacțiile finalizate cu magazinele partenere</li>
                <li>Calitatea, siguranța sau legalitatea produselor vândute</li>
                <li>Capacitatea magazinelor de a livra produsele</li>
                <li>Erorile în descrierile produselor furnizate de terți</li>
                <li>Modificările de preț după redirecționare</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Proprietate Intelectuală</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Conținutul platformei Market-Time.ro, inclusiv dar fără a se limita la design, logo, text, grafică și software,
                este proprietatea noastră sau a furnizorilor noștri de conținut și este protejat de legile drepturilor de autor.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Modificări ale Termenilor</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Ne rezervăm dreptul de a modifica acești Termeni și Condiții în orice moment. Modificările vor fi publicate pe această pagină
                cu o dată de actualizare revizuită. Utilizarea continuă a platformei după astfel de modificări constituie acceptarea noilor termeni.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Contact</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Pentru întrebări referitoare la acești Termeni și Condiții, vă rugăm să ne contactați la:
              </p>
              <p className="text-gray-700 leading-relaxed">
                Email: <a href="mailto:contact@market-time.ro" className="text-blue-600 hover:underline">contact@market-time.ro</a>
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
