import {
  useEffect,
  useState,
} from "react";

import {
  FiBriefcase,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiEye,
  FiCheckCircle,
  FiFileText,
  FiRefreshCw,
  FiMapPin,
  FiClock,
} from "react-icons/fi";

import {
  Link,
} from "react-router-dom";

import {
  motion,
} from "framer-motion";

import toast from "react-hot-toast";

import {
  getMyJobs,
  deleteJob,
  updateJob,
} from "../../api/jobApi";


const RecruiterDashboard = () => {

  const [jobs, setJobs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [deletingId, setDeletingId] =
    useState(null);

  const [updatingStatusId, setUpdatingStatusId] =
    useState(null);


  /*
  |--------------------------------------------------------------------------
  | Fetch Recruiter's Jobs
  |--------------------------------------------------------------------------
  */

  const fetchMyJobs = async () => {

    try {

      setLoading(true);

      const response =
        await getMyJobs({
          limit: 100,
        });

      const jobList =
        response?.data?.jobs || [];

      if (!Array.isArray(jobList)) {

        throw new Error(
          "Invalid jobs response"
        );

      }

      setJobs(jobList);

    } catch (error) {

      console.error(
        "Failed to fetch recruiter jobs:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to fetch your jobs"
      );

    } finally {

      setLoading(false);

    }

  };


  /*
  |--------------------------------------------------------------------------
  | Initial Load
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    fetchMyJobs();

  }, []);


  /*
  |--------------------------------------------------------------------------
  | Delete Job
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (
    jobId
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this job?"
      );

    if (!confirmed) {
      return;
    }

    try {

      setDeletingId(jobId);

      await deleteJob(jobId);

      toast.success(
        "Job deleted successfully"
      );

      setJobs((prevJobs) =>
        prevJobs.filter(
          (job) =>
            job._id !== jobId
        )
      );

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
          "Failed to delete job"
      );

    } finally {

      setDeletingId(null);

    }

  };


  /*
  |--------------------------------------------------------------------------
  | Update Job Status
  |--------------------------------------------------------------------------
  */

  const handleStatusChange = async (
    jobId,
    newStatus
  ) => {

    try {

      setUpdatingStatusId(jobId);

      await updateJob(
        jobId,
        {
          status: newStatus,
        }
      );

      toast.success(
        "Job status updated successfully"
      );

      setJobs((prevJobs) =>
        prevJobs.map(
          (job) =>
            job._id === jobId
              ? {
                  ...job,
                  status: newStatus,
                }
              : job
        )
      );

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
          "Failed to update job status"
      );

    } finally {

      setUpdatingStatusId(null);

    }

  };


  /*
  |--------------------------------------------------------------------------
  | Statistics
  |--------------------------------------------------------------------------
  */

  const totalJobs =
    jobs.length;

  const publishedJobs =
    jobs.filter(
      (job) =>
        job.status === "published"
    ).length;

  const draftJobs =
    jobs.filter(
      (job) =>
        job.status === "draft"
    ).length;

  const closedJobs =
    jobs.filter(
      (job) =>
        job.status === "closed"
    ).length;


  /*
  |--------------------------------------------------------------------------
  | Status Badge
  |--------------------------------------------------------------------------
  */

  const getStatusStyle = (
    status
  ) => {

    switch (status) {

      case "published":
        return "bg-green-50 text-green-700";

      case "draft":
        return "bg-yellow-50 text-yellow-700";

      case "closed":
        return "bg-gray-100 text-gray-600";

      default:
        return "bg-gray-100 text-gray-600";

    }

  };


  /*
  |--------------------------------------------------------------------------
  | Loading State
  |--------------------------------------------------------------------------
  */

  if (loading) {

    return (

      <div className="min-h-screen bg-gray-50">

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

          <div className="animate-pulse">

            {/* Header Skeleton */}

            <div className="h-8 w-56 rounded bg-gray-200 sm:w-64" />

            <div className="mt-3 h-4 w-full max-w-md rounded bg-gray-200" />


            {/* Button Skeleton */}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">

              <div className="h-11 w-full rounded-lg bg-gray-200 sm:w-28" />

              <div className="h-11 w-full rounded-lg bg-gray-200 sm:w-36" />

            </div>


            {/* Stats Skeleton */}

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">

              {[1, 2, 3, 4].map(
                (item) => (

                  <div
                    key={item}
                    className="rounded-xl bg-white p-5 shadow-sm sm:p-6"
                  >

                    <div className="h-10 w-10 rounded-lg bg-gray-200" />

                    <div className="mt-5 h-4 w-24 rounded bg-gray-200" />

                    <div className="mt-2 h-8 w-16 rounded bg-gray-200" />

                  </div>

                )
              )}

            </div>


            {/* Jobs Skeleton */}

            <div className="mt-8 rounded-xl bg-white p-5 shadow-sm sm:p-6">

              <div className="h-6 w-32 rounded bg-gray-200" />

              <div className="mt-6 space-y-4">

                {[1, 2, 3].map(
                  (item) => (

                    <div
                      key={item}
                      className="h-32 rounded-lg bg-gray-100"
                    />

                  )
                )}

              </div>

            </div>

          </div>

        </div>

      </div>

    );

  }


  /*
  |--------------------------------------------------------------------------
  | Dashboard
  |--------------------------------------------------------------------------
  */

  return (

    <div className="min-h-screen bg-gray-50">

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">


        {/* ================================================================
            HEADER
        ================================================================= */}

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
            duration: 0.4,
          }}
          className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"
        >

          {/* Title */}

          <div>

            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Recruiter Dashboard
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
              Manage your job postings and hiring opportunities.
            </p>

          </div>


          {/* Actions */}

          <div className="grid grid-cols-2 gap-3 sm:flex">

            <button
              type="button"
              onClick={fetchMyJobs}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 active:scale-[0.98] sm:px-4"
            >

              <FiRefreshCw />

              <span>
                Refresh
              </span>

            </button>


            <Link
              to="/recruiter/jobs/create"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-3 text-sm font-medium text-white transition hover:bg-blue-700 active:scale-[0.98] sm:px-5"
            >

              <FiPlus />

              <span>
                Post a Job
              </span>

            </Link>

          </div>

        </motion.div>


        {/* ================================================================
            STATISTICS
        ================================================================= */}

        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">


          {/* Total */}

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
              delay: 0.1,
            }}
            className="rounded-xl bg-white p-5 shadow-sm sm:p-6"
          >

            <div className="flex items-center justify-between gap-4">

              <div>

                <p className="text-sm text-gray-500">
                  Total Jobs
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                  {totalJobs}
                </p>

              </div>

              <div className="shrink-0 rounded-xl bg-blue-50 p-3 text-blue-600">

                <FiBriefcase className="text-xl" />

              </div>

            </div>

          </motion.div>


          {/* Published */}

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
              delay: 0.15,
            }}
            className="rounded-xl bg-white p-5 shadow-sm sm:p-6"
          >

            <div className="flex items-center justify-between gap-4">

              <div>

                <p className="text-sm text-gray-500">
                  Published
                </p>

                <p className="mt-2 text-2xl font-bold text-green-600 sm:text-3xl">
                  {publishedJobs}
                </p>

              </div>

              <div className="shrink-0 rounded-xl bg-green-50 p-3 text-green-600">

                <FiCheckCircle className="text-xl" />

              </div>

            </div>

          </motion.div>


          {/* Drafts */}

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
              delay: 0.2,
            }}
            className="rounded-xl bg-white p-5 shadow-sm sm:p-6"
          >

            <div className="flex items-center justify-between gap-4">

              <div>

                <p className="text-sm text-gray-500">
                  Drafts
                </p>

                <p className="mt-2 text-2xl font-bold text-yellow-600 sm:text-3xl">
                  {draftJobs}
                </p>

              </div>

              <div className="shrink-0 rounded-xl bg-yellow-50 p-3 text-yellow-600">

                <FiFileText className="text-xl" />

              </div>

            </div>

          </motion.div>


          {/* Closed */}

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
              delay: 0.25,
            }}
            className="rounded-xl bg-white p-5 shadow-sm sm:p-6"
          >

            <div className="flex items-center justify-between gap-4">

              <div>

                <p className="text-sm text-gray-500">
                  Closed
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-600 sm:text-3xl">
                  {closedJobs}
                </p>

              </div>

              <div className="shrink-0 rounded-xl bg-gray-100 p-3 text-gray-600">

                <FiBriefcase className="text-xl" />

              </div>

            </div>

          </motion.div>

        </div>


        {/* ================================================================
            JOBS SECTION
        ================================================================= */}

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
            delay: 0.3,
          }}
          className="mt-7 overflow-hidden rounded-xl bg-white shadow-sm sm:mt-8"
        >


          {/* Section Header */}

          <div className="flex flex-col gap-4 border-b px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">

            <div>

              <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
                My Jobs
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage your job postings.
              </p>

            </div>


            <Link
              to="/recruiter/jobs/create"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-blue-600 px-4 py-2.5 text-sm font-medium text-blue-600 transition hover:bg-blue-50 sm:w-auto"
            >

              <FiPlus />

              Create Job

            </Link>

          </div>


          {/* ============================================================
              EMPTY STATE
          ============================================================= */}

          {jobs.length === 0 ? (

            <div className="px-5 py-14 text-center sm:px-6 sm:py-16">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">

                <FiBriefcase className="text-2xl text-blue-600" />

              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                No jobs posted yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Create your first job posting and start finding the right candidates.
              </p>

              <Link
                to="/recruiter/jobs/create"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
              >

                <FiPlus />

                Post Your First Job

              </Link>

            </div>

          ) : (

            <>
              {/* ========================================================
                  MOBILE JOB CARDS
              ========================================================= */}

              <div className="divide-y md:hidden">

                {jobs.map(
                  (job, index) => (

                    <motion.div
                      key={job._id}
                      initial={{
                        opacity: 0,
                        y: 10,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        delay:
                          0.05 * index,
                      }}
                      className="p-5"
                    >

                      {/* Job Header */}

                      <div className="flex items-start justify-between gap-3">

                        <div className="min-w-0 flex-1">

                          <p className="truncate font-semibold text-gray-900">
                            {job.title}
                          </p>

                          <p className="mt-1 truncate text-sm text-gray-500">
                            {job.company}
                          </p>

                        </div>


                        {/* Status */}

                        <select
                          value={job.status}
                          disabled={
                            updatingStatusId ===
                            job._id
                          }
                          onChange={(e) =>
                            handleStatusChange(
                              job._id,
                              e.target.value
                            )
                          }
                          className={`shrink-0 rounded-full border-0 px-2.5 py-1.5 text-xs font-semibold outline-none ${getStatusStyle(
                            job.status
                          )}`}
                        >

                          <option value="draft">
                            Draft
                          </option>

                          <option value="published">
                            Published
                          </option>

                          <option value="closed">
                            Closed
                          </option>

                        </select>

                      </div>


                      {/* Job Meta */}

                      <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-gray-500">

                        <div className="flex items-center gap-2">

                          <FiMapPin className="shrink-0" />

                          <span className="truncate">
                            {job.location ||
                              "Location not specified"}
                          </span>

                        </div>


                        <div className="flex items-center gap-2">

                          <FiBriefcase className="shrink-0" />

                          <span className="capitalize">
                            {job.jobType ||
                              "Not specified"}
                          </span>

                        </div>


                        <div className="flex items-center gap-2">

                          <FiClock className="shrink-0" />

                          <span className="capitalize">
                            {job.workMode ||
                              "Not specified"}
                          </span>

                        </div>

                      </div>


                      {/* Actions */}

                      <div className="mt-5 grid grid-cols-3 gap-2">

                        {/* View */}

                        <Link
                          to={`/jobs/${job._id}`}
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                        >

                          <FiEye />

                          View

                        </Link>


                        {/* Edit */}

                        <Link
                          to={`/recruiter/jobs/${job._id}/edit`}
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2.5 text-xs font-medium text-blue-600 transition hover:bg-blue-100"
                        >

                          <FiEdit />

                          Edit

                        </Link>


                        {/* Delete */}

                        <button
                          type="button"
                          disabled={
                            deletingId ===
                            job._id
                          }
                          onClick={() =>
                            handleDelete(
                              job._id
                            )
                          }
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                          {deletingId ===
                          job._id ? (
                            "..."
                          ) : (
                            <>
                              <FiTrash2 />

                              Delete
                            </>
                          )}

                        </button>

                      </div>

                    </motion.div>

                  )
                )}

              </div>


              {/* ========================================================
                  DESKTOP / TABLET TABLE
              ========================================================= */}

              <div className="hidden overflow-x-auto md:block">

                <table className="w-full min-w-[850px]">

                  <thead>

                    <tr className="border-b bg-gray-50 text-left text-sm text-gray-500">

                      <th className="px-6 py-4 font-medium">
                        Job
                      </th>

                      <th className="px-6 py-4 font-medium">
                        Type
                      </th>

                      <th className="px-6 py-4 font-medium">
                        Work Mode
                      </th>

                      <th className="px-6 py-4 font-medium">
                        Status
                      </th>

                      <th className="px-6 py-4 text-right font-medium">
                        Actions
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {jobs.map(
                      (job, index) => (

                        <motion.tr
                          key={job._id}
                          initial={{
                            opacity: 0,
                          }}
                          animate={{
                            opacity: 1,
                          }}
                          transition={{
                            delay:
                              0.05 * index,
                          }}
                          className="border-b last:border-b-0 hover:bg-gray-50"
                        >

                          {/* Job */}

                          <td className="px-6 py-5">

                            <div>

                              <p className="font-semibold text-gray-900">
                                {job.title}
                              </p>

                              <p className="mt-1 text-sm text-gray-500">
                                {job.company}
                              </p>

                              <p className="mt-1 text-xs text-gray-400">
                                {job.location}
                              </p>

                            </div>

                          </td>


                          {/* Type */}

                          <td className="px-6 py-5">

                            <span className="text-sm capitalize text-gray-600">
                              {job.jobType}
                            </span>

                          </td>


                          {/* Work Mode */}

                          <td className="px-6 py-5">

                            <span className="text-sm capitalize text-gray-600">
                              {job.workMode}
                            </span>

                          </td>


                          {/* Status */}

                          <td className="px-6 py-5">

                            <select
                              value={job.status}
                              disabled={
                                updatingStatusId ===
                                job._id
                              }
                              onChange={(e) =>
                                handleStatusChange(
                                  job._id,
                                  e.target.value
                                )
                              }
                              className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none ${getStatusStyle(
                                job.status
                              )}`}
                            >

                              <option value="draft">
                                Draft
                              </option>

                              <option value="published">
                                Published
                              </option>

                              <option value="closed">
                                Closed
                              </option>

                            </select>

                          </td>


                          {/* Actions */}

                          <td className="px-6 py-5">

                            <div className="flex justify-end gap-1">

                              {/* View */}

                              <Link
                                to={`/jobs/${job._id}`}
                                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                                title="View Job"
                              >

                                <FiEye />

                              </Link>


                              {/* Edit */}

                              <Link
                                to={`/recruiter/jobs/${job._id}/edit`}
                                className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                                title="Edit Job"
                              >

                                <FiEdit />

                              </Link>


                              {/* Delete */}

                              <button
                                type="button"
                                disabled={
                                  deletingId ===
                                  job._id
                                }
                                onClick={() =>
                                  handleDelete(
                                    job._id
                                  )
                                }
                                className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                title="Delete Job"
                              >

                                {deletingId ===
                                job._id ? (
                                  <span className="text-xs">
                                    ...
                                  </span>
                                ) : (
                                  <FiTrash2 />
                                )}

                              </button>

                            </div>

                          </td>

                        </motion.tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </>

          )}

        </motion.div>

      </div>

    </div>

  );

};


export default RecruiterDashboard;