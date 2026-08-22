import { useState } from "react";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("search", search.trim());
    }

    if (location.trim()) {
      params.set("location", location.trim());
    }

    const queryString = params.toString();

    navigate(
      queryString
        ? `/jobs?${queryString}`
        : "/jobs"
    );
  };

  const handlePopularSearch = (item) => {
    setSearch(item);

    navigate(
      `/jobs?search=${encodeURIComponent(item)}`
    );
  };

  return (
    <section className="relative overflow-hidden bg-slate-50 py-14 sm:py-20 md:py-28">

      {/* Background Decoration */}
      <div className="pointer-events-none absolute -left-32 -top-24 h-64 w-64 rounded-full bg-blue-100 opacity-50 blur-3xl sm:h-72 sm:w-72" />

      <div className="pointer-events-none absolute -bottom-24 -right-32 h-64 w-64 rounded-full bg-indigo-100 opacity-50 blur-3xl sm:h-72 sm:w-72" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Hero Content */}
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          className="text-center"
        >

          {/* Badge */}
          <div className="mb-5 inline-flex max-w-full rounded-full bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700 sm:px-4 sm:py-2 sm:text-sm">
            Find your next opportunity
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-5xl md:text-6xl">

            Find Your

            <span className="block text-blue-600">
              Dream Job
            </span>

          </h1>

          {/* Description */}
          <p className="mx-auto mt-5 max-w-2xl px-2 text-sm leading-6 text-slate-600 sm:mt-6 sm:text-lg sm:leading-7">
            Discover opportunities from trusted recruiters,
            explore exciting careers, and take the next step
            toward your professional goals.
          </p>

        </motion.div>

        {/* Search */}
        <motion.form
          onSubmit={handleSearch}
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.3,
            duration: 0.6,
          }}
          className="mx-auto mt-8 max-w-5xl rounded-2xl border border-slate-200 bg-white p-2.5 shadow-xl sm:mt-10 sm:p-3"
        >

          <div className="flex flex-col gap-2.5 sm:gap-3 lg:flex-row">

            {/* Search Input */}
            <div className="flex min-h-12 flex-1 items-center gap-3 rounded-xl border border-slate-200 px-3.5 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 sm:px-4">

              <FaSearch className="shrink-0 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Job title, skill or keyword"
                className="min-w-0 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />

            </div>

            {/* Location Input */}
            <div className="flex min-h-12 flex-1 items-center gap-3 rounded-xl border border-slate-200 px-3.5 transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 sm:px-4">

              <FaMapMarkerAlt className="shrink-0 text-slate-400" />

              <input
                type="text"
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                placeholder="Location"
                className="min-w-0 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />

            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700 active:scale-[0.98] lg:w-auto lg:min-w-32"
            >
              Search

              <FaArrowRight className="text-sm" />
            </button>

          </div>

        </motion.form>

        {/* Popular Searches */}
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 0.6,
          }}
          className="mx-auto mt-6 flex max-w-4xl flex-wrap items-center justify-center gap-2 px-1 text-xs sm:text-sm"
        >

          <span className="text-slate-500">
            Popular:
          </span>

          {[
            "Frontend Developer",
            "Backend Developer",
            "Java Developer",
            "React Developer",
          ].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => handlePopularSearch(item)}
              className="rounded-full bg-white px-3 py-2 text-slate-600 shadow-sm transition hover:bg-blue-50 hover:text-blue-600"
            >
              {item}
            </button>
          ))}

        </motion.div>

      </div>
    </section>
  );
}