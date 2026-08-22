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
    <section className="bg-slate-900 py-20">
      <div className="mx-auto max-w-7xl px-6">

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
          className="mb-12 text-center"
        >

          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Growing With Opportunities
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Our platform brings students, recruiters and opportunities
            together in one place.
          </p>

        </motion.div>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">

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
                className="rounded-2xl border border-slate-700 bg-slate-800 p-6 text-center"
              >

                <Icon className="mx-auto mb-4 text-2xl text-blue-400" />

                <h3 className="text-3xl font-bold text-white">
                  {stat.value}
                </h3>

                <p className="mt-2 text-sm text-slate-400">
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