import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./styles/category-description.css";
import Footer from "./components/Footer";
import GoogleTagManager from "./components/GoogleTagManager";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://market-time.ro'),
  title: {
    default: 'Market-Time.ro - Compară Prețuri Online',
    template: '%s | Market-Time.ro',
  },
  description: 'Compară prețurile la mii de produse din magazine online. Găsește cele mai bune oferte la fashion, electronice, casă și grădină.',
  keywords: ['comparator preturi', 'oferte online', 'reduceri', 'produse ieftine', 'shopping online romania'],
  authors: [{ name: 'Market-Time.ro' }],
  creator: 'Market-Time.ro',
  publisher: 'Market-Time.ro',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ro_RO',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://market-time.ro',
    siteName: 'Market-Time.ro',
    title: 'Market-Time.ro - Compară Prețuri Online',
    description: 'Compară prețurile la mii de produse din magazine online. Găsește cele mai bune oferte la fashion, electronice, casă și grădină.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Market-Time.ro - Compară Prețuri Online',
    description: 'Compară prețurile la mii de produse din magazine online.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <GoogleTagManager gtmId="GTM-K2MSZJRR" />
        <div className="flex-grow">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
