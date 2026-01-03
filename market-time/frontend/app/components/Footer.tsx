import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Market-Time.ro</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Compară prețurile la mii de produse din magazinele online și găsește cele mai bune oferte.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Navigare Rapidă</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Acasă
                </Link>
              </li>
              <li>
                <Link href="/produse" className="hover:text-white transition-colors">
                  Toate Produsele
                </Link>
              </li>
              <li>
                <Link href="/categorii" className="hover:text-white transition-colors">
                  Categorii
                </Link>
              </li>
              <li>
                <Link href="/branduri" className="hover:text-white transition-colors">
                  Branduri
                </Link>
              </li>
              <li>
                <Link href="/magazine" className="hover:text-white transition-colors">
                  Magazine
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Informații Legale</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/pg/termeni-si-conditii" className="hover:text-white transition-colors">
                  Termeni și Condiții
                </Link>
              </li>
              <li>
                <Link href="/pg/politica-de-confidentialitate" className="hover:text-white transition-colors">
                  Politica de Confidențialitate
                </Link>
              </li>
              <li>
                <Link href="/pg/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:contact@market-time.ro" className="hover:text-white transition-colors">
                  contact@market-time.ro
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center text-gray-400">
          <p>
            © {currentYear} Market-Time.ro. Toate drepturile rezervate.
          </p>
          <p className="mt-2 text-xs">
            Market-Time.ro este o platformă de comparare a prețurilor. Nu vindem produse direct.
          </p>
        </div>
      </div>
    </footer>
  );
}
