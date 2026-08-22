import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaUserGraduate,
  FaBuilding,
} from "react-icons/fa";

export default function CTA() {
  return (
    <section className="bg-slate-50 px-4 py-14 sm:px-6 sm:py-20 md:py-24">

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
          className="overflow-hidden rounded-2xl bg-slate-900 px-5 py-12 text-center sm:rounded-3xl sm:px-8 sm:py-14 md:px-12 md:py-20"
        >

          {/* Heading */}
          <h2 className="text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
            Ready to Take the Next Step?
          </h2>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:mt-5 sm:text-base sm:leading-7">
            Whether you're looking for your first opportunity or
            searching for talented professionals, we're here to help.
          </p>

          {/* Actions */}
          <div className="mx-auto mt-8 flex max-w-md flex-col justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">

            <Link
              to="/register"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 active:scale-[0.98] sm:w-auto sm:px-7"
            >
              <FaUserGraduate />

              <span>
                Get Started
              </span>

              <FaArrowRight className="text-sm" />
            </Link>

            <Link
              to="/jobs"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-600 bg-transparent px-6 py-3 font-medium text-white transition hover:bg-slate-800 active:scale-[0.98] sm:w-auto sm:px-7"
            >
              <FaBuilding />

              <span>
                Explore Jobs
              </span>
            </Link>

          </div>

        </motion.div>

      </div>

    </section>
  );
}