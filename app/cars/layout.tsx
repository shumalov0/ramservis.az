import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maşın Parkı',
  description: 'Ekonomdan premiuma qədər Bakı maşın icarəsi: sedan, SUV, biznes sinif avtomobillər sərfəli qiymətlərlə.',
  alternates: {
    canonical: '/cars',
    languages: {
      'az-AZ': '/cars',
      'en': '/cars?lang=en',
      'ru': '/cars?lang=ru',
      'ar': '/cars?lang=ar',
    },
  },
  openGraph: {
    title: 'Ram Servis | Maşın Parkı',
    description: 'Bütün icarə maşınları: qiymətlər, xüsusiyyətlər və təkliflər.',
    url: 'https://www.ramservis.az/cars',
  },
};

export default function CarsLayout({ children }: { children: React.ReactNode }) {
  return children;
}


