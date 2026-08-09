import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl rounded-2xl bg-slate-900 px-8 py-16 text-center text-white">

        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-4xl font-bold"
        >
          Ready to Start Your Career?
        </motion.h2>

        <p className="mx-auto mt-6 max-w-2xl text-gray-300">
          Join thousands of students and recruiters
          already using our platform.
        </p>

        <button className="mt-10 rounded-lg bg-blue-600 px-8 py-3 transition hover:bg-blue-700">
          Get Started
        </button>

      </div>
    </section>
  );
}