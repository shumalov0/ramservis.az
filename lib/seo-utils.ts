// SEO utility functions
import { Metadata } from 'next';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
}

export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  image = '/og-image.jpg',
  url = '/',
  type = 'website',
  publishedTime,
  modifiedTime,
}: SEOProps): Metadata {
  const baseUrl = 'https://www.ramservis.az';
  const fullUrl = `${baseUrl}${url}`;
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;

  const defaultKeywords = [
    'maşın icarəsi',
    'rent a car',
    'Bakı rent a car',
    'maşın kirayəsi',
    'avtomobil icarəsi',
    'Bakı maşın icarəsi',
    'Ram Servis',
  ];

  return {
    title: title ? `${title} | Ram Servis` : 'Ram Servis | Bakı Maşın İcarəsi və Rent a Car Xidməti',
    description: description || 'Bakı və Azərbaycanda etibarlı maşın icarəsi. Gündəlik, həftəlik və aylıq rent a car.',
    keywords: [...defaultKeywords, ...keywords],
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      type,
      locale: 'az_AZ',
      url: fullUrl,
      siteName: 'Ram Servis',
      title: title || 'Ram Servis | Bakı Maşın İcarəsi və Rent a Car Xidməti',
      description: description || 'Bakı və Azərbaycanda etibarlı maşın icarəsi. Gündəlik, həftəlik və aylıq rent a car.',
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title || 'Ram Servis - Bakı Maşın İcarəsi',
        },
      ],
      publishedTime,
      modifiedTime,
    },
    twitter: {
      card: 'summary_large_image',
      title: title || 'Ram Servis | Bakı Maşın İcarəsi',
      description: description || 'Bakı və Azərbaycanda etibarlı maşın icarəsi.',
      images: [fullImageUrl],
    },
  };
}

// JSON-LD structured data generators
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ram Servis',
    url: 'https://www.ramservis.az',
    logo: 'https://www.ramservis.az/logo.png',
    sameAs: [
      'https://www.facebook.com/ramservis',
      'https://www.instagram.com/ramservis',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+994707004444',
        contactType: 'customer service',
        areaServed: 'AZ',
        availableLanguage: ['az', 'en', 'ru', 'ar'],
      },
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bakı',
      addressCountry: 'AZ',
    },
  };
}

export function generateCarRentalSchema(car?: any) {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': 'CarRental',
    name: 'Ram Servis Car Rental',
    url: 'https://www.ramservis.az',
    telephone: '+994707004444',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bakı',
      addressCountry: 'AZ',
    },
    priceRange: '₼₼',
    openingHours: 'Mo-Su 09:00-18:00',
  };

  if (car) {
    return {
      ...baseSchema,
      '@type': 'Product',
      name: `${car.brand} ${car.model} - Maşın İcarəsi`,
      description: `${car.brand} ${car.model} maşınını Bakıda icarəyə götürün. ${car.features?.join(', ')}.`,
      image: car.images?.[0] || '/placeholder-car.jpg',
      brand: {
        '@type': 'Brand',
        name: car.brand,
      },
      offers: {
        '@type': 'Offer',
        price: car.price,
        priceCurrency: 'AZN',
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: 'Ram Servis',
        },
      },
    };
  }

  return baseSchema;
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://www.ramservis.az${item.url}`,
    })),
  };
}