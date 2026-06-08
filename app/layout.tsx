import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://info.upeducacion-uncp.edu.pe"),
  title: {
    default: "UP Educación | Posgrado Facultad de Educación UNCP",
    template: "%s | UP Educación",
  },
  description: "Unidad de Posgrado de la Facultad de Educación - Universidad Nacional del Centro del Perú. Excelencia académica en maestrías, doctorados y formación continua.",
  keywords: ["Posgrado Educación", "Maestrías UNCP", "Doctorados Educación", "Huancayo", "Educación Superior", "UP Educación"],
  authors: [{ name: "Facultad de Educación - UNCP" }],
  creator: "Facultad de Educación - UNCP",
  publisher: "UNCP",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "https://info.upeducacion-uncp.edu.pe",
    siteName: "UP Educación UNCP",
    title: "UP Educación | Posgrado Facultad de Educación UNCP",
    description: "Formamos líderes en educación con estándares de calidad internacional. Explora nuestras maestrías y doctorados.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "UP Educación - Facultad de Educación UNCP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UP Educación | Posgrado Facultad de Educación UNCP",
    description: "Excelencia académica en posgrado para profesionales de la educación.",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "yzA2ZWzRlB8eDT5_m6Chc_JolLS80SgMNNlGWlsXXnA",
  },
};

import { getOrganizationJsonLd, getWebsiteJsonLd } from "@/components/seo/json-ld";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationJsonLd = await getOrganizationJsonLd();
  const websiteJsonLd = getWebsiteJsonLd();

  return (
    <html lang="es" className={`${playfair.variable} ${jakarta.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="font-sans antialiased selection:bg-brand-600 selection:text-white">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}