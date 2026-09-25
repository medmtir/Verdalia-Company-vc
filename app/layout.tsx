import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Montserrat, Playfair_Display } from 'next/font/google';
import "./globals.css";
import { I18nProvider } from "@/lib/i18n/context";
import { SiteSettingsProvider } from "@/lib/context/site-settings-context";
import { db } from "@/lib/db/db";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#203A1A",
};

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-montserrat',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});
import {
  DEFAULT_LOCALE,
  isValidLocale,
  LOCALE_METAS,
  LOCALES,
} from "@/lib/i18n/config";
import {
  SEO_BY_LOCALE,
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  buildExporterJsonLd,
} from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = cookies();
  const cookieLocale = cookieStore.get("verdalia_locale")?.value;
  const locale =
    cookieLocale && isValidLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;
  const seo = SEO_BY_LOCALE[locale];
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://verdalia-company-vc.vercel.app";

  const languages: Record<string, string> = {};
  for (const loc of LOCALES) {
    languages[loc] = siteUrl;
  }
  languages["x-default"] = siteUrl;

  return {
    title: {
      default: seo.meta_title,
      template: "%s | Verdalia Company VC",
    },
    description: seo.meta_description,
    keywords: seo.keywords,
    authors: [{ name: "Verdalia Company VC" }],
    creator: "Verdalia Company VC",
    publisher: "Verdalia Company VC",
    category: "Olive Oil Export",
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: siteUrl,
      languages,
    },
    icons: {
      icon: "/images/verdalia-logo.png",
      apple: "/images/verdalia-logo.png",
    },
    openGraph: {
      title: seo.meta_title,
      description: seo.meta_description,
      type: "website",
      locale: seo.og_locale,
      alternateLocale: LOCALES.filter((l) => l !== locale).map(
        (l) => SEO_BY_LOCALE[l].og_locale
      ),
      siteName: "Verdalia Company VC",
      url: siteUrl,
      images: [
        {
          url: "/images/verdalia-logo.png",
          width: 1024,
          height: 1024,
          alt: "Verdalia — Huile d'olive Tunisie / Tunisian olive oil exporter",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.meta_title,
      description: seo.meta_description,
      images: ["/images/verdalia-logo.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other: {
      "geo.region": "TN",
      "geo.placename": "Tunisia",
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const cookieLocale = cookieStore.get("verdalia_locale")?.value;
  const locale =
    cookieLocale && isValidLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;
  const meta = LOCALE_METAS[locale];
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://verdalia-company-vc.vercel.app";

  // Fetch site settings server-side — available instantly on first render
  let siteSettings;
  try {
    siteSettings = db.siteSettings.get();
  } catch {
    siteSettings = undefined;
  }

  const jsonLd = [
    buildOrganizationJsonLd(siteUrl),
    buildWebSiteJsonLd(siteUrl),
    buildExporterJsonLd(siteUrl),
  ];

  return (
    <html lang={locale} dir={meta.dir}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        {LOCALES.map((loc) => (
          <link
            key={loc}
            rel="alternate"
            hrefLang={loc}
            href={siteUrl}
          />
        ))}
        <link rel="alternate" hrefLang="x-default" href={siteUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${montserrat.variable} ${playfairDisplay.variable} font-sans bg-verdalia-offwhite text-verdalia-dark antialiased min-h-screen flex flex-col`}>
        <I18nProvider initialLocale={locale}>
          <SiteSettingsProvider initialData={siteSettings}>{children}</SiteSettingsProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
