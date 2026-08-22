import { motion } from "framer-motion";
import {
  FaBriefcase,
  FaBuilding,
  FaUserGraduate,
} from "react-icons/fa";

const features = [
  {
    title: "Thousands of Jobs",
    description:
      "Discover opportunities across multiple industries and find a role that matches your skills.",
    icon: FaBriefcase,
  },
  {
    title: "Trusted Companies",
    description:
      "Connect with recruiters and organizations looking for talented professionals like you.",
    icon: FaBuilding,
  },
  {
    title: "Career Growth",
    description:
      "Apply for jobs, track your applications, and move closer to your career goals.",
    icon: FaUserGraduate,
  },
];

export default function Features() {
  return (
    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-6">

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
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
          className="mx-auto mb-14 max-w-2xl text-center"
        >

          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Why choose us
          </span>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 md:text-4xl">
            Everything You Need to Build Your Career
          </h2>

          <p className="mt-4 text-slate-600">
            A simple platform designed to connect talented candidates
            with the right opportunities.
          </p>

        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">

          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: index * 0.15,
                  duration: 0.5,
                }}
                viewport={{
                  once: true,
                }}
                whileHover={{
                  y: -6,
                }}
                className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-lg"
              >

                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50">
                  <Icon className="text-2xl text-blue-600" />
                </div>

                <h3 className="text-xl font-semibold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {feature.description}
                </p>

              </motion.div>
            );
          })}

        </div>

      </div>
    </section>
  );
}