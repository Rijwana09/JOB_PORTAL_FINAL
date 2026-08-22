import {
  useEffect,
  useState,
} from "react";

import {
  FiUsers,
  FiBriefcase,
  FiFileText,
  FiUserCheck,
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

  const { user } =
    useAuth();


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
          error?.response?.data?.message ||
          "Failed to load admin dashboard";

        setError(message);

        toast.error(
          message
        );

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

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

          <div className="animate-pulse">

            {/* Header */}

            <div className="h-8 w-56 max-w-full rounded bg-gray-200 sm:w-64" />

            <div className="mt-3 h-4 w-72 max-w-full rounded bg-gray-200 sm:w-80" />


            {/* Main Stats */}

            <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">

              {[1, 2, 3, 4].map(
                (item) => (

                  <div
                    key={item}
                    className="h-32 rounded-xl bg-white shadow-sm"
                  />

                )
              )}

            </div>


            {/* Secondary Stats */}

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {[1, 2, 3, 4].map(
                (item) => (

                  <div
                    key={item}
                    className="h-24 rounded-xl bg-white shadow-sm"
                  />

                )
              )}

            </div>


            {/* Application Overview */}

            <div className="mt-6 rounded-xl bg-white p-5 shadow-sm sm:mt-8 sm:p-6">

              <div className="h-6 w-48 rounded bg-gray-200" />

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

                {[1, 2, 3, 4, 5].map(
                  (item) => (

                    <div
                      key={item}
                      className="h-16 rounded-lg bg-gray-100"
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
  | Error
  |--------------------------------------------------------------------------
  */

  if (error) {

    return (

      <div className="min-h-screen bg-gray-50">

        <div className="flex min-h-[70vh] items-center justify-center px-4 py-8">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-sm sm:p-8">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 sm:h-16 sm:w-16">

              <FiXCircle className="text-2xl text-red-500 sm:text-3xl" />

            </div>


            <h1 className="mt-5 text-lg font-bold text-gray-900 sm:text-xl">
              Unable to Load Dashboard
            </h1>


            <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
              {error}
            </p>


            <button
              type="button"
              onClick={fetchDashboard}
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700 active:scale-[0.98]"
            >

              <FiRefreshCw />

              Try Again

            </button>

          </div>

        </div>

      </div>

    );

  }


  /*
  |--------------------------------------------------------------------------
  | Dashboard Data
  |--------------------------------------------------------------------------
  */

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
  | Status Styles
  |--------------------------------------------------------------------------
  */

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

        <div>

          <h1 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
            Admin Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            Welcome back, {user?.name}.
            Monitor your job portal from here.
          </p>

        </div>


        {/* ================================================================
            MAIN STATS
        ================================================================= */}

        <div className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">


          {/* Users */}

          <div className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">

            <div className="flex items-start justify-between gap-4">

              <div className="min-w-0">

                <p className="text-sm text-gray-500">
                  Total Users
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                  {users.total || 0}
                </p>

              </div>


              <div className="shrink-0 rounded-lg bg-blue-50 p-3 text-blue-600">

                <FiUsers className="text-xl" />

              </div>

            </div>


            <p className="mt-4 text-xs leading-5 text-gray-500 sm:text-sm">
              {users.students || 0} students ·{" "}
              {users.recruiters || 0} recruiters
            </p>

          </div>


          {/* Jobs */}

          <div className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">

            <div className="flex items-start justify-between gap-4">

              <div className="min-w-0">

                <p className="text-sm text-gray-500">
                  Total Jobs
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                  {jobs.total || 0}
                </p>

              </div>


              <div className="shrink-0 rounded-lg bg-purple-50 p-3 text-purple-600">

                <FiBriefcase className="text-xl" />

              </div>

            </div>


            <p className="mt-4 text-xs text-gray-500 sm:text-sm">
              {jobs.published || 0} published
            </p>

          </div>


          {/* Applications */}

          <div className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">

            <div className="flex items-start justify-between gap-4">

              <div className="min-w-0">

                <p className="text-sm text-gray-500">
                  Applications
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
                  {applications.total || 0}
                </p>

              </div>


              <div className="shrink-0 rounded-lg bg-yellow-50 p-3 text-yellow-600">

                <FiFileText className="text-xl" />

              </div>

            </div>


            <p className="mt-4 text-xs text-gray-500 sm:text-sm">
              {applications.applied || 0} pending
            </p>

          </div>


          {/* Hiring Rate */}

          <div className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">

            <div className="flex items-start justify-between gap-4">

              <div className="min-w-0">

                <p className="text-sm text-gray-500">
                  Hiring Rate
                </p>

                <p className="mt-2 text-2xl font-bold text-green-600 sm:text-3xl">
                  {applications.successRate || 0}%
                </p>

              </div>


              <div className="shrink-0 rounded-lg bg-green-50 p-3 text-green-600">

                <FiUserCheck className="text-xl" />

              </div>

            </div>


            <p className="mt-4 text-xs text-gray-500 sm:text-sm">
              {applications.hired || 0} hired
            </p>

          </div>

        </div>


        {/* ================================================================
            SECONDARY STATS
        ================================================================= */}

        <div className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">


          {/* Published */}

          <div className="rounded-xl bg-white p-5 shadow-sm">

            <p className="text-sm text-gray-500">
              Published Jobs
            </p>

            <p className="mt-2 text-2xl font-bold text-green-600">
              {jobs.published || 0}
            </p>

          </div>


          {/* Draft */}

          <div className="rounded-xl bg-white p-5 shadow-sm">

            <p className="text-sm text-gray-500">
              Draft Jobs
            </p>

            <p className="mt-2 text-2xl font-bold text-yellow-600">
              {jobs.draft || 0}
            </p>

          </div>


          {/* Shortlisted */}

          <div className="rounded-xl bg-white p-5 shadow-sm">

            <p className="text-sm text-gray-500">
              Shortlisted
            </p>

            <p className="mt-2 text-2xl font-bold text-blue-600">
              {applications.shortlisted || 0}
            </p>

          </div>


          {/* Rejected */}

          <div className="rounded-xl bg-white p-5 shadow-sm">

            <p className="text-sm text-gray-500">
              Rejected
            </p>

            <p className="mt-2 text-2xl font-bold text-red-600">
              {applications.rejected || 0}
            </p>

          </div>

        </div>


        {/* ================================================================
            APPLICATION STATUS
        ================================================================= */}

        <div className="mt-6 rounded-xl bg-white p-5 shadow-sm sm:mt-8 sm:p-6">

          <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
            Application Overview
          </h2>


          <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-5">

            {statusSummary.map(
              (item) => (

                <div
                  key={item.status}
                  className="rounded-lg border border-gray-100 p-4"
                >

                  <div className="flex items-center justify-between gap-3">

                    <span className="truncate text-sm capitalize text-gray-500">
                      {item.status}
                    </span>


                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
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

              )
            )}

          </div>

        </div>


        {/* ================================================================
            RECENT USERS + RECENT JOBS
        ================================================================= */}

        <div className="mt-6 grid gap-5 sm:mt-8 sm:gap-6 lg:grid-cols-2">


          {/* Recent Users */}

          <div className="overflow-hidden rounded-xl bg-white shadow-sm">

            <div className="border-b px-5 py-4 sm:px-6 sm:py-5">

              <h2 className="text-lg font-semibold text-gray-900">
                Recent Users
              </h2>

            </div>


            <div>

              {recentUsers.length === 0 ? (

                <p className="p-5 text-sm text-gray-500 sm:p-6">
                  No users found.
                </p>

              ) : (

                recentUsers.map(
                  (recentUser) => (

                    <div
                      key={recentUser._id}
                      className="flex items-center justify-between gap-4 border-b px-5 py-4 last:border-b-0 sm:px-6"
                    >

                      <div className="min-w-0">

                        <p className="truncate font-medium text-gray-900">
                          {recentUser.name}
                        </p>

                        <p className="mt-1 truncate text-sm text-gray-500">
                          {recentUser.email}
                        </p>

                      </div>


                      <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium capitalize text-gray-600 sm:px-3">
                        {recentUser.role}
                      </span>

                    </div>

                  )
                )

              )}

            </div>

          </div>


          {/* Recent Jobs */}

          <div className="overflow-hidden rounded-xl bg-white shadow-sm">

            <div className="border-b px-5 py-4 sm:px-6 sm:py-5">

              <h2 className="text-lg font-semibold text-gray-900">
                Recent Jobs
              </h2>

            </div>


            <div>

              {recentJobs.length === 0 ? (

                <p className="p-5 text-sm text-gray-500 sm:p-6">
                  No jobs found.
                </p>

              ) : (

                recentJobs.map(
                  (job) => (

                    <div
                      key={job._id}
                      className="border-b px-5 py-4 last:border-b-0 sm:px-6"
                    >

                      <p className="truncate font-medium text-gray-900">
                        {job.title}
                      </p>

                      <p className="mt-1 truncate text-sm text-gray-500">
                        {job.company} ·{" "}
                        {job.location}
                      </p>


                      <span
                        className={`mt-2 inline-block rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
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


        {/* ================================================================
            RECENT APPLICATIONS
        ================================================================= */}

        <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm sm:mt-8">


          <div className="border-b px-5 py-4 sm:px-6 sm:py-5">

            <h2 className="text-lg font-semibold text-gray-900">
              Recent Applications
            </h2>

          </div>


          {/* Important:
              Horizontal scrolling is intentionally kept for
              small screens so the table never breaks the layout.
          */}

          <div className="overflow-x-auto">

            <table className="w-full min-w-[620px]">

              <thead>

                <tr className="border-b bg-gray-50 text-left text-sm text-gray-500">

                  <th className="whitespace-nowrap px-5 py-4 font-medium sm:px-6">
                    Student
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 font-medium sm:px-6">
                    Job
                  </th>

                  <th className="whitespace-nowrap px-5 py-4 font-medium sm:px-6">
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

                      <td className="px-5 py-4 sm:px-6">

                        <p className="font-medium text-gray-900">
                          {application.student?.name ||
                            "Unknown"}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {application.student?.email ||
                            "No email"}
                        </p>

                      </td>


                      <td className="px-5 py-4 sm:px-6">

                        <p className="font-medium text-gray-900">
                          {application.job?.title ||
                            "Unknown Job"}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {application.job?.company ||
                            "Unknown Company"}
                        </p>

                      </td>


                      <td className="px-5 py-4 sm:px-6">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                            statusStyles[
                              application.status
                            ] ||
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
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
                      className="px-5 py-10 text-center text-sm text-gray-500 sm:px-6"
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