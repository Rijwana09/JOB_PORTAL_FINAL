import { motion } from "framer-motion";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";

export default function Hero() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold leading-tight md:text-6xl">
            Find Your
            <span className="text-blue-600"> Dream Job</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Explore thousands of verified jobs from
            top companies and kick-start your career.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mx-auto mt-12 flex max-w-4xl flex-col gap-4 rounded-xl bg-white p-4 shadow-lg md:flex-row"
        >
          <div className="flex flex-1 items-center gap-3">
            <FaSearch className="text-gray-400" />

            <input
              type="text"
              placeholder="Job title or skill"
              className="w-full outline-none"
            />
          </div>

          <div className="flex flex-1 items-center gap-3">
            <FaMapMarkerAlt className="text-gray-400" />

            <input
              type="text"
              placeholder="Location"
              className="w-full outline-none"
            />
          </div>

          <button className="rounded-lg bg-blue-600 px-8 py-3 text-white transition hover:bg-blue-700">
            Search
          </button>
        </motion.div>
      </div>
    </section>
  );
}