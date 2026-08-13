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
} from "react-icons/fi";

import { Link } from "react-router-dom";

import toast from "react-hot-toast";

import {
  getMyJobs,
  deleteJob,
} from "../../api/jobApi";

const RecruiterDashboard = () => {
  const [jobs, setJobs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [deletingId, setDeletingId] =
    useState(null);

  const fetchMyJobs = async () => {
    try {
      setLoading(true);

      const response =
        await getMyJobs({
          // limit: 100,
        });

      setJobs(
        response.data.jobs
      );

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch your jobs"
      );
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="mx-auto max-w-7xl px-4 py-8">

        {/* Header */}

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Recruiter Dashboard
            </h1>

            <p className="mt-1 text-gray-500">
              Manage your job postings
            </p>
          </div>

          <Link
            to="/recruiter/jobs/create"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
          >
            <FiPlus />
            Post a Job
          </Link>

        </div>

        {/* Stats */}

        <div className="mt-8 grid gap-5 sm:grid-cols-3">

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                <FiBriefcase />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Total Jobs
                </p>

                <p className="text-2xl font-bold">
                  {jobs.length}
                </p>
              </div>

            </div>

          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <p className="text-sm text-gray-500">
              Published
            </p>

            <p className="mt-1 text-2xl font-bold text-green-600">
              {
                jobs.filter(
                  (job) =>
                    job.status ===
                    "published"
                ).length
              }
            </p>

          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <p className="text-sm text-gray-500">
              Drafts
            </p>

            <p className="mt-1 text-2xl font-bold text-yellow-600">
              {
                jobs.filter(
                  (job) =>
                    job.status ===
                    "draft"
                ).length
              }
            </p>

          </div>

        </div>

        {/* Jobs */}

        <div className="mt-8 rounded-xl bg-white shadow-sm">

          <div className="border-b px-6 py-5">

            <h2 className="text-xl font-semibold">
              My Jobs
            </h2>

          </div>

          {loading ? (
            <div className="px-6 py-16 text-center">
              <p className="text-gray-500">
                Loading jobs...
              </p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="px-6 py-16 text-center">

              <FiBriefcase
                className="mx-auto text-4xl text-gray-300"
              />

              <h3 className="mt-4 font-semibold">
                No jobs posted yet
              </h3>

              <p className="mt-1 text-gray-500">
                Create your first job posting.
              </p>

              <Link
                to="/recruiter/jobs/create"
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
              >
                <FiPlus />
                Create Job
              </Link>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>
                  <tr className="border-b text-left text-sm text-gray-500">

                    <th className="px-6 py-4">
                      Job
                    </th>

                    <th className="px-6 py-4">
                      Type
                    </th>

                    <th className="px-6 py-4">
                      Status
                    </th>

                    <th className="px-6 py-4">
                      Actions
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {jobs.map(
                    (job) => (
                      <tr
                        key={job._id}
                        className="border-b last:border-b-0"
                      >

                        <td className="px-6 py-5">

                          <p className="font-medium text-gray-900">
                            {job.title}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            {job.location}
                          </p>

                        </td>

                        <td className="px-6 py-5 text-sm">
                          {job.jobType}
                        </td>

                        <td className="px-6 py-5">

                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
                            {job.status}
                          </span>

                        </td>

                        <td className="px-6 py-5">

                          <div className="flex items-center gap-2">

                            <Link
                              to={`/jobs/${job._id}`}
                              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                              title="View"
                            >
                              <FiEye />
                            </Link>

                            <Link
                              to={`/recruiter/jobs/${job._id}/edit`}
                              className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                              title="Edit"
                            >
                              <FiEdit />
                            </Link>

                            <button
                              disabled={
                                deletingId ===
                                job._id
                              }
                              onClick={() =>
                                handleDelete(
                                  job._id
                                )
                              }
                              className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                              title="Delete"
                            >
                              <FiTrash2 />
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default RecruiterDashboard;