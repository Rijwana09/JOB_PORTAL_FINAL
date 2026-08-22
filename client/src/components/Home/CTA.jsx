import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaUserGraduate,
  FaBuilding,
} from "react-icons/fa";

export default function CTA() {
  return (
    <section className="bg-slate-50 px-6 py-20 md:py-24">

      <div className="mx-auto max-w-7xl">

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
          viewport={{
            once: true,
          }}
          className="overflow-hidden rounded-3xl bg-slate-900 px-6 py-14 text-center md:px-12 md:py-20"
        >

          <h2 className="text-3xl font-bold text-white md:text-4xl">
            Ready to Take the Next Step?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-300">
            Whether you're looking for your first opportunity or
            searching for talented professionals, we're here to help.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              <FaUserGraduate />
              Get Started
              <FaArrowRight className="text-sm" />
            </Link>

            <Link
              to="/jobs"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 bg-transparent px-7 py-3 font-medium text-white transition hover:bg-slate-800"
            >
              <FaBuilding />
              Explore Jobs
            </Link>

          </div>

        </motion.div>

      </div>

    </section>
  );
}