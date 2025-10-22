"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Target } from "lucide-react";

interface AboutStoryProps {
  t: any;
}

export default function AboutStory({ t }: AboutStoryProps) {
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
              {t.ourStory}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {t.storyDescription}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Story Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-brand-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-brand-gold" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {t.storyBeginning}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t.storyBeginningDesc}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-brand-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-brand-gold" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {t.storyExpansion}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t.storyExpansionDesc}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-brand-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-brand-gold" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {t.storyLeadership}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t.storyLeadershipDesc}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-brand-gold/5 dark:bg-brand-gold/10 p-6 rounded-xl border border-brand-gold/20">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {t.ourMission}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {t.missionDescription}
                </p>
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🚗</div>
                  <div className="text-xl font-semibold text-blue-800 dark:text-blue-200">Ram Servis</div>
                  <div className="text-blue-600 dark:text-blue-300">15 İl Təcrübə</div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Floating Card */}
              <div className="absolute -bottom-8 -left-8 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-800">
                <div className="text-center">
                  <div className="text-3xl font-bold text-brand-gold">21+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">İl Təcrübə</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}