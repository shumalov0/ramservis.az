import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { cars, enhancedCars } from '@/lib/data';
import CarDetailPageContent from '@/components/CarDetailPageContent';
import { EnhancedCar } from '@/lib/types';
import { getSimilarCars } from '@/lib/car-utils';

export async function generateStaticParams() {
  return cars.map((car) => ({
    id: car.id,
  }));
}

interface CarDetailProps {
  params: { id: string };
}

export default function CarDetail({ params }: CarDetailProps) {
  const car = cars.find(c => c.id === params.id);
  const enhancedCar = enhancedCars.find(c => c.id === params.id);

  if (!car) {
    notFound();
  }

  // Use enhanced car data if available, otherwise convert basic car to enhanced format
  const carData: EnhancedCar = enhancedCar || {
    ...car,
    category: ['Economy'],
    popularity: 75,
    availability: true,
    gallery: car.images || [car.image],
    specifications: {
      engine: car.engineSize || '2.0L',
      horsepower: 150,
      acceleration: '0-100 km/h in 9.0s',
      topSpeed: 180,
      fuelConsumption: '7.0L/100km'
    }
  };

  const similarCars = getSimilarCars(carData, enhancedCars);

  return (
    <CarDetailPageContent
      car={car}
      enhancedCar={carData}
      similarCars={similarCars}
      initialLang={'az'}
    />
  );
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const car = cars.find(c => c.id === params.id);
  if (!car) return {};
  const title = `${car.brand} ${car.model} ${car.year} icarə | Bakı Rent a Car`;
  const description = `${car.brand} ${car.model} ${car.year} ${car.class} sinif, ${car.fuelType}, ${car.transmission}. Günlük ₼${car.dailyPrice}-dan. Ram Servis-də sərfəli maşın icarəsi.`;
  const url = `https://www.ramservis.az/car/${car.id}`;
  return {
    title,
    description,
    alternates: {
      canonical: `/car/${car.id}`,
    },
    openGraph: {
      title,
      description,
      url,
      images: [{ url: car.image }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [car.image],
    },
  };
}