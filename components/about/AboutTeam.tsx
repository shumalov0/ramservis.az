"use client";

import { motion } from "framer-motion";
import { Users, Phone, Mail, Settings, Wrench, User } from "lucide-react";
import Image from "next/image";

const getTeamMembers = (t: any) => [
  {
    name: "Ramil İsmayılov",
    position: t.director,
    description: t.directorDesc,
    icon: Users,
    color: "from-blue-500 to-blue-600",
    image: "/team/ramilismayilov.jpeg",
  },
  {
    name: "Lamiya Məsimova",
    position: t.corporateRelationsManager,
    description: t.corporateRelationsDesc,
    icon: Phone,
    color: "from-purple-500 to-purple-600",
    image: "",
  },
  {
    name: "Taleh Həmidov",
    position: t.customerServiceSpecialist,
    description: t.customerServiceDesc,
    icon: Mail,
    color: "from-green-500 to-green-600",
    image: "/team/talehhemidov.jpeg",
  },
  {
    name: "Taleh Mövsümov",
    position: t.technicalServiceSpecialist,
    description: t.technicalServiceDesc,
    icon: Wrench,
    color: "from-red-500 to-red-600",
    image: "/team/talehmovsumov.jpeg",
  },
  {
    name: "Şumalov İntiqam",
    position: t.itSpecialist,
    description: t.itSpecialistDesc,
    icon: Settings,
    color: "from-indigo-500 to-indigo-600",
    image: "/team/intigamshumalov.jpeg",
  },
];

interface AboutTeamProps {
  t: any;
}

export default function AboutTeam({ t }: AboutTeamProps) {
  const teamMembers = getTeamMembers(t);

  return (
    <section className="py-20 bg-white dark:bg-zinc-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            {t.ourTeam}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t.teamDescription}
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-8">
          {teamMembers.map((member, index) => {
            const IconComponent = member.icon;
            return (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group w-full max-w-[350px]"
              >
                <div className="bg-white dark:bg-zinc-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 h-full">
                  {/* Member Photo */}
                  <div className="relative h-64 overflow-hidden">
                    {member.image ? (
                      <div className="relative w-full h-full group-hover:scale-110 transition-transform duration-300">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        {/* Name overlay */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <h4 className="text-white font-semibold text-lg mb-1">
                            {member.name}
                          </h4>
                          <p className="text-white/90 text-sm">
                            {member.position}
                          </p>
                        </div>
                      </div>
                    ) : (
                      // Fallback icon if no image
                      <div
                        className={`w-full h-full bg-gradient-to-br ${member.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      >
                        <div className="text-center">
                          <div className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                            <User className="w-10 h-10 text-white" />
                          </div>
                          <div className="text-sm text-white font-medium px-2">
                            {member.name}
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-brand-gold text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {t.ourTeam}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <IconComponent className="w-5 h-5 text-brand-gold mr-2" />
                      <span className="text-brand-gold text-sm font-semibold">
                        {member.position}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {member.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-brand-gold/10 to-brand-gold/5 dark:from-brand-gold/20 dark:to-brand-gold/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              {t.teamContact}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t.teamContactDescription}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+994"
                className="inline-flex items-center justify-center px-6 py-3 bg-brand-gold text-white rounded-lg hover:bg-brand-gold/90 transition-colors"
              >
                <Phone className="w-5 h-5 mr-2" />
                {t.teamCallUs}
              </a>
              <a
                href="mailto:info@company.az"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-brand-gold text-brand-gold rounded-lg hover:bg-brand-gold hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5 mr-2" />
                {t.sendEmail}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
