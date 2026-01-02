import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica de Confidențialitate - Market-Time.ro",
  description: "Politica de confidențialitate și protecția datelor personale pe Market-Time.ro",
  robots: "index, follow",
};

export default function PrivacyPage() {
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
            <span className="text-gray-900">Politica de Confidențialitate</span>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Politica de Confidențialitate
          </h1>

          <div className="prose prose-gray max-w-none">
            <p className="text-sm text-gray-500 mb-6">
              Data ultimei actualizări: {new Date().toLocaleDateString('ro-RO')}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Introducere</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Market-Time.ro respectă confidențialitatea utilizatorilor săi. Această Politică de Confidențialitate explică
                ce date personale colectăm, cum le utilizăm, și drepturile dvs. în legătură cu aceste date.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Această politică este conformă cu Regulamentul General privind Protecția Datelor (GDPR) și legislația românească aplicabilă.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Date Colectate</h2>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.1 Date furnizate direct</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                În prezent, Market-Time.ro nu solicită înregistrarea utilizatorilor. Dacă ne contactați prin email,
                colectăm doar informațiile pe care ni le furnizați voluntar (nume, email, mesaj).
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.2 Date colectate automat</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Cookie-uri de sesiune:</strong> Pentru funcționarea corectă a site-ului</li>
                <li><strong>Adresa IP:</strong> Pentru securitate și analiză trafic</li>
                <li><strong>Tipul de browser și dispozitiv:</strong> Pentru optimizarea experienței</li>
                <li><strong>Pagini vizitate și acțiuni pe site:</strong> Pentru îmbunătățirea serviciilor</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">2.3 Linkuri afiliate</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Când apăsați pe un link către un magazin partener, putem înregistra acel clic pentru a urmări performanța
                parteneriatelor noastre. Acest lucru nu identifică personal utilizatorii.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Utilizarea Datelor</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Folosim datele colectate pentru:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Furnizarea și îmbunătățirea serviciilor noastre</li>
                <li>Personalizarea experienței utilizatorilor</li>
                <li>Analiză statistică și optimizare platformă</li>
                <li>Răspunsuri la solicitări de contact</li>
                <li>Conformare cu obligațiile legale</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Partajarea Datelor</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Nu vindem, închiriem sau partajăm datele dvs. personale cu terțe părți în scopuri de marketing.
                Putem partaja date în următoarele situații:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Furnizori de servicii:</strong> Hosting, analiză trafic (Vercel, Google Analytics)</li>
                <li><strong>Magazine partenere:</strong> Când faceți click pe un link afiliat (fără date personale identificabile)</li>
                <li><strong>Obligații legale:</strong> Când este cerut de autorități competente</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cookie-uri</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Folosim cookie-uri pentru:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Cookie-uri esențiale:</strong> Necesare pentru funcționarea site-ului</li>
                <li><strong>Cookie-uri de performanță:</strong> Analiză trafic și comportament utilizatori</li>
                <li><strong>Cookie-uri de preferințe:</strong> Salvarea setărilor dvs.</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                Puteți gestiona cookie-urile din setările browser-ului dvs.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Securitatea Datelor</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Implementăm măsuri tehnice și organizatorice pentru protejarea datelor dvs., inclusiv:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Criptare SSL/TLS pentru toate comunicările</li>
                <li>Stocare securizată a datelor</li>
                <li>Acces restricționat la date personale</li>
                <li>Monitorizare și actualizare continuă a securității</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Drepturile Dvs. (GDPR)</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Conform GDPR, aveți următoarele drepturi:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Dreptul de acces:</strong> Să solicitați o copie a datelor personale pe care le deținem</li>
                <li><strong>Dreptul la rectificare:</strong> Să corectați datele inexacte</li>
                <li><strong>Dreptul la ștergere:</strong> Să solicitați ștergerea datelor (dreptul de a fi uitat)</li>
                <li><strong>Dreptul la restricționare:</strong> Să limitați prelucrarea datelor</li>
                <li><strong>Dreptul la portabilitate:</strong> Să primiți datele într-un format structurat</li>
                <li><strong>Dreptul la opoziție:</strong> Să vă opuneți prelucrării datelor</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                Pentru exercitarea acestor drepturi, contactați-ne la:
                <a href="mailto:gdpr@market-time.ro" className="text-blue-600 hover:underline ml-1">gdpr@market-time.ro</a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Linkuri către Site-uri Terțe</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Platforma noastră conține linkuri către magazine partenere. Nu suntem responsabili pentru politicile
                de confidențialitate ale acestor site-uri. Vă recomandăm să citiți politicile lor înainte de a furniza date personale.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Modificări ale Politicii</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Ne rezervăm dreptul de a actualiza această Politică de Confidențialitate. Modificările vor fi publicate
                pe această pagină cu data ultimei actualizări.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Contact</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Pentru întrebări despre această Politică de Confidențialitate sau drepturile dvs. GDPR:
              </p>
              <p className="text-gray-700 leading-relaxed">
                Email: <a href="mailto:gdpr@market-time.ro" className="text-blue-600 hover:underline">gdpr@market-time.ro</a><br />
                Contact general: <a href="mailto:contact@market-time.ro" className="text-blue-600 hover:underline">contact@market-time.ro</a>
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
