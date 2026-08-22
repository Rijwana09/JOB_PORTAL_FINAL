import {
  useEffect,
  useState,
} from "react";

import {
  FiUsers,
  FiBriefcase,
  FiFileText,
  FiUserCheck,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiRefreshCw,
} from "react-icons/fi";

import toast from "react-hot-toast";

import {
  getAdminDashboard,
} from "../../api/adminApi";

import {
  useAuth,
} from "../../context/AuthContext";


const AdminDashboard = () => {

  const { user } = useAuth();

  const [dashboard, setDashboard] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);


  /*
  |--------------------------------------------------------------------------
  | Fetch Dashboard
  |--------------------------------------------------------------------------
  */

  const fetchDashboard =
    async () => {

      try {

        setLoading(true);
        setError(null);

        const response =
          await getAdminDashboard();

        console.log(
          "Admin Dashboard Response:",
          response
        );

        setDashboard(
          response?.data
        );

      } catch (error) {

        console.error(
          "Failed to fetch admin dashboard:",
          error
        );

        const message =
          error.response?.data?.message ||
          "Failed to load admin dashboard";

        setError(message);

        toast.error(message);

      } finally {

        setLoading(false);

      }
    };


  useEffect(() => {

    fetchDashboard();

  }, []);


  /*
  |--------------------------------------------------------------------------
  | Loading
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
                    className="h-32 rounded-xl bg-white shadow-sm"
                  />
                )
              )}

            </div>

          </div>

        </div>

      </div>
    );
  }


  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (error) {

    return (
      <div className="min-h-screen bg-gray-50">

        <div className="flex min-h-[70vh] items-center justify-center px-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">

              <FiXCircle className="text-3xl text-red-500" />

            </div>

            <h1 className="mt-5 text-xl font-bold text-gray-900">
              Unable to Load Dashboard
            </h1>

            <p className="mt-2 text-gray-500">
              {error}
            </p>

            <button
              onClick={fetchDashboard}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
            >
              <FiRefreshCw />
              Try Again
            </button>

          </div>

        </div>

      </div>
    );
  }


  const statistics =
    dashboard?.statistics || {};

  const users =
    statistics.users || {};

  const jobs =
    statistics.jobs || {};

  const applications =
    statistics.applications || {};

  const statusSummary =
    dashboard?.applicationStatusSummary || [];

  const recentUsers =
    dashboard?.recentUsers || [];

  const recentJobs =
    dashboard?.recentJobs || [];

  const recentApplications =
    dashboard?.recentApplications || [];


  /*
  |--------------------------------------------------------------------------
  | Dashboard
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="mx-auto max-w-7xl px-4 py-8">

        {/* Header */}

        <div>

          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-gray-500">
            Welcome back, {user?.name}.
            Monitor your job portal from here.
          </p>

        </div>


        {/* Main Stats */}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* Users */}

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Total Users
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {users.total || 0}
                </p>

              </div>

              <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                <FiUsers className="text-xl" />
              </div>

            </div>

            <p className="mt-4 text-sm text-gray-500">
              {users.students || 0} students ·{" "}
              {users.recruiters || 0} recruiters
            </p>

          </div>


          {/* Jobs */}

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Total Jobs
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {jobs.total || 0}
                </p>

              </div>

              <div className="rounded-lg bg-purple-50 p-3 text-purple-600">
                <FiBriefcase className="text-xl" />
              </div>

            </div>

            <p className="mt-4 text-sm text-gray-500">
              {jobs.published || 0} published
            </p>

          </div>


          {/* Applications */}

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Applications
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {applications.total || 0}
                </p>

              </div>

              <div className="rounded-lg bg-yellow-50 p-3 text-yellow-600">
                <FiFileText className="text-xl" />
              </div>

            </div>

            <p className="mt-4 text-sm text-gray-500">
              {applications.applied || 0} pending
            </p>

          </div>


          {/* Hiring Rate */}

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">
                  Hiring Rate
                </p>

                <p className="mt-2 text-3xl font-bold text-green-600">
                  {applications.successRate || 0}%
                </p>

              </div>

              <div className="rounded-lg bg-green-50 p-3 text-green-600">
                <FiUserCheck className="text-xl" />
              </div>

            </div>

            <p className="mt-4 text-sm text-gray-500">
              {applications.hired || 0} hired
            </p>

          </div>

        </div>


        {/* Secondary Stats */}

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-xl bg-white p-5 shadow-sm">

            <p className="text-sm text-gray-500">
              Published Jobs
            </p>

            <p className="mt-2 text-2xl font-bold text-green-600">
              {jobs.published || 0}
            </p>

          </div>


          <div className="rounded-xl bg-white p-5 shadow-sm">

            <p className="text-sm text-gray-500">
              Draft Jobs
            </p>

            <p className="mt-2 text-2xl font-bold text-yellow-600">
              {jobs.draft || 0}
            </p>

          </div>


          <div className="rounded-xl bg-white p-5 shadow-sm">

            <p className="text-sm text-gray-500">
              Shortlisted
            </p>

            <p className="mt-2 text-2xl font-bold text-blue-600">
              {applications.shortlisted || 0}
            </p>

          </div>


          <div className="rounded-xl bg-white p-5 shadow-sm">

            <p className="text-sm text-gray-500">
              Rejected
            </p>

            <p className="mt-2 text-2xl font-bold text-red-600">
              {applications.rejected || 0}
            </p>

          </div>

        </div>


        {/* Application Status */}

        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-gray-900">
            Application Overview
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

            {statusSummary.map(
              (item) => {

                const statusStyles = {
                  applied:
                    "bg-blue-50 text-blue-600",

                  shortlisted:
                    "bg-yellow-50 text-yellow-600",

                  rejected:
                    "bg-red-50 text-red-600",

                  hired:
                    "bg-green-50 text-green-600",

                  withdrawn:
                    "bg-gray-100 text-gray-600",
                };

                return (
                  <div
                    key={item.status}
                    className="rounded-lg border border-gray-100 p-4"
                  >

                    <div className="flex items-center justify-between">

                      <span className="text-sm capitalize text-gray-500">
                        {item.status}
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          statusStyles[
                            item.status
                          ] ||
                          "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {item.count}
                      </span>

                    </div>

                  </div>
                );

              }
            )}

          </div>

        </div>


        {/* Recent Data */}

        <div className="mt-8 grid gap-6 lg:grid-cols-2">

          {/* Recent Users */}

          <div className="rounded-xl bg-white shadow-sm">

            <div className="border-b px-6 py-5">

              <h2 className="text-lg font-semibold">
                Recent Users
              </h2>

            </div>

            <div>

              {recentUsers.length === 0 ? (

                <p className="p-6 text-sm text-gray-500">
                  No users found.
                </p>

              ) : (

                recentUsers.map(
                  (recentUser) => (

                    <div
                      key={recentUser._id}
                      className="flex items-center justify-between border-b px-6 py-4 last:border-b-0"
                    >

                      <div>

                        <p className="font-medium text-gray-900">
                          {recentUser.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {recentUser.email}
                        </p>

                      </div>

                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-600">
                        {recentUser.role}
                      </span>

                    </div>

                  )
                )

              )}

            </div>

          </div>


          {/* Recent Jobs */}

          <div className="rounded-xl bg-white shadow-sm">

            <div className="border-b px-6 py-5">

              <h2 className="text-lg font-semibold">
                Recent Jobs
              </h2>

            </div>

            <div>

              {recentJobs.length === 0 ? (

                <p className="p-6 text-sm text-gray-500">
                  No jobs found.
                </p>

              ) : (

                recentJobs.map(
                  (job) => (

                    <div
                      key={job._id}
                      className="border-b px-6 py-4 last:border-b-0"
                    >

                      <p className="font-medium text-gray-900">
                        {job.title}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {job.company} ·{" "}
                        {job.location}
                      </p>

                      <span
                        className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${
                          job.status ===
                          "published"
                            ? "bg-green-50 text-green-600"
                            : job.status ===
                              "draft"
                            ? "bg-yellow-50 text-yellow-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {job.status}
                      </span>

                    </div>

                  )
                )

              )}

            </div>

          </div>

        </div>


        {/* Recent Applications */}

        <div className="mt-8 rounded-xl bg-white shadow-sm">

          <div className="border-b px-6 py-5">

            <h2 className="text-lg font-semibold">
              Recent Applications
            </h2>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b text-left text-sm text-gray-500">

                  <th className="px-6 py-4">
                    Student
                  </th>

                  <th className="px-6 py-4">
                    Job
                  </th>

                  <th className="px-6 py-4">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {recentApplications.map(
                  (application) => (

                    <tr
                      key={application._id}
                      className="border-b last:border-b-0"
                    >

                      <td className="px-6 py-4">

                        <p className="font-medium text-gray-900">
                          {application.student?.name ||
                            "Unknown"}
                        </p>

                        <p className="text-sm text-gray-500">
                          {application.student?.email ||
                            "No email"}
                        </p>

                      </td>

                      <td className="px-6 py-4">

                        <p className="font-medium text-gray-900">
                          {application.job?.title ||
                            "Unknown Job"}
                        </p>

                        <p className="text-sm text-gray-500">
                          {application.job?.company ||
                            "Unknown Company"}
                        </p>

                      </td>

                      <td className="px-6 py-4">

                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-600">
                          {application.status}
                        </span>

                      </td>

                    </tr>

                  )
                )}

                {recentApplications.length === 0 && (
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-10 text-center text-sm text-gray-500"
                    >
                      No applications found.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;