import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Online Rezervasiya',
  description: 'Ram Servis maşın icarəsi üçün onlayn rezervasiya edin. Hava limanına çatdırılma, sürücü ilə icarə, çevik tarixlər.',
  alternates: {
    canonical: '/booking',
    languages: {
      'az-AZ': '/booking',
      'en': '/booking?lang=en',
      'ru': '/booking?lang=ru',
      'ar': '/booking?lang=ar',
    },
  },
  openGraph: {
    title: 'Ram Servis | Onlayn Rezervasiya',
    description: 'Bakı rent a car üçün sürətli və rahat onlayn rezervasiya.',
    url: 'https://www.ramservis.az/booking',
  },
};

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return children;
}


