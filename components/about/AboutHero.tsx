"use client";

import { motion } from "framer-motion";
import { Car, Shield, Users, Award } from "lucide-react";

interface AboutHeroProps {
  t: any;
}

export default function AboutHero({ t }: AboutHeroProps) {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-brand-gold/10 via-white to-brand-gold/5 dark:from-brand-dark dark:via-zinc-900 dark:to-brand-dark">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
              {t.aboutTitle}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
              {t.aboutSubtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-brand-gold/10 rounded-2xl flex items-center justify-center">
                <Car className="w-8 h-8 text-brand-gold" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                100+
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{t.carsInFleet}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-brand-gold/10 rounded-2xl flex items-center justify-center">
                <Users className="w-8 h-8 text-brand-gold" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                15,000+
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{t.customerSatisfaction}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-brand-gold/10 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-brand-gold" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                21+
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{t.experience}</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-brand-gold/10 rounded-2xl flex items-center justify-center">
                <Award className="w-8 h-8 text-brand-gold" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                24/7
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{t.support}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
