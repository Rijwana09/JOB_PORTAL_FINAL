import {
  useEffect,
  useState,
} from "react";

import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import JobCard from "../../components/Job/JobCard";

import { getJobs } from "../../api/jobApi";

import toast from "react-hot-toast";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [submittedSearch, setSubmittedSearch] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [jobType, setJobType] =
    useState("");

  const [workMode, setWorkMode] =
    useState("");

  const [
    experienceLevel,
    setExperienceLevel,
  ] = useState("");

  const [page, setPage] =
    useState(1);

  const [skills, setSkills] =
  useState("");

  const [sortBy, setSortBy] =
    useState("createdAt");

  const [sortOrder, setSortOrder] =
    useState("desc");

  const [pagination, setPagination] =
    useState({
      currentPage: 1,
      totalPages: 1,
      totalJobs: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    });

  const [minSalary, setMinSalary] =
    useState("");

  const [maxSalary, setMaxSalary] =
    useState("");



  /*
  |--------------------------------------------------------------------------
  | Fetch Jobs
  |--------------------------------------------------------------------------
  */

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const response = await getJobs({
        search:submittedSearch || undefined,

        location:location || undefined,

        jobType:jobType || undefined,

        workMode:workMode || undefined,

        experienceLevel:experienceLevel || undefined,

        skills: skills || undefined,

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

      setJobs(
        response.data.jobs
      );

      setPagination(
        response.data.pagination
      );

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
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

    setPage(1);

    setSubmittedSearch(search.trim());
  };

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
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-10">

          <h1 className="text-3xl font-bold text-gray-900">
            Find Your Dream Job
          </h1>

          <p className="mt-2 text-gray-500">
            Search thousands of jobs and
            find the right opportunity.
          </p>

          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="mt-6 flex flex-col gap-3 md:flex-row"
          >

            <div className="relative flex-1">
              <FiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
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
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none focus:border-blue-500"
              />
            </div>

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
              className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 md:w-56"
            />

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
            >
              Search
            </button>

          </form>

        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8">

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">

          {/* Filters */}
          <aside className="rounded-xl bg-white p-5 shadow-sm">

            <h2 className="text-lg font-semibold">
              Filters
            </h2>

            {/* Job Type */}
            <div className="mt-5">
              <label className="text-sm font-medium">
                Job Type
              </label>

              <select
                value={jobType}
                onChange={(e) => {
                  setJobType(
                    e.target.value
                  );
                  setPage(1);
                }}
                className="mt-2 w-full rounded-lg border px-3 py-2"
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
              <label className="text-sm font-medium">
                Work Mode
              </label>

              <select
                value={workMode}
                onChange={(e) => {
                  setWorkMode(
                    e.target.value
                  );
                  setPage(1);
                }}
                className="mt-2 w-full rounded-lg border px-3 py-2"
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
              <label className="text-sm font-medium">
                Experience
              </label>

              <select
                value={experienceLevel}
                onChange={(e) => {
                  setExperienceLevel(
                    e.target.value
                  );
                  setPage(1);
                }}
                className="mt-2 w-full rounded-lg border px-3 py-2"
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
            <label className="text-sm font-medium">
              Skills
            </label>

            <input
              type="text"
              placeholder="e.g. React, Node.js"
              value={skills}
              onChange={(e) => {
                setSkills(e.target.value);
                setPage(1);
              }}
              className="mt-2 w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
            />

            <p className="mt-1 text-xs text-gray-400">
              Separate multiple skills with commas
            </p>
          </div>

            {/* Salary Range */}

            <div className="mt-5">
              <label className="text-sm font-medium">
                Salary Range
              </label>

              <div className="mt-2 grid grid-cols-2 gap-2">

                <input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={minSalary}
                  onChange={(e) => {
                    setMinSalary(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
                />

                <input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={maxSalary}
                  onChange={(e) => {
                    setMaxSalary(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:border-blue-500"
                />

              </div>

              <p className="mt-1 text-xs text-gray-400">
                Enter annual salary in INR
              </p>
            </div>

            <button
                type="button"
                onClick={clearFilters}
                className="mt-6 w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                Clear Filters
            </button>

          </aside>

          {/* Jobs */}
          <main>

            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <p className="text-sm text-gray-500">
                  {pagination.totalJobs} jobs found
                </p>

                <div className="flex items-center gap-2">

                  <label
                    htmlFor="sort"
                    className="text-sm font-medium text-gray-700"
                  >
                    Sort by:
                  </label>

                  <select
                    id="sort"
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) =>
                      handleSortChange(e.target.value)
                    }
                    className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
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

            {loading ? (
              <div className="py-20 text-center">
                <p className="text-gray-500">
                  Loading jobs...
                </p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="rounded-xl bg-white py-20 text-center shadow-sm">
                <h3 className="text-lg font-semibold">
                  No jobs found
                </h3>

                <p className="mt-2 text-gray-500">
                  Try changing your search
                  or filters.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2">

                {jobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                  />
                ))}

              </div>
            )}

            {/* Pagination */}

              {pagination.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-4">

                  <button
                    type="button"
                    disabled={
                      !pagination.hasPreviousPage
                    }
                    onClick={() => {
                      if (pagination.hasPreviousPage) {
                        setPage(
                          pagination.currentPage - 1
                        );
                      }
                    }}
                    className="rounded-lg border p-2 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Previous page"
                  >
                    <FiChevronLeft />
                  </button>

                  <span className="text-sm text-gray-600">
                    Page{" "}
                    <span className="font-medium text-gray-900">
                      {pagination.currentPage}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-gray-900">
                      {pagination.totalPages}
                    </span>
                  </span>

                  <button
                    type="button"
                    disabled={
                      !pagination.hasNextPage
                    }
                    onClick={() => {
                      if (pagination.hasNextPage) {
                        setPage(
                          pagination.currentPage + 1
                        );
                      }
                    }}
                    className="rounded-lg border p-2 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
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