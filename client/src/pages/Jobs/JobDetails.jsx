import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  motion,
} from "framer-motion";

import {
  FiMapPin,
  FiBriefcase,
  FiClock,
  FiDollarSign,
  FiArrowLeft,
  FiUsers,
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

import {
  getJobById,
} from "../../api/jobApi";

import {
  applyForJob,
} from "../../api/applicationApi";

import {
  useAuth,
} from "../../context/AuthContext";

import ROUTES from "../../constants/routes";

import toast from "react-hot-toast";


const JobDetails = () => {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const {
    user,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();


  const [job, setJob] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [applying, setApplying] =
    useState(false);

  const [isApplied, setIsApplied] =
    useState(false);


  /*
  |--------------------------------------------------------------------------
  | Fetch Job
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const fetchJob = async () => {

      try {

        setLoading(true);

        const response =
          await getJobById(id);

        setJob(
          response?.data || null
        );

      } catch (error) {

        toast.error(
          error?.response?.data?.message ||
          "Failed to load job"
        );

        navigate(
          "/jobs"
        );

      } finally {

        setLoading(false);

      }

    };

    if (id) {
      fetchJob();
    }

  }, [id, navigate]);


  /*
  |--------------------------------------------------------------------------
  | Apply For Job
  |--------------------------------------------------------------------------
  */

  const handleApply = async () => {

    /*
    |--------------------------------------------------------------------------
    | Authentication Check
    |--------------------------------------------------------------------------
    */

    if (!isAuthenticated) {

      toast.error(
        "Please login to apply for this job"
      );

      navigate(
        ROUTES.LOGIN
      );

      return;

    }


    /*
    |--------------------------------------------------------------------------
    | Role Check
    |--------------------------------------------------------------------------
    */

    if (user?.role !== "student") {

      toast.error(
        "Only students can apply for jobs"
      );

      return;

    }


    /*
    |--------------------------------------------------------------------------
    | Prevent Duplicate Click
    |--------------------------------------------------------------------------
    */

    if (
      applying ||
      isApplied
    ) {
      return;
    }


    try {

      setApplying(true);

      await applyForJob(id);

      setIsApplied(true);

      toast.success(
        "Application submitted successfully"
      );

    } catch (error) {

      toast.error(
        error?.response?.data?.message ||
        "Failed to apply for this job"
      );

    } finally {

      setApplying(false);

    }

  };


  /*
  |--------------------------------------------------------------------------
  | Loading State
  |--------------------------------------------------------------------------
  */

  if (loading) {

    return (

      <div className="min-h-screen bg-slate-50">

        <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">

          <div className="animate-pulse">

            <div className="mb-6 h-5 w-28 rounded bg-slate-200" />

            <div className="rounded-2xl bg-white p-8 shadow-sm">

              <div className="h-9 w-2/3 rounded bg-slate-200" />

              <div className="mt-4 h-5 w-1/3 rounded bg-slate-200" />

              <div className="mt-8 grid gap-4 sm:grid-cols-2">

                <div className="h-5 rounded bg-slate-200" />
                <div className="h-5 rounded bg-slate-200" />
                <div className="h-5 rounded bg-slate-200" />
                <div className="h-5 rounded bg-slate-200" />

              </div>

              <div className="mt-10 h-6 w-48 rounded bg-slate-200" />

              <div className="mt-5 space-y-3">

                <div className="h-4 rounded bg-slate-200" />
                <div className="h-4 rounded bg-slate-200" />
                <div className="h-4 w-5/6 rounded bg-slate-200" />

              </div>

            </div>

          </div>

        </div>

      </div>

    );

  }


  /*
  |--------------------------------------------------------------------------
  | No Job
  |--------------------------------------------------------------------------
  */

  if (!job) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">

        <div className="text-center">

          <FiAlertCircle className="mx-auto text-5xl text-slate-400" />

          <h2 className="mt-4 text-xl font-semibold text-slate-900">
            Job not found
          </h2>

          <p className="mt-2 text-slate-500">
            This job may no longer be available.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/jobs")
            }
            className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
          >
            Browse Jobs
          </button>

        </div>

      </div>

    );

  }


  /*
  |--------------------------------------------------------------------------
  | Helpers
  |--------------------------------------------------------------------------
  */

  const formatLabel = (
    value
  ) => {

    if (!value) {
      return "Not specified";
    }

    return value
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );

  };


  const formatSalary = () => {

    if (!job.salary) {
      return "Not specified";
    }

    const min =
      job.salary.min;

    const max =
      job.salary.max;

    if (
      min !== undefined &&
      max !== undefined
    ) {

      return `₹${Number(min).toLocaleString(
        "en-IN"
      )} - ₹${Number(max).toLocaleString(
        "en-IN"
      )}`;

    }

    if (
      min !== undefined
    ) {

      return `₹${Number(min).toLocaleString(
        "en-IN"
      )}+`;

    }

    if (
      max !== undefined
    ) {

      return `Up to ₹${Number(max).toLocaleString(
        "en-IN"
      )}`;

    }

    return "Not specified";

  };


  const formatDate = (
    date
  ) => {

    if (!date) {
      return null;
    }

    const parsedDate =
      new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return null;
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );

  };


  const deadline =
    formatDate(
      job.applicationDeadline
    );


  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (

    <div className="min-h-screen bg-slate-50">


      {/* ================================================================
          HEADER
      ================================================================= */}

      <section className="border-b bg-white">

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

          {/* Back */}

          <motion.button
            type="button"
            initial={{
              opacity: 0,
              x: -10,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            onClick={() =>
              navigate("/jobs")
            }
            className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
          >

            <FiArrowLeft />

            Back to Jobs

          </motion.button>


          {/* Job Header */}

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
            className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between"
          >

            <div>

              <div className="mb-4 flex flex-wrap items-center gap-2">

                {job.status && (

                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold capitalize text-green-700">
                    {formatLabel(
                      job.status
                    )}
                  </span>

                )}

                {job.workMode && (

                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
                    {formatLabel(
                      job.workMode
                    )}
                  </span>

                )}

              </div>


              <h1 className="text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
                {job.title}
              </h1>


              <p className="mt-3 text-lg font-medium text-slate-500">
                {job.company}
              </p>


              {job.recruiter?.name && (

                <p className="mt-2 text-sm text-slate-400">
                  Posted by {job.recruiter.name}
                </p>

              )}

            </div>

          </motion.div>

        </div>

      </section>


      {/* ================================================================
          CONTENT
      ================================================================= */}

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">


          {/* ============================================================
              MAIN CONTENT
          ============================================================= */}

          <main className="space-y-6">


            {/* Job Overview */}

            <motion.section
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.1,
                duration: 0.5,
              }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
            >

              <h2 className="text-xl font-semibold text-slate-900">
                Job Overview
              </h2>


              <div className="mt-6 grid gap-5 sm:grid-cols-2">

                {/* Location */}

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <FiMapPin className="text-blue-600" />
                  </div>

                  <div>

                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Location
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {job.location ||
                        "Not specified"}
                    </p>

                  </div>

                </div>


                {/* Job Type */}

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <FiBriefcase className="text-blue-600" />
                  </div>

                  <div>

                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Job Type
                    </p>

                    <p className="mt-1 text-sm font-medium capitalize text-slate-800">
                      {formatLabel(
                        job.jobType
                      )}
                    </p>

                  </div>

                </div>


                {/* Work Mode */}

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <FiClock className="text-blue-600" />
                  </div>

                  <div>

                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Work Mode
                    </p>

                    <p className="mt-1 text-sm font-medium capitalize text-slate-800">
                      {formatLabel(
                        job.workMode
                      )}
                    </p>

                  </div>

                </div>


                {/* Experience */}

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <FiUsers className="text-blue-600" />
                  </div>

                  <div>

                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Experience
                    </p>

                    <p className="mt-1 text-sm font-medium capitalize text-slate-800">
                      {formatLabel(
                        job.experienceLevel
                      )}
                    </p>

                  </div>

                </div>


                {/* Salary */}

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <FiDollarSign className="text-blue-600" />
                  </div>

                  <div>

                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Salary
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {formatSalary()}
                    </p>

                  </div>

                </div>


                {/* Openings */}

                {job.openings !== undefined && (

                  <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                      <FiUsers className="text-blue-600" />
                    </div>

                    <div>

                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Openings
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-800">
                        {job.openings}
                      </p>

                    </div>

                  </div>

                )}

              </div>

            </motion.section>


            {/* Description */}

            <motion.section
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.2,
                duration: 0.5,
              }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
            >

              <h2 className="text-xl font-semibold text-slate-900">
                Job Description
              </h2>

              <div className="mt-5">

                <p className="whitespace-pre-line text-sm leading-7 text-slate-600 md:text-base">
                  {job.description ||
                    "No job description provided."}
                </p>

              </div>

            </motion.section>


            {/* Skills */}

            {Array.isArray(job.skills) &&
              job.skills.length > 0 && (

                <motion.section
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.3,
                    duration: 0.5,
                  }}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8"
                >

                  <h2 className="text-xl font-semibold text-slate-900">
                    Required Skills
                  </h2>

                  <div className="mt-5 flex flex-wrap gap-2">

                    {job.skills.map(
                      (skill) => (

                        <span
                          key={skill}
                          className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"
                        >
                          {skill}
                        </span>

                      )
                    )}

                  </div>

                </motion.section>

              )}


          </main>


          {/* ============================================================
              SIDEBAR
          ============================================================= */}

          <aside className="h-fit lg:sticky lg:top-6">


            <motion.div
              initial={{
                opacity: 0,
                x: 20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay: 0.2,
                duration: 0.5,
              }}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >

              <h2 className="text-lg font-semibold text-slate-900">
                Interested in this job?
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Apply now and take the next step toward your career.
              </p>


              {/* Deadline */}

              {deadline && (

                <div className="mt-6 flex items-start gap-3 rounded-xl bg-slate-50 p-4">

                  <FiCalendar className="mt-0.5 shrink-0 text-slate-500" />

                  <div>

                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Application Deadline
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-800">
                      {deadline}
                    </p>

                  </div>

                </div>

              )}


              {/* Apply */}

              {user?.role === "student" ||
              !isAuthenticated ? (

                <button
                  type="button"
                  onClick={handleApply}
                  disabled={
                    applying ||
                    isApplied ||
                    authLoading
                  }
                  className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-semibold text-white transition ${
                    isApplied
                      ? "cursor-not-allowed bg-green-600"
                      : applying ||
                        authLoading
                      ? "cursor-not-allowed bg-slate-400"
                      : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
                  }`}
                >

                  {isApplied ? (
                    <>
                      <FiCheckCircle />

                      Applied
                    </>
                  ) : applying ? (
                    "Applying..."
                  ) : authLoading ? (
                    "Checking..."
                  ) : (
                    "Apply Now"
                  )}

                </button>

              ) : null}


              {/* Non-student */}

              {isAuthenticated &&
                user?.role !== "student" && (

                  <div className="mt-6 rounded-xl bg-slate-50 p-4 text-center">

                    <p className="text-sm text-slate-500">
                      Only student accounts can apply for jobs.
                    </p>

                  </div>

                )}


              {/* Browse jobs */}

              <button
                type="button"
                onClick={() =>
                  navigate("/jobs")
                }
                className="mt-3 w-full rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Browse More Jobs
              </button>

            </motion.div>


            {/* Recruiter */}

            {job.recruiter && (

              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.35,
                  duration: 0.5,
                }}
                className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >

                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Recruiter
                </p>

                <p className="mt-2 font-semibold text-slate-900">
                  {job.recruiter.name ||
                    "Recruiter"}
                </p>

              </motion.div>

            )}

          </aside>

        </div>

      </div>

    </div>

  );
};

export default JobDetails;