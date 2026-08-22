import { motion } from "framer-motion";
import {
  FaBriefcase,
  FaBuilding,
  FaUsers,
  FaUserTie,
} from "react-icons/fa";

const stats = [
  {
    value: "1000+",
    label: "Jobs",
    icon: FaBriefcase,
  },
  {
    value: "100+",
    label: "Companies",
    icon: FaBuilding,
  },
  {
    value: "5000+",
    label: "Students",
    icon: FaUsers,
  },
  {
    value: "500+",
    label: "Recruiters",
    icon: FaUserTie,
  },
];

export default function Stats() {
  return (
    <section className="bg-slate-900 py-14 sm:py-20">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
          viewport={{
            once: true,
          }}
          className="mb-8 text-center sm:mb-12"
        >

          <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
            Growing With Opportunities
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:mt-4 sm:text-base">
            Our platform brings students, recruiters and opportunities
            together in one place.
          </p>

        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">

          {stats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={stat.label}
                initial={{
                  opacity: 0,
                  scale: 0.9,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.4,
                }}
                viewport={{
                  once: true,
                }}
                className="rounded-xl border border-slate-700 bg-slate-800 p-4 text-center sm:rounded-2xl sm:p-6"
              >

                <Icon className="mx-auto mb-3 text-xl text-blue-400 sm:mb-4 sm:text-2xl" />

                <h3 className="text-2xl font-bold text-white sm:text-3xl">
                  {stat.value}
                </h3>

                <p className="mt-1 text-xs text-slate-400 sm:mt-2 sm:text-sm">
                  {stat.label}
                </p>

              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
}