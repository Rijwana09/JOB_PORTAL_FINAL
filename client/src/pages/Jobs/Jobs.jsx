import {
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "react-router-dom";

import {
  motion,
} from "framer-motion";

import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiSliders,
  FiX,
} from "react-icons/fi";

import JobCard from "../../components/Job/JobCard";

import {
  getJobs,
} from "../../api/jobApi";

import toast from "react-hot-toast";


const Jobs = () => {

  /*
  |--------------------------------------------------------------------------
  | URL Search Params
  |--------------------------------------------------------------------------
  */

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();


  /*
  |--------------------------------------------------------------------------
  | State
  |--------------------------------------------------------------------------
  */

  const [jobs, setJobs] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState(
      searchParams.get("search") || ""
    );

  const [submittedSearch, setSubmittedSearch] =
    useState(
      searchParams.get("search") || ""
    );

  const [location, setLocation] =
    useState(
      searchParams.get("location") || ""
    );

  const [jobType, setJobType] =
    useState("");

  const [workMode, setWorkMode] =
    useState("");

  const [
    experienceLevel,
    setExperienceLevel,
  ] = useState("");

  const [skills, setSkills] =
    useState("");

  const [minSalary, setMinSalary] =
    useState("");

  const [maxSalary, setMaxSalary] =
    useState("");

  const [sortBy, setSortBy] =
    useState("createdAt");

  const [sortOrder, setSortOrder] =
    useState("desc");

  const [page, setPage] =
    useState(1);

  const [mobileFiltersOpen, setMobileFiltersOpen] =
    useState(false);

  const [pagination, setPagination] =
    useState({
      currentPage: 1,
      totalPages: 1,
      totalJobs: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    });


  /*
  |--------------------------------------------------------------------------
  | Fetch Jobs
  |--------------------------------------------------------------------------
  */

  const fetchJobs = async () => {

    try {

      setLoading(true);

      const response = await getJobs({

        search:
          submittedSearch.trim() || undefined,

        location:
          location.trim() || undefined,

        jobType:
          jobType || undefined,

        workMode:
          workMode || undefined,

        experienceLevel:
          experienceLevel || undefined,

        skills:
          skills.trim() || undefined,

        minSalary:
          minSalary !== ""
            ? minSalary
            : undefined,

        maxSalary:
          maxSalary !== ""
            ? maxSalary
            : undefined,

        sortBy,

        sortOrder,

        page,

        limit: 10,

      });


      const responseData =
        response?.data;

      if (!responseData) {

        setJobs([]);

        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalJobs: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        });

        return;
      }


      setJobs(
        Array.isArray(
          responseData.jobs
        )
          ? responseData.jobs
          : []
      );


      setPagination(
        responseData.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalJobs: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        }
      );

    } catch (error) {

      console.error(
        "Failed to fetch jobs:",
        error
      );

      setJobs([]);

      toast.error(
        error?.response?.data?.message ||
        "Failed to fetch jobs"
      );

    } finally {

      setLoading(false);

    }

  };


  /*
  |--------------------------------------------------------------------------
  | Load Jobs
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    fetchJobs();

  }, [
    page,
    submittedSearch,
    location,
    jobType,
    workMode,
    experienceLevel,
    skills,
    minSalary,
    maxSalary,
    sortBy,
    sortOrder,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Search Submit
  |--------------------------------------------------------------------------
  */

  const handleSearch = (e) => {

    e.preventDefault();

    const trimmedSearch =
      search.trim();

    setPage(1);

    setSubmittedSearch(
      trimmedSearch
    );

    const params = {};

    if (trimmedSearch) {
      params.search =
        trimmedSearch;
    }

    if (location.trim()) {
      params.location =
        location.trim();
    }

    setSearchParams(params);

  };


  /*
  |--------------------------------------------------------------------------
  | Sorting
  |--------------------------------------------------------------------------
  */

  const handleSortChange = (
    value
  ) => {

    const [
      newSortBy,
      newSortOrder,
    ] = value.split("-");

    setSortBy(
      newSortBy
    );

    setSortOrder(
      newSortOrder
    );

    setPage(1);

  };


  /*
  |--------------------------------------------------------------------------
  | Clear Filters
  |--------------------------------------------------------------------------
  */

  const clearFilters = () => {

    setSearch("");
    setSubmittedSearch("");

    setLocation("");

    setJobType("");

    setWorkMode("");

    setExperienceLevel("");

    setSkills("");

    setMinSalary("");

    setMaxSalary("");

    setSortBy("createdAt");

    setSortOrder("desc");

    setPage(1);

    setSearchParams({});

    setMobileFiltersOpen(false);

  };


  /*
  |--------------------------------------------------------------------------
  | Active Filter Count
  |--------------------------------------------------------------------------
  */

  const activeFilterCount = [
    jobType,
    workMode,
    experienceLevel,
    skills,
    minSalary,
    maxSalary,
  ].filter(Boolean).length;


  /*
  |--------------------------------------------------------------------------
  | Filters
  |--------------------------------------------------------------------------
  */

  const Filters = () => (

    <div>

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-2">

          <FiSliders className="shrink-0 text-blue-600" />

          <h2 className="text-lg font-semibold text-slate-900">
            Filters
          </h2>

        </div>

        {activeFilterCount > 0 && (
          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
            {activeFilterCount}
          </span>
        )}

      </div>


      {/* Job Type */}

      <div className="mt-5">

        <label
          htmlFor="jobType"
          className="text-sm font-medium text-slate-700"
        >
          Job Type
        </label>

        <select
          id="jobType"
          value={jobType}
          onChange={(e) => {

            setJobType(
              e.target.value
            );

            setPage(1);

          }}
          className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >

          <option value="">
            All
          </option>

          <option value="full-time">
            Full Time
          </option>

          <option value="part-time">
            Part Time
          </option>

          <option value="internship">
            Internship
          </option>

          <option value="contract">
            Contract
          </option>

          <option value="freelance">
            Freelance
          </option>

        </select>

      </div>


      {/* Work Mode */}

      <div className="mt-5">

        <label
          htmlFor="workMode"
          className="text-sm font-medium text-slate-700"
        >
          Work Mode
        </label>

        <select
          id="workMode"
          value={workMode}
          onChange={(e) => {

            setWorkMode(
              e.target.value
            );

            setPage(1);

          }}
          className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >

          <option value="">
            All
          </option>

          <option value="remote">
            Remote
          </option>

          <option value="hybrid">
            Hybrid
          </option>

          <option value="on-site">
            On-site
          </option>

        </select>

      </div>


      {/* Experience */}

      <div className="mt-5">

        <label
          htmlFor="experienceLevel"
          className="text-sm font-medium text-slate-700"
        >
          Experience
        </label>

        <select
          id="experienceLevel"
          value={experienceLevel}
          onChange={(e) => {

            setExperienceLevel(
              e.target.value
            );

            setPage(1);

          }}
          className="mt-2 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >

          <option value="">
            All
          </option>

          <option value="fresher">
            Fresher
          </option>

          <option value="entry-level">
            Entry Level
          </option>

          <option value="mid-level">
            Mid Level
          </option>

          <option value="senior-level">
            Senior Level
          </option>

        </select>

      </div>


      {/* Skills */}

      <div className="mt-5">

        <label
          htmlFor="skills"
          className="text-sm font-medium text-slate-700"
        >
          Skills
        </label>

        <input
          id="skills"
          type="text"
          placeholder="e.g. React, Node.js"
          value={skills}
          onChange={(e) => {

            setSkills(
              e.target.value
            );

            setPage(1);

          }}
          className="mt-2 min-h-11 w-full min-w-0 rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <p className="mt-1 text-xs leading-5 text-slate-400">
          Separate multiple skills with commas
        </p>

      </div>


      {/* Salary */}

      <div className="mt-5">

        <label className="text-sm font-medium text-slate-700">
          Salary Range
        </label>

        <div className="mt-2 grid grid-cols-2 gap-2">

          <input
            type="number"
            min="0"
            placeholder="Min"
            value={minSalary}
            onChange={(e) => {

              setMinSalary(
                e.target.value
              );

              setPage(1);

            }}
            className="min-h-11 w-full min-w-0 rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          />

          <input
            type="number"
            min="0"
            placeholder="Max"
            value={maxSalary}
            onChange={(e) => {

              setMaxSalary(
                e.target.value
              );

              setPage(1);

            }}
            className="min-h-11 w-full min-w-0 rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          />

        </div>

        <p className="mt-1 text-xs text-slate-400">
          Annual salary in INR
        </p>

      </div>


      {/* Clear */}

      {activeFilterCount > 0 && (

        <button
          type="button"
          onClick={clearFilters}
          className="mt-6 flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >

          <FiX />

          Clear Filters

        </button>

      )}

    </div>

  );


  return (

    <div className="min-h-screen overflow-x-hidden bg-slate-50">


      {/* ================================================================
          HEADER
      ================================================================= */}

      <section className="border-b bg-white">

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
          >

            <h1 className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl md:text-4xl">
              Find Your Dream Job
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Search and filter opportunities that match your skills.
            </p>

          </motion.div>


          {/* Search */}

          <motion.form
            onSubmit={handleSearch}
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.15,
              duration: 0.5,
            }}
            className="mt-6 flex flex-col gap-3 sm:mt-7 lg:flex-row"
          >

            {/* Search Input */}

            <div className="relative min-w-0 flex-1">

              <FiSearch
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search jobs, skills, companies..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="min-h-12 w-full min-w-0 rounded-xl border border-slate-300 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>


            {/* Location */}

            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => {

                setLocation(
                  e.target.value
                );

                setPage(1);

              }}
              className="min-h-12 w-full min-w-0 rounded-xl border border-slate-300 px-4 py-3.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 lg:w-60"
            />


            {/* Search Button */}

            <button
              type="submit"
              className="min-h-12 w-full rounded-xl bg-blue-600 px-7 py-3.5 font-medium text-white transition hover:bg-blue-700 active:scale-[0.98] lg:w-auto"
            >
              Search
            </button>

          </motion.form>

        </div>

      </section>


      {/* ================================================================
          CONTENT
      ================================================================= */}

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">


        {/* ==============================================================
            MOBILE FILTERS
        ============================================================== */}

        <div className="mb-5 lg:hidden">

          <button
            type="button"
            onClick={() =>
              setMobileFiltersOpen(
                !mobileFiltersOpen
              )
            }
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >

            <FiSliders />

            <span>
              Filters
            </span>

            {activeFilterCount > 0 && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                {activeFilterCount}
              </span>
            )}

          </button>


          {mobileFiltersOpen && (

            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              className="mt-3 overflow-hidden rounded-xl bg-white p-4 shadow-sm sm:p-5"
            >

              <Filters />

            </motion.div>

          )}

        </div>


        <div className="grid min-w-0 gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">


          {/* ============================================================
              DESKTOP FILTERS
          ============================================================= */}

          <aside className="hidden rounded-xl bg-white p-5 shadow-sm lg:block">

            <Filters />

          </aside>


          {/* ============================================================
              JOBS
          ============================================================= */}

          <main className="min-w-0">

            {/* Results + Sort */}

            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-sm text-slate-500">

                {pagination.totalJobs}

                {" "}

                {pagination.totalJobs === 1
                  ? "job"
                  : "jobs"}{" "}

                found

              </p>


              {/* Sort */}

              <div className="flex min-w-0 items-center gap-2">

                <label
                  htmlFor="sort"
                  className="shrink-0 text-sm font-medium text-slate-700"
                >
                  Sort by:
                </label>

                <select
                  id="sort"
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) =>
                    handleSortChange(
                      e.target.value
                    )
                  }
                  className="min-h-10 min-w-0 max-w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                >

                  <option value="createdAt-desc">
                    Newest
                  </option>

                  <option value="createdAt-asc">
                    Oldest
                  </option>

                  <option value="title-asc">
                    Job Title A-Z
                  </option>

                  <option value="title-desc">
                    Job Title Z-A
                  </option>

                  <option value="company-asc">
                    Company A-Z
                  </option>

                  <option value="company-desc">
                    Company Z-A
                  </option>

                </select>

              </div>

            </div>


            {/* Loading */}

            {loading ? (

              <div className="grid gap-4 sm:gap-5 md:grid-cols-2">

                {[1, 2, 3, 4].map(
                  (item) => (

                    <div
                      key={item}
                      className="h-64 animate-pulse rounded-xl bg-white shadow-sm"
                    />

                  )
                )}

              </div>

            ) : jobs.length === 0 ? (

              /* Empty */

              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="rounded-xl bg-white px-4 py-16 text-center shadow-sm sm:px-6 sm:py-20"
              >

                <div className="mx-auto max-w-md">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 sm:h-16 sm:w-16">

                    <FiSearch className="text-xl text-slate-400 sm:text-2xl" />

                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-slate-900">
                    No jobs found
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    We couldn't find jobs matching your current
                    search or filters.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-6 min-h-11 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                  >
                    Clear Filters
                  </button>

                </div>

              </motion.div>

            ) : (

              /* Jobs */

              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  duration: 0.4,
                }}
                className="grid min-w-0 gap-4 sm:gap-5 md:grid-cols-2"
              >

                {jobs.map(
                  (job, index) => (

                    <motion.div
                      key={job._id}
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay:
                          index * 0.05,
                      }}
                      className="min-w-0"
                    >

                      <JobCard
                        job={job}
                      />

                    </motion.div>

                  )
                )}

              </motion.div>

            )}


            {/* ==========================================================
                PAGINATION
            =========================================================== */}

            {!loading &&
              pagination.totalPages > 1 && (

                <div className="mt-8 flex items-center justify-center gap-3 sm:gap-4">

                  <button
                    type="button"
                    disabled={
                      !pagination.hasPreviousPage
                    }
                    onClick={() => {

                      if (
                        pagination.hasPreviousPage
                      ) {

                        setPage(
                          pagination.currentPage - 1
                        );

                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });

                      }

                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Previous page"
                  >

                    <FiChevronLeft />

                  </button>


                  <span className="whitespace-nowrap text-sm text-slate-600">

                    Page{" "}

                    <span className="font-semibold text-slate-900">
                      {pagination.currentPage}
                    </span>

                    {" "}of{" "}

                    <span className="font-semibold text-slate-900">
                      {pagination.totalPages}
                    </span>

                  </span>


                  <button
                    type="button"
                    disabled={
                      !pagination.hasNextPage
                    }
                    onClick={() => {

                      if (
                        pagination.hasNextPage
                      ) {

                        setPage(
                          pagination.currentPage + 1
                        );

                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });

                      }

                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 bg-white transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Next page"
                  >

                    <FiChevronRight />

                  </button>

                </div>

              )}

          </main>

        </div>

      </div>

    </div>

  );

};

export default Jobs;