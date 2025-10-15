"use client";

import {
  Car,
  ShieldCheck,
  MapPin,
  CreditCard,
  Clock,
  Building2,
  CarFront,
  Plane,
  Users,
  Headphones,
} from "lucide-react";
import ServiceCard from "./services/ServiceCard";
import PricingSection from "./services/PricingSection";
import ProcessSteps from "./services/ProcessSteps";
import FAQ from "./services/FAQ";
import ContactCTA from "./services/ContactCTA";

interface ServicesSectionsProps {
  t: any;
}

export default function ServicesSections({ t }: ServicesSectionsProps) {
  const services = [
    {
      icon: Plane,
      title: t.airportDelivery || "Hava Limanı Çatdırılması",
      description:
        t.airportDeliveryDesc ||
        "Hava limanından birbaşa avtomobil təhvil alma xidməti",
      features: [
        t.freeAirportDelivery || "Pulsuz hava limanı çatdırılması",
        t.meetAndGreet || "Qarşılama xidməti",
        t.flightTracking || "Uçuş izləmə",
      ],
    },
    {
      icon: CarFront,
      title: t.driverRental || "Sürücü ilə İcarə",
      description:
        t.driverRentalDesc || "Təcrübəli sürücülərimizlə rahat səyahət",
      features: [
        t.professionalDrivers || "Peşəkar sürücülər",
        t.cityKnowledge || "Şəhər bilgisi",
        t.safetyFirst || "Təhlükəsizlik prioriteti",
      ],
    },
    {
      icon: ShieldCheck,
      title: t.fullInsuranceService || "Tam Sığorta Xidməti",
      description: t.fullInsuranceServiceDesc || "Hərtərəfli sığorta təminatı",
      features: [
        t.comprehensiveCoverage || "Hərtərəfli təminat",
        t.zeroDeductible || "Sıfır muafilik",
        t.roadAssistance || "Yol yardımı",
      ],
    },
    {
      icon: Building2,
      title: t.corporatePackages || "Korporativ Paketlər",
      description: t.corporatePackagesDesc || "Şirkətlər üçün xüsusi həllər",
      features: [
        t.bulkDiscounts || "Toplu endirimlər",
        t.flexibleBilling || "Çevik fakturalama",
        t.dedicatedSupport || "Xüsusi dəstək",
      ],
    },
    {
      icon: MapPin,
      title: t.addressDelivery || "Ünvana Çatdırılma",
      description:
        t.addressDeliveryDesc || "İstədiyiniz ünvana avtomobil çatdırılması",
      features: [
        t.doorToDoor || "Qapıdan qapıya",
        t.flexibleTiming || "Çevik vaxt",
        t.citywideCoverage || "Şəhər əhatəsi",
      ],
    },
    {
      icon: Clock,
      title: t.flexibleRentalPeriod || "Çevik İcarə Müddəti",
      description:
        t.flexibleRentalPeriodDesc || "Saatlıqdan aylığa qədər icarə seçimləri",
      features: [
        t.hourlyRental || "Saatlıq icarə",
        t.longTermDiscounts || "Uzunmüddətli endirimlər",
        t.easyExtension || "Asan uzatma",
      ],
    },
    {
      icon: CreditCard,
      title: t.onlinePaymentService || "Onlayn Ödəniş",
      description:
        t.onlinePaymentServiceDesc || "Təhlükəsiz və sürətli ödəniş sistemi",
      features: [
        t.securePayments || "Təhlükəsiz ödənişlər",
        t.multipleOptions || "Çoxlu seçimlər",
        t.instantConfirmation || "Ani təsdiq",
      ],
    },
    {
      icon: Car,
      title: t.wideCarFleet || "Geniş Avtomobil Parkı",
      description:
        t.wideCarFleetDesc || "Müxtəlif kateqoriyalarda 500+ avtomobil",
      features: [
        t.latestModels || "Ən yeni modellər",
        t.regularMaintenance || "Müntəzəm texniki xidmət",
        t.cleanVehicles || "Təmiz avtomobillər",
      ],
    },
    {
      icon: Users,
      title: t.customerSupport || "Müştəri Dəstəyi",
      description: t.customerSupportDesc || "24/7 peşəkar müştəri xidməti",
      features: [
        t.support24 || "24/7 dəstək",
        t.multiLanguage || "Çoxdilli xidmət",
        t.quickResponse || "Sürətli cavab",
      ],
    },
    {
      icon: Headphones,
      title: t.emergencyAssistance || "Təcili Yardım",
      description:
        t.emergencyAssistanceDesc || "Hər an əlçatan təcili yardım xidməti",
      features: [
        t.roadside || "Yol kənarı yardım",
        t.replacement || "Ehtiyat avtomobil",
        t.towing || "Yedəkləmə xidməti",
      ],
    },
  ];

  return (
    <div className="space-y-0">
      {/* Main Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t.ourMainServices || "Əsas Xidmətlərimiz"}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t.servicesIntro ||
                "Avtomobil icarəsi sahəsində ən keyfiyyətli və etibarlı xidmətləri təqdim edirik"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.slice(0, 6).map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
                features={service.features}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 bg-gray-50 dark:bg-zinc-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t.additionalServices || "Əlavə Xidmətlər"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.slice(6).map((service, index) => (
              <ServiceCard
                key={index + 6}
                icon={service.icon}
                title={service.title}
                description={service.description}
                features={service.features}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <ProcessSteps t={t} />

      {/* Pricing Section */}
      {/* <PricingSection t={t} /> */}

      {/* FAQ Section */}
      <FAQ t={t} />

      {/* Contact CTA */}
      <ContactCTA t={t} />
    </div>
  );
}
