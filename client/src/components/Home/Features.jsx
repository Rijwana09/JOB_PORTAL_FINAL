import { motion } from "framer-motion";
import {
  FaBriefcase,
  FaBuilding,
  FaUserGraduate,
} from "react-icons/fa";

const features = [
  {
    title: "Thousands of Jobs",
    description: "Discover opportunities across multiple industries.",
    icon: FaBriefcase,
  },
  {
    title: "Top Companies",
    description: "Apply to trusted recruiters and leading organizations.",
    icon: FaBuilding,
  },
  {
    title: "Career Growth",
    description: "Track applications and grow professionally.",
    icon: FaUserGraduate,
  },
];

export default function Features() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">

        <h2 className="mb-12 text-center text-4xl font-bold">
          Why Choose Us?
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="rounded-xl border bg-white p-8 shadow-sm"
            >
              <feature.icon className="mb-4 text-5xl text-blue-600" />

              <h3 className="text-2xl font-semibold">
                {feature.title}
              </h3>

              <p className="mt-3 text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}