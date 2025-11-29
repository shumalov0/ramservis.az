import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { buses, enhancedBuses } from '@/lib/data';
import BusDetailPageContent from '@/components/BusDetailPageContent';
import { EnhancedBus } from '@/lib/types';

export async function generateStaticParams() {
  return buses.map((bus) => ({
    id: bus.id,
  }));
}

interface BusDetailProps {
  params: { id: string };
}

export default function BusDetail({ params }: BusDetailProps) {
  const bus = buses.find(b => b.id === params.id);
  const enhancedBus = enhancedBuses.find(b => b.id === params.id);

  if (!bus) {
    notFound();
  }

  // Use enhanced bus data if available, otherwise convert basic bus to enhanced format
  const busData: EnhancedBus = enhancedBus || {
    ...bus,
    category: ['Minibus'],
    popularity: 75,
    availability: true,
    gallery: bus.images || [bus.image],
    specifications: {
      engine: bus.engineSize || '2.0L',
      horsepower: 150,
      acceleration: '0-100 km/h in 12.0s',
      topSpeed: 160,
      fuelConsumption: '8.0L/100km'
    },
    amenities: bus.features || [],
    routes: ['Şəhərdaxili', 'Hava Limanı']
  };

  return <BusDetailPageContent bus={bus} enhancedBus={busData} initialLang={'az'} />;
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const bus = buses.find(b => b.id === params.id);
  if (!bus) return {};
  const title = `${bus.brand} ${bus.model} ${bus.year} icarə | Bakı Avtobus İcarəsi`;
  const description = `${bus.brand} ${bus.model} ${bus.year} ${bus.type}, ${bus.capacity} nəfərlik, ${bus.fuelType}, ${bus.transmission}. Günlük ₼${bus.dailyPrice}-dan. Ram Servis-də sərfəli avtobus icarəsi.`;
  const url = `https://www.ramservis.az/bus/${bus.id}`;
  return {
    title,
    description,
    alternates: {
      canonical: `/bus/${bus.id}`,
    },
    openGraph: {
      title,
      description,
      url,
      images: [{ url: bus.image }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [bus.image],
    },
  };
}