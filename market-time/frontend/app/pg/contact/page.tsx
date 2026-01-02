import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - Market-Time.ro",
  description: "Contactați echipa Market-Time.ro pentru întrebări, sugestii sau suport",
  robots: "index, follow",
};

export default function ContactPage() {
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
            <span className="text-gray-900">Contact</span>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Contactați-ne
          </h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed mb-8">
              Suntem aici să vă ajutăm! Dacă aveți întrebări, sugestii sau aveți nevoie de asistență,
              nu ezitați să ne contactați folosind informațiile de mai jos.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Email Section */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-blue-600 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
                    <p className="text-gray-700 mb-1">Suport general:</p>
                    <a href="mailto:contact@market-time.ro" className="text-blue-600 hover:underline block mb-3">
                      contact@market-time.ro
                    </a>
                    <p className="text-gray-700 mb-1">GDPR & Confidențialitate:</p>
                    <a href="mailto:gdpr@market-time.ro" className="text-blue-600 hover:underline block">
                      gdpr@market-time.ro
                    </a>
                  </div>
                </div>
              </div>

              {/* Response Time */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-start">
                  <svg className="w-6 h-6 text-blue-600 mt-1 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Timp de Răspuns</h3>
                    <p className="text-gray-700">
                      Echipa noastră vă va răspunde în termen de <strong>24-48 ore</strong> în zilele lucrătoare.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Întrebări Frecvente</h2>

              <div className="space-y-6">
                <div className="border-l-4 border-blue-600 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Cum funcționează Market-Time.ro?
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Market-Time.ro este o platformă de comparare a prețurilor. Agregăm informații despre produse
                    din diverse magazine online și vă oferim posibilitatea de a compara prețurile pentru a găsi
                    cea mai bună ofertă. Nu vindem produse direct - vă redirecționăm către magazinele partenere.
                  </p>
                </div>

                <div className="border-l-4 border-blue-600 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Cum pot raporta un preț incorect?
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Dacă observați discrepanțe între prețul afișat pe platforma noastră și cel din magazinul partener,
                    vă rugăm să ne contactați la <a href="mailto:contact@market-time.ro" className="text-blue-600 hover:underline">contact@market-time.ro</a>
                    {' '}cu detalii despre produs și magazin. Vom verifica și actualiza informațiile cât mai curând posibil.
                  </p>
                </div>

                <div className="border-l-4 border-blue-600 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Pot adăuga magazinul meu pe platformă?
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Da! Dacă dețineți un magazin online și doriți să fiți inclus în listările noastre,
                    vă rugăm să ne contactați la <a href="mailto:contact@market-time.ro" className="text-blue-600 hover:underline">contact@market-time.ro</a>
                    {' '}cu detalii despre magazin și vom discuta oportunitățile de parteneriat.
                  </p>
                </div>

                <div className="border-l-4 border-blue-600 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Cum pot solicita ștergerea datelor mele personale?
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Conform GDPR, aveți dreptul să solicitați ștergerea datelor personale. Trimiteți o solicitare
                    la <a href="mailto:gdpr@market-time.ro" className="text-blue-600 hover:underline">gdpr@market-time.ro</a>
                    {' '}și vom procesa cererea dvs. în termen de 30 zile.
                  </p>
                </div>

                <div className="border-l-4 border-blue-600 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Market-Time.ro percepe comisioane?
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Serviciul nostru este gratuit pentru utilizatori. Putem primi comisioane de afiliere de la
                    magazinele partenere atunci când efectuați o achiziție prin linkurile noastre, fără costuri
                    suplimentare pentru dvs.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Sugestii și Feedback</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Apreciem feedback-ul dvs.! Dacă aveți sugestii pentru îmbunătățirea platformei sau
                doriți să raportați probleme tehnice, vă rugăm să ne scrieți.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Echipa noastră analizează toate sugestiile primite și le ia în considerare pentru
                dezvoltările viitoare ale platformei.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
