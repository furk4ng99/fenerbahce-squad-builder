import type { Metadata } from "next";
import { Bebas_Neue, Roboto_Condensed, Teko } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import SiteChrome from "@/components/SiteChrome";

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
  metadataBase: new URL('https://fenerajans.com'),
  title: {
    default: "Fener Ajans | Oyun ve Taktik Stüdyosu",
    template: "%s | Fener Ajans",
  },
  description: "Kadro kurun, oyun planınızı şekillendirin ve Fenerbahçe efsanelerini karşılaştırın.",
  icons: {
    icon: '/bull-icon.png',
  },
  openGraph: {
    title: "Fener Ajans | Oyun ve Taktik Stüdyosu",
    description: "Futbol fikirlerini sahaya taşıyan modern kadro ve taktik deneyimi.",
    images: [
      {
        url: "/og.png",
        width: 1731,
        height: 909,
        alt: "Fener Ajans — Kadro değil, oyun fikri kur.",
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Fener Ajans | Oyun ve Taktik Stüdyosu",
    description: "Futbol fikirlerini sahaya taşıyan modern kadro ve taktik deneyimi.",
    images: ["/og.png"],
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
        <SiteChrome>{children}</SiteChrome>
        <Analytics />
      </body>
    </html>
  );
}
