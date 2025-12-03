import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import LazyThreeBackground from "@/components/LazyThreeBackground";
import ClientLayout from "@/components/ClientLayout";
import SEOAnalytics from "@/components/SEOAnalytics";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ramservis.az"),
  title: {
    default: "Ram Servis | Bakı Maşın İcarəsi və Rent a Car Xidməti",
    template: "%s | Ram Servis",
  },
  description:
    "Bakı və Azərbaycanda etibarlı maşın icarəsi. Gündəlik, həftəlik və aylıq rent a car. Hava limanına çatdırılma, sürücü ilə icarə, sərfəli qiymətlər.",
  keywords: [
    "maşın icarəsi",
    "rent a car",
    "Bakı rent a car",
    "maşın kirayəsi",
    "avtomobil icarəsi",
    "Bakı maşın icarəsi",
    "airport delivery",
    "car rental Azerbaijan",
    "Baku car hire",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "az-AZ": "/",
      en: "/?lang=en",
      ru: "/?lang=ru",
      ar: "/?lang=ar",
    },
  },
  openGraph: {
    type: "website",
    locale: "az_AZ",
    url: "https://www.ramservis.az/",
    siteName: "Ram Servis",
    title: "Ram Servis | Bakı Maşın İcarəsi və Rent a Car Xidməti",
    description:
      "Bakı və Azərbaycanda etibarlı maşın icarəsi. Gündəlik, həftəlik və aylıq rent a car.",
    images: [
      {
        url: "https://www.ramservis.az/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ram Servis - Bakı Maşın İcarəsi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ram Servis | Bakı Maşın İcarəsi",
    description:
      "Bakı və Azərbaycanda etibarlı maşın icarəsi. Hava limanına çatdırılma, sərfəli qiymətlər.",
    images: ["https://www.ramservis.az/og-image.jpg"],
  },
  icons: {
    icon: "/icons/logosyellow.png",
    shortcut: "/icons/logosyellow.png",
    apple: "/icons/logosyellow.png",
  },
  category: "travel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="az">
      <head>
        {/* Google Site Verification - Deploy sonrası əlavə edin */}
        <meta
          name="google-site-verification"
          content="YOUR_VERIFICATION_CODE"
        />

        {/* Bing Verification */}
        {/* <meta name="msvalidate.01" content="YOUR_BING_VERIFICATION_CODE" /> */}
      </head>
      <body className={inter.className}>
        {/* Google Analytics - Deploy sonrası GA4 ID əlavə edin */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  page_title: document.title,
                  page_location: window.location.href,
                });
              `}
            </Script>
          </>
        )}

        {/* Disable Right Click and Inspect */}
        <Script id="disable-right-click" strategy="afterInteractive">
          {`
            // Disable right-click
            document.addEventListener('contextmenu', (e) => e.preventDefault());
            
            // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
            document.addEventListener('keydown', (e) => {
              if (
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                (e.ctrlKey && e.shiftKey && e.key === 'J') ||
                (e.ctrlKey && e.shiftKey && e.key === 'C') ||
                (e.ctrlKey && e.key === 'U')
              ) {
                e.preventDefault();
              }
            });
          `}
        </Script>

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Three.js Background - lazy loaded to improve initial performance */}
          <LazyThreeBackground
            scene="minimal"
            intensity="low"
            responsive={true}
          />
          <script
            type="application/ld+json"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Ram Servis",
                url: "https://www.ramservis.az",
                logo: "https://www.ramservis.az/logo.png",
                sameAs: [
                  "https://www.facebook.com/ramservis",
                  "https://www.instagram.com/ramservis",
                ],
                contactPoint: [
                  {
                    "@type": "ContactPoint",
                    telephone: "+994707004444",
                    contactType: "customer service",
                    areaServed: "AZ",
                    availableLanguage: ["az", "en", "ru", "ar"],
                  },
                ],
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Bakı",
                  addressCountry: "AZ",
                },
              }),
            }}
          />
          <ClientLayout>{children}</ClientLayout>
          <SEOAnalytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
