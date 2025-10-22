"use client";

import { motion } from "framer-motion";
import { Award, Shield, CheckCircle, Star, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
import Image from "next/image";


// Function to get translated certificates
const getTranslatedCertificates = (t: any) => [
  {
    title: t.cert1Title,
    description: t.cert1Desc,
    image: "/certificates/img1.jpg",
    year: "2023",
    issuer: "ISO"
  },
  {
    title: t.cert2Title,
    description: t.cert2Desc,
    image: "/certificates/img2.jpg",
    year: "2023",
    issuer: t.environmentMinistry
  },
  {
    title: t.cert3Title,
    description: t.cert3Desc,
    image: "/certificates/img3.jpg",
    year: "2024",
    issuer: "Sığorta Şirkəti"
  },
  {
    title: t.cert4Title,
    description: t.cert4Desc,
    image: "/certificates/img4.jpg",
    year: "2023",
    issuer: t.businessExcellenceCenter
  },
  {
    title: t.cert5Title,
    description: t.cert5Desc,
    image: "/certificates/img5.jpg",
    year: "2024",
    issuer: t.roadSafetyAgency
  },
  {
    title: t.cert6Title,
    description: t.cert6Desc,
    image: "/certificates/img6.jpg",
    year: "2023",
    issuer: t.tourismAssociation
  },
  {
    title: t.cert7Title,
    description: t.cert7Desc,
    image: "/certificates/img7.jpg",
    year: "2024",
    issuer: "Texniki Xidmət"
  },
  {
    title: t.cert8Title,
    description: t.cert8Desc,
    image: "/certificates/img8.jpg",
    year: "2023",
    issuer: "Təlim Mərkəzi"
  },
  {
    title: t.cert9Title,
    description: t.cert9Desc,
    image: "/certificates/img9.jpg",
    year: "2024",
    issuer: t.environmentMinistry
  },
  {
    title: t.cert10Title,
    description: t.cert10Desc,
    image: "/certificates/img10.jpg",
    year: "2023",
    issuer: "Keyfiyyət Mərkəzi"
  },
  {
    title: t.cert11Title,
    description: t.cert11Desc,
    image: "/certificates/img11.jpg",
    year: "2024",
    issuer: "Rəqəmsal Agentlik"
  },
  {
    title: t.cert12Title,
    description: t.cert12Desc,
    image: "/certificates/img12.jpg",
    year: "2023",
    issuer: "Beynəlxalq Təşkilat"
  }
];

const getAchievements = (t: any) => [
  {
    icon: <Award className="w-8 h-8" />,
    title: t.bestRentACarCompany,
    year: "2023",
    organization: t.tourismAssociation
  },
  {
    icon: <Star className="w-8 h-8" />,
    title: t.customerSatisfactionAward,
    year: "2022",
    organization: t.businessExcellenceCenter
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: t.safetyStandardsCertificate,
    year: "2024",
    organization: t.roadSafetyAgency
  },
  {
    icon: <CheckCircle className="w-8 h-8" />,
    title: t.ecoCertificate,
    year: "2023",
    organization: t.environmentMinistry
  }
];

interface AboutCertificatesProps {
  t: any;
}

export default function AboutCertificates({ t }: AboutCertificatesProps) {
  const achievements = getAchievements(t);
  const certificates = getTranslatedCertificates(t);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true,
    align: 'start',
    slidesToScroll: 1,
    breakpoints: {
      '(min-width: 768px)': { slidesToScroll: 2 },
      '(min-width: 1024px)': { slidesToScroll: 4 }
    }
  });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="py-20 bg-gray-50 dark:bg-zinc-900/50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t.certificatesAndAwards}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t.certificatesAndAwardsDesc}
            </p>
          </motion.div>

          {/* Certificates Carousel */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              {t.licensesAndCertificates}
            </h3>
            
            <div className="relative">
              {/* Navigation Buttons */}
              <div className="flex justify-center gap-4 mb-8">
                <button
                  onClick={scrollPrev}
                  disabled={!prevBtnEnabled}
                  className="w-12 h-12 rounded-full bg-white dark:bg-zinc-800 shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 dark:border-zinc-700"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={scrollNext}
                  disabled={!nextBtnEnabled}
                  className="w-12 h-12 rounded-full bg-white dark:bg-zinc-800 shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 dark:border-zinc-700"
                >
                  <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Carousel */}
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex">
                  {certificates.map((cert, index) => (
                    <div key={index} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_25%] pl-4">
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="group mr-4"
                      >
                        <div className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 h-full">
                          {/* Certificate Image */}
                          <div className="relative h-48 overflow-hidden">
                            <Image
                              src={cert.image}
                              alt={cert.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                // Fallback to placeholder if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `
                                    <div class="w-full h-full bg-gradient-to-br from-brand-gold/10 to-yellow-200/10 dark:from-brand-gold/5 dark:to-yellow-900/10 flex items-center justify-center">
                                      <div class="text-center">
                                        <div class="text-3xl mb-2">📜</div>
                                        <div class="text-xs text-brand-gold font-medium px-2">${cert.title}</div>
                                      </div>
                                    </div>
                                  `;
                                }
                              }}
                            />
                            <div className="absolute top-4 right-4 bg-brand-gold text-white px-3 py-1 rounded-full text-sm font-semibold">
                              {cert.year}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-6">
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                              {cert.title}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                              {cert.description}
                            </p>
                            <p className="text-brand-gold text-sm font-semibold">
                              {cert.issuer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              {t.awardsAndAchievements}
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-zinc-800 group-hover:-translate-y-1">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-brand-gold to-yellow-500 rounded-xl flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                            {achievement.title}
                          </h4>
                          <span className="bg-brand-gold/10 text-brand-gold px-3 py-1 rounded-full text-sm font-semibold">
                            {achievement.year}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {achievement.organization}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-r from-brand-gold to-yellow-500 p-8 rounded-2xl text-white">
              <div className="flex items-center justify-center mb-4">
                <Shield className="w-12 h-12 text-yellow-200" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                {t.fullyLicensedAndInsured}
              </h3>
              <p className="text-yellow-100 max-w-2xl mx-auto">
                {t.fullyLicensedDesc}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}