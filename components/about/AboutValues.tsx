"use client";

import { motion } from "framer-motion";
import { Shield, Heart, Zap, Users, Award, Clock } from "lucide-react";

const getValues = (t: any) => [
  {
    icon: <Shield className="w-8 h-8" />,
    title: t.reliability,
    description: t.reliabilityDesc,
    color: "from-brand-gold to-yellow-500"
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: t.customerSatisfaction,
    description: t.customerSatisfactionDesc,
    color: "from-brand-gold to-yellow-600"
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: t.fastService,
    description: t.fastServiceDesc,
    color: "from-yellow-500 to-brand-gold"
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: t.teamwork,
    description: t.teamworkDesc,
    color: "from-brand-gold to-yellow-400"
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: t.quality,
    description: t.qualityDesc,
    color: "from-yellow-600 to-brand-gold"
  },
  {
    icon: <Clock className="w-8 h-8" />,
    title: t.support24_7,
    description: t.support24_7Desc,
    color: "from-brand-gold to-yellow-500"
  }
];

interface AboutValuesProps {
  t: any;
}

export default function AboutValues({ t }: AboutValuesProps) {
  const values = getValues(t);
  
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
              {t.valuesTitle}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t.valuesDescription}
            </p>
          </motion.div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-zinc-800 h-full group-hover:-translate-y-2">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${value.color} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {value.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-r from-brand-gold to-yellow-500 p-8 rounded-2xl text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                {t.joinOurTeam}
              </h3>
              <p className="text-yellow-100 mb-6 max-w-2xl mx-auto">
                {t.joinOurTeamDesc}
              </p>
              <button className="bg-white text-brand-gold px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-300">
                {t.careerOpportunities}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}