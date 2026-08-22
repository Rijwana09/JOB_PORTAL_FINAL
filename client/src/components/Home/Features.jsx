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
    <section className="bg-white py-14 sm:py-20 md:py-24">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
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
          className="mx-auto mb-10 max-w-2xl text-center sm:mb-14"
        >

          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 sm:text-sm">
            Why choose us
          </span>

          <h2 className="mt-3 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl md:text-4xl">
            Everything You Need to Build Your Career
          </h2>

          <p className="mt-3 text-sm leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">
            A simple platform designed to connect talented candidates
            with the right opportunities.
          </p>

        </motion.div>

        {/* Feature Cards */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">

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
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg sm:p-8"
              >

                {/* Icon */}
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 sm:mb-6 sm:h-14 sm:w-14">
                  <Icon className="text-xl text-blue-600 sm:text-2xl" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-slate-900 sm:text-xl">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-sm leading-6 text-slate-600 sm:mt-3 sm:text-base sm:leading-7">
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