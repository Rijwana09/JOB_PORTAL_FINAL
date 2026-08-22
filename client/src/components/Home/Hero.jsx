import { useState } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaMapMarkerAlt, FaArrowRight } from "react-icons/fa";
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

  return (
    <section className="relative overflow-hidden bg-slate-50 py-20 md:py-28">

      {/* Background decoration */}
      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-100 opacity-50 blur-3xl" />

      <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-indigo-100 opacity-50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">

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

          <div className="mb-5 inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            Find your next opportunity
          </div>

          <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl md:text-6xl">

            Find Your

            <span className="block text-blue-600">
              Dream Job
            </span>

          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
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
          className="mx-auto mt-10 max-w-5xl rounded-2xl border border-slate-200 bg-white p-3 shadow-xl"
        >

          <div className="flex flex-col gap-3 lg:flex-row">

            {/* Search input */}
            <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 transition focus-within:border-blue-500">

              <FaSearch className="shrink-0 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Job title, skill or keyword"
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />

            </div>

            {/* Location input */}
            <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 transition focus-within:border-blue-500">

              <FaMapMarkerAlt className="shrink-0 text-slate-400" />

              <input
                type="text"
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                placeholder="Location"
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />

            </div>

            {/* Search button */}
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-7 py-3 font-medium text-white transition hover:bg-blue-700 active:scale-[0.98]"
            >
              Search
              <FaArrowRight className="text-sm" />
            </button>

          </div>

        </motion.form>

        {/* Popular searches */}
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
          className="mx-auto mt-6 flex max-w-4xl flex-wrap justify-center gap-2 text-sm"
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
              onClick={() => {
                setSearch(item);

                navigate(
                  `/jobs?search=${encodeURIComponent(item)}`
                );
              }}
              className="rounded-full bg-white px-3 py-1.5 text-slate-600 shadow-sm transition hover:bg-blue-50 hover:text-blue-600"
            >
              {item}
            </button>
          ))}

        </motion.div>

      </div>
    </section>
  );
}