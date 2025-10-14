'use client';

import { Car, ShieldCheck, MapPin, CreditCard, Clock, Building2, CarFront, Plane } from 'lucide-react';
import { useTranslation } from '@/lib/translations';

interface ServicesSectionsProps {
  t: ReturnType<typeof useTranslation>;
}

export default function ServicesSections({ t }: ServicesSectionsProps) {
  const services = [
    { icon: Plane, titleKey: 'airportDelivery', descKey: 'airportDeliveryDesc' },
    { icon: CarFront, titleKey: 'driverRental', descKey: 'driverRentalDesc' },
    { icon: ShieldCheck, titleKey: 'fullInsuranceService', descKey: 'fullInsuranceServiceDesc' },
    { icon: Building2, titleKey: 'corporatePackages', descKey: 'corporatePackagesDesc' },
    { icon: MapPin, titleKey: 'addressDelivery', descKey: 'addressDeliveryDesc' },
    { icon: Clock, titleKey: 'flexibleRentalPeriod', descKey: 'flexibleRentalPeriodDesc' },
    { icon: CreditCard, titleKey: 'onlinePaymentService', descKey: 'onlinePaymentServiceDesc' },
    { icon: Car, titleKey: 'wideCarFleet', descKey: 'wideCarFleetDesc' },
  ];
  return (
    <div className="space-y-16">
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map(({ icon: Icon, titleKey, descKey }) => {
            const IconComp = (Icon as unknown as React.ComponentType<{ className?: string }>) || Car;
            return (
            <div key={titleKey} className="rounded-2xl border bg-white/70 dark:bg-brand-dark/70 backdrop-blur p-6">
              <IconComp className="h-8 w-8 text-brand-gold" />
              <h3 className="mt-4 text-lg font-semibold">{t[titleKey as keyof typeof t] || titleKey}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{t[descKey as keyof typeof t] || descKey}</p>
            </div>
          );})}
        </div>
      </section>

      <section>
        <div className="rounded-2xl border bg-white/70 dark:bg-brand-dark/70 backdrop-blur p-6">
          <h2 className="text-2xl font-bold mb-6">{t.pricePackages}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[t.daily, t.weekly, t.monthly].map((tier, i) => (
              <div key={tier} className="rounded-xl border p-6">
                <h3 className="font-semibold">{tier}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{t.affordablePricesAndBonusServices}</p>
                <button className="mt-4 inline-flex items-center justify-center rounded-md bg-brand-gold px-4 py-2 text-white">{t.applyNow}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="rounded-2xl border bg-white/70 dark:bg-brand-dark/70 backdrop-blur p-6">
          <h2 className="text-2xl font-bold mb-6">{t.frequentlyAskedQuestions}</h2>
          <div className="space-y-4">
            {[
              {q: t.howDoesDepositWork, a: t.howDoesDepositWorkAnswer},
              {q: t.minimumRentalPeriodQuestion, a: t.minimumRentalPeriodAnswer},
              {q: t.isDriverRentalPossible, a: t.isDriverRentalPossibleAnswer}
            ].map(({q,a})=> (
              <div key={q} className="rounded-lg border p-4">
                <p className="font-semibold">{q}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


