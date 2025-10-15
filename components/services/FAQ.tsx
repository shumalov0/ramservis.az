'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQProps {
  t: any;
}

export default function FAQ({ t }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: t.howDoesDepositWork || 'Depozit necə işləyir?',
      answer: t.howDoesDepositWorkAnswer || 'Depozit avtomobil təhvil alınarkən ödənilir və heç bir problem olmadıqda geri qaytarılır.'
    },
    {
      question: t.minimumRentalPeriodQuestion || 'Minimum icarə müddəti nə qədərdir?',
      answer: t.minimumRentalPeriodAnswer || 'Minimum icarə müddəti 1 gündür. Uzunmüddətli icarələrdə endirim tətbiq olunur.'
    },
    {
      question: t.isDriverRentalPossible || 'Sürücü ilə icarə mümkündürmü?',
      answer: t.isDriverRentalPossibleAnswer || 'Bəli, təcrübəli sürücülərimizlə avtomobil icarəsi xidməti təqdim edirik.'
    },
    {
      question: t.insuranceQuestion || 'Sığorta daxildirmi?',
      answer: t.insuranceAnswer || 'Bütün avtomobillərimiz tam sığorta ilə təmin edilir. Əlavə sığorta seçimləri də mövcuddur.'
    },
    {
      question: t.fuelPolicyQuestion || 'Yanacaq siyasəti necədir?',
      answer: t.fuelPolicyAnswer || 'Avtomobil dolu çənlə təhvil verilir və dolu çənlə geri qaytarılmalıdır.'
    },
    {
      question: t.cancellationQuestion || 'Ləğvetmə siyasəti necədir?',
      answer: t.cancellationAnswer || '24 saat əvvəl ləğv etdiyiniz halda heç bir ödəniş tələb olunmur.'
    }
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-zinc-900/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t.frequentlyAskedQuestions || 'Tez-tez Verilən Suallar'}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t.faqDescription || 'Ən çox soruşulan suallara cavablar'}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors duration-200"
              >
                <span className="text-lg font-semibold text-gray-900 dark:text-white pr-4">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-brand-gold flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6">
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}