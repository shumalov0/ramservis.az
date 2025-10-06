import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Xidmətlər',
  description: 'Ram Servis xidmətləri: sürücü ilə icarə, hava limanına çatdırılma, tam sığorta, korporativ paketlər və daha çox.',
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    title: 'Ram Servis | Xidmətlər',
    description: 'Sizin ehtiyaclarınıza uyğun rent a car xidmətləri.',
    url: 'https://www.ramservis.az/services',
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}


