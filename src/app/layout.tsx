import type { Metadata } from "next";
import { Bebas_Neue, Roboto_Condensed, Teko } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import ClientLayout from "@/components/ClientLayout";


const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas"
});

const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  variable: "--font-roboto"
});

const teko = Teko({
  subsets: ["latin"],
  variable: "--font-teko"
});

export const metadata: Metadata = {
  title: "Fener Ajans",
  description: "Hayalinizdeki Fenerbahçe kadrosunu oluşturun.",
  icons: {
    icon: '/bull-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${bebasNeue.variable} ${robotoCondensed.variable} ${teko.variable}`}>
      <body className={robotoCondensed.className}>
        <ClientLayout>
          <div className="min-h-screen flex flex-col relative">
            <header className="bg-fb-navy/95 backdrop-blur-sm text-white shadow-lg relative z-10 border-b border-white/5">
              <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2 md:gap-3 hover:opacity-90 transition-opacity group">
                  {/* Logo */}
                  <div className="relative h-8 md:h-10 w-auto">
                    <img
                      src="/bull-icon.png"
                      alt="Fener Ajans"
                      className="h-full w-auto object-contain"
                    />
                  </div>
                  {/* Text Label - Hidden on very small screens if needed, but user said "if needed" */}
                  <span className="text-white font-bold text-sm md:text-lg tracking-wide hidden sm:block font-bebas pt-1">
                    FENER AJANS
                  </span>
                </Link>

                <nav className="hidden md:flex space-x-6 items-center">
                  <Link href="/kadro-olusturucu" className="hover:text-fb-yellow transition-colors font-bold tracking-wide">KADRO OLUŞTUR</Link>
                </nav>
              </div>
            </header>
            <main className="flex-grow relative z-10">
              {children}
            </main>
            <footer className="bg-fb-navy/95 backdrop-blur-sm text-white py-6 mt-auto relative z-10 border-t border-white/5">
              <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
                  <img
                    src="/bull-icon.png"
                    alt="Fener Ajans"
                    className="h-6 w-auto object-contain"
                  />
                  <span className="text-xs text-white/80">© 2025 Fener Ajans – Tüm hakları saklıdır.</span>
                </div>


              </div>
            </footer>
          </div>
        </ClientLayout>
      </body>
    </html>
  );
}
