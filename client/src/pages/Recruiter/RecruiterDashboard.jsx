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
  FiUsers,
  FiCheckCircle,
  FiFileText,
  FiRefreshCw,
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

  const [jobs, setJobs] = useState([]);

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

  const handleDelete = async (jobId) => {

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

      await updateJob(jobId, {
        status: newStatus,
      });

      toast.success(
        "Job status updated successfully"
      );

      setJobs((prevJobs) =>
        prevJobs.map((job) =>
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

  const totalJobs = jobs.length;

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

  const getStatusStyle = (status) => {

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

        <div className="mx-auto max-w-7xl px-4 py-8">

          <div className="animate-pulse">

            <div className="h-8 w-64 rounded bg-gray-200" />

            <div className="mt-3 h-4 w-80 rounded bg-gray-200" />

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {[1, 2, 3, 4].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-xl bg-white p-6 shadow-sm"
                  >

                    <div className="h-10 w-10 rounded-lg bg-gray-200" />

                    <div className="mt-5 h-4 w-24 rounded bg-gray-200" />

                    <div className="mt-2 h-8 w-16 rounded bg-gray-200" />

                  </div>
                )
              )}

            </div>

            <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

              <div className="h-6 w-32 rounded bg-gray-200" />

              <div className="mt-6 space-y-4">

                {[1, 2, 3].map(
                  (item) => (
                    <div
                      key={item}
                      className="h-16 rounded bg-gray-100"
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

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* --------------------------------------------------------------
            Header
        -------------------------------------------------------------- */}

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
          className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"
        >

          <div>

            <h1 className="text-3xl font-bold text-gray-900">
              Recruiter Dashboard
            </h1>

            <p className="mt-2 text-gray-500">
              Manage your job postings and hiring opportunities.
            </p>

          </div>


          <div className="flex gap-3">

            <button
              type="button"
              onClick={fetchMyJobs}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              <FiRefreshCw />

              Refresh
            </button>


            <Link
              to="/recruiter/jobs/create"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
            >

              <FiPlus />

              Post a Job

            </Link>

          </div>

        </motion.div>


        {/* --------------------------------------------------------------
            Statistics
        -------------------------------------------------------------- */}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

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
            className="rounded-xl bg-white p-6 shadow-sm"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Total Jobs
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {totalJobs}
                </p>

              </div>

              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">

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
            className="rounded-xl bg-white p-6 shadow-sm"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Published
                </p>

                <p className="mt-2 text-3xl font-bold text-green-600">
                  {publishedJobs}
                </p>

              </div>

              <div className="rounded-xl bg-green-50 p-3 text-green-600">

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
            className="rounded-xl bg-white p-6 shadow-sm"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Drafts
                </p>

                <p className="mt-2 text-3xl font-bold text-yellow-600">
                  {draftJobs}
                </p>

              </div>

              <div className="rounded-xl bg-yellow-50 p-3 text-yellow-600">

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
            className="rounded-xl bg-white p-6 shadow-sm"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Closed
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-600">
                  {closedJobs}
                </p>

              </div>

              <div className="rounded-xl bg-gray-100 p-3 text-gray-600">

                <FiBriefcase className="text-xl" />

              </div>

            </div>

          </motion.div>

        </div>


        {/* --------------------------------------------------------------
            Jobs Section
        -------------------------------------------------------------- */}

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
          className="mt-8 overflow-hidden rounded-xl bg-white shadow-sm"
        >

          {/* Section Header */}

          <div className="flex flex-col justify-between gap-4 border-b px-6 py-5 sm:flex-row sm:items-center">

            <div>

              <h2 className="text-xl font-semibold text-gray-900">
                My Jobs
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage your job postings.
              </p>

            </div>


            <Link
              to="/recruiter/jobs/create"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
            >

              <FiPlus />

              Create Job

            </Link>

          </div>


          {/* Empty State */}

          {jobs.length === 0 ? (

            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">

                <FiBriefcase className="text-2xl text-blue-600" />

              </div>

              <h3 className="mt-5 text-lg font-semibold text-gray-900">
                No jobs posted yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
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

            /* ----------------------------------------------------------
               Desktop / Tablet Table
            ---------------------------------------------------------- */

            <div className="overflow-x-auto">

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

                          <span className="text-sm text-gray-600">
                            {job.jobType}
                          </span>

                        </td>


                        {/* Work Mode */}

                        <td className="px-6 py-5">

                          <span className="text-sm text-gray-600">
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

          )}

        </motion.div>

      </div>

    </div>
  );
};


export default RecruiterDashboard;