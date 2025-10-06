import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Əlaqə',
  description: 'Ram Servis ilə əlaqə: Bakı ünvanı, telefon, email. 7/24 dəstək xidməti.',
  alternates: {
    canonical: '/contact',
    languages: {
      'az-AZ': '/contact',
      'en': '/contact?lang=en',
      'ru': '/contact?lang=ru',
      'ar': '/contact?lang=ar',
    },
  },
  openGraph: {
    title: 'Ram Servis | Əlaqə',
    description: 'Bakı Ram Servis rent a car ilə necə əlaqə saxlamalı.',
    url: 'https://www.ramservis.az/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}


