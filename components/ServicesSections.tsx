'use client';

import { Car, ShieldCheck, MapPin, CreditCard, Clock, Building2, CarFront, Plane } from 'lucide-react';

const services = [
  { icon: Plane, title: 'Hava limanına çatdırılma', desc: 'Heydər Əliyev Hava Limanına 7/24 çatdırılma və təhvil.' },
  { icon: CarFront, title: 'Sürücü ilə icarə', desc: 'Peşəkar sürücü ilə rahat və təhlükəsiz səyahət.' },
  { icon: ShieldCheck, title: 'Tam sığorta', desc: 'Genişləndirilmiş sığorta ilə əlavə rahatlıq.' },
  { icon: Building2, title: 'Korporativ paketlər', desc: 'Şirkətlər üçün xüsusi qiymətlər və uzunmüddətli icarə.' },
  { icon: MapPin, title: 'Ünvana çatdırılma', desc: 'Şəhər daxili istənilən ünvana sürətli çatdırılma.' },
  { icon: Clock, title: 'Çevik icarə müddəti', desc: 'Günlük, həftəlik, aylıq sərfəli seçimlər.' },
  { icon: CreditCard, title: 'Onlayn ödəniş', desc: 'Kartla onlayn ödəniş və rezervasiya təsdiqi.' },
  { icon: Car, title: 'Geniş maşın parkı', desc: 'Ekonomdan premiuma qədər müxtəlif seçimlər.' },
];

export default function ServicesSections() {
  return (
    <div className="space-y-16">
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map(({ icon: Icon, title, desc }) => {
            const IconComp = (Icon as unknown as React.ComponentType<{ className?: string }>) || Car;
            return (
            <div key={title} className="rounded-2xl border bg-white/70 dark:bg-brand-dark/70 backdrop-blur p-6">
              <IconComp className="h-8 w-8 text-brand-gold" />
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{desc}</p>
            </div>
          );})}
        </div>
      </section>

      <section>
        <div className="rounded-2xl border bg-white/70 dark:bg-brand-dark/70 backdrop-blur p-6">
          <h2 className="text-2xl font-bold mb-6">Qiymət paketləri</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Günlük', 'Həftəlik', 'Aylıq'].map((tier, i) => (
              <div key={tier} className="rounded-xl border p-6">
                <h3 className="font-semibold">{tier}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Sərfəli qiymətlər və bonus xidmətlər.</p>
                <button className="mt-4 inline-flex items-center justify-center rounded-md bg-brand-gold px-4 py-2 text-white">Müraciət et</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="rounded-2xl border bg-white/70 dark:bg-brand-dark/70 backdrop-blur p-6">
          <h2 className="text-2xl font-bold mb-6">Tez-tez verilən suallar</h2>
          <div className="space-y-4">
            {[{q:'Depozit necə işləyir?',a:'Maşından asılı olaraq 200-500$ depozit tələb olunur və qaytarılır.'},{q:'Minimum icarə müddəti?',a:'Minimum 2 gün.'},{q:'Sürücü ilə icarə mümkündür?',a:'Bəli, təcrübəli sürücülərimiz var.'}].map(({q,a})=> (
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


