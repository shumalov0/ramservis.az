"use client";

import { motion } from "framer-motion";
import { Car, Users, MapPin, Clock, Star, Shield } from "lucide-react";
import { useEffect, useState } from "react";

interface StatItemProps {
  icon: React.ReactNode;
  number: number;
  label: string;
  suffix?: string;
  delay?: number;
}

function StatItem({ icon, number, label, suffix = "", delay = 0 }: StatItemProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const increment = number / 50;
      const interval = setInterval(() => {
        setCount((prev) => {
          if (prev >= number) {
            clearInterval(interval);
            return number;
          }
          return Math.min(prev + increment, number);
        });
      }, 30);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [number, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay / 1000 }}
      viewport={{ once: true }}
      className="text-center group"
    >
      <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-brand-gold to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
        {icon}
      </div>
      <div className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
        {Math.floor(count)}{suffix}
      </div>
      <div className="text-gray-600 dark:text-gray-400 font-medium">
        {label}
      </div>
    </motion.div>
  );
}

interface AboutStatsProps {
  t: any;
}

export default function AboutStats({ t }: AboutStatsProps) {
  return (
    <section className="py-20">
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
              {t.statsTitle}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t.statsDescription}
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
            <StatItem
              icon={<Car className="w-10 h-10 text-white" />}
              number={100}
              label={t.carsInFleet}
              suffix="+"
              delay={0}
            />
            
            <StatItem
              icon={<Users className="w-10 h-10 text-white" />}
              number={8000}
              label={t.customerSatisfaction}
              suffix="+"
              delay={200}
            />
            
            
            <StatItem
              icon={<Clock className="w-10 h-10 text-white" />}
              number={24}
              label={t.support}
              suffix="/7"
              delay={600}
            />
            
            <StatItem
              icon={<Star className="w-10 h-10 text-white" />}
              number={98}
              label={t.customerSatisfaction}
              suffix="%"
              delay={800}
            />
            
            <StatItem
              icon={<Shield className="w-10 h-10 text-white" />}
              number={21}
              label={t.experience}
              suffix="+"
              delay={1000}
            />
          </div>

          {/* Bottom Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-r from-brand-gold/5 to-yellow-50 dark:from-brand-gold/10 dark:to-yellow-900/20 p-8 rounded-2xl border border-brand-gold/20">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t.whyRamServis}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed">
                {t.whyRamServisDesc}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}