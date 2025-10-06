import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Haqqımızda',
  description: 'Ram Servis haqqında: peşəkar rent a car, 10+ il təcrübə, geniş maşın parkı və müştəri məmnuniyyəti.',
  alternates: {
    canonical: '/about',
    languages: {
      'az-AZ': '/about',
      'en': '/about?lang=en',
      'ru': '/about?lang=ru',
      'ar': '/about?lang=ar',
    },
  },
  openGraph: {
    title: 'Ram Servis | Haqqımızda',
    description: 'Bakıda rent a car şirkəti Ram Servis haqqında məlumat.',
    url: 'https://www.ramservis.az/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}


