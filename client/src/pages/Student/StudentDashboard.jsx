import {
  useEffect,
  useState,
} from "react";

import {
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiAward,
} from "react-icons/fi";

import toast from "react-hot-toast";

import {
  getStudentDashboard,
} from "../../api/applicationApi";

const StudentDashboard = () => {

  const [
    dashboard,
    setDashboard,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);


  /*
  |--------------------------------------------------------------------------
  | Fetch Dashboard
  |--------------------------------------------------------------------------
  */

  const fetchDashboard =
    async () => {

      try {

        setLoading(true);

        const response =
          await getStudentDashboard();

        setDashboard(
          response.data
        );

      } catch (error) {

        console.error(
          "Student Dashboard Error:",
          error.response?.data ||
            error
        );

        toast.error(
          error.response?.data?.message ||
          "Failed to load dashboard"
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

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          <div className="animate-pulse">

            {/* Header skeleton */}

            <div className="h-8 w-64 rounded bg-gray-200" />

            <div className="mt-3 h-4 w-72 rounded bg-gray-200" />


            {/* Statistics skeleton */}

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">

              {[1, 2, 3, 4, 5].map(
                (item) => (

                  <div
                    key={item}
                    className="h-28 rounded-xl bg-white shadow-sm"
                  />

                )
              )}

            </div>


            {/* Recent applications skeleton */}

            <div className="mt-8 h-72 rounded-xl bg-white shadow-sm" />

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

  const recentApplications =
    dashboard?.recentApplications || [];


  /*
  |--------------------------------------------------------------------------
  | Statistic Card
  |--------------------------------------------------------------------------
  */

  const statisticCards = [

    {
      label: "Total",
      value:
        statistics.totalApplications || 0,
      icon: FiBriefcase,
      iconStyle:
        "bg-blue-50 text-blue-600",
    },

    {
      label: "Applied",
      value:
        statistics.applied || 0,
      icon: FiClock,
      iconStyle:
        "bg-yellow-50 text-yellow-600",
    },

    {
      label: "Shortlisted",
      value:
        statistics.shortlisted || 0,
      icon: FiCheckCircle,
      iconStyle:
        "bg-blue-50 text-blue-600",
    },

    {
      label: "Rejected",
      value:
        statistics.rejected || 0,
      icon: FiXCircle,
      iconStyle:
        "bg-red-50 text-red-600",
    },

    {
      label: "Hired",
      value:
        statistics.hired || 0,
      icon: FiAward,
      iconStyle:
        "bg-green-50 text-green-600",
    },

  ];


  return (

    <div className="min-h-screen bg-gray-50">

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">


        {/* ================================================================
            HEADER
        ================================================================= */}

        <div>

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">

            Student Dashboard

          </h1>

          <p className="mt-1 text-sm text-gray-500 sm:text-base">

            Track your job applications

          </p>

        </div>


        {/* ================================================================
            STATISTICS
        ================================================================= */}

        <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-5">


          {statisticCards.map(
            (stat) => {

              const Icon =
                stat.icon;

              return (

                <div
                  key={stat.label}
                  className="rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md sm:p-6"
                >

                  <div className="flex items-center gap-3">

                    <div
                      className={`shrink-0 rounded-lg p-3 ${stat.iconStyle}`}
                    >

                      <Icon />

                    </div>

                    <div className="min-w-0">

                      <p className="text-sm text-gray-500">

                        {stat.label}

                      </p>

                      <p className="text-xl font-bold text-gray-900 sm:text-2xl">

                        {stat.value}

                      </p>

                    </div>

                  </div>

                </div>

              );

            }
          )}

        </div>


        {/* ================================================================
            RECENT APPLICATIONS
        ================================================================= */}

        <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm sm:mt-8">


          {/* Header */}

          <div className="border-b px-4 py-4 sm:px-6 sm:py-5">

            <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">

              Recent Applications

            </h2>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">

              Your latest job applications

            </p>

          </div>


          {/* Empty State */}

          {recentApplications.length === 0 ? (

            <div className="px-4 py-12 text-center sm:px-6 sm:py-16">

              <FiBriefcase
                className="mx-auto text-4xl text-gray-300"
              />

              <h3 className="mt-4 font-semibold text-gray-900">

                No applications yet

              </h3>

              <p className="mt-1 text-sm text-gray-500">

                Start applying for jobs to see them here.

              </p>

            </div>

          ) : (

            <>

              {/* ==========================================================
                  MOBILE APPLICATION CARDS
              =========================================================== */}

              <div className="divide-y sm:hidden">

                {recentApplications.map(
                  (application) => (

                    <div
                      key={application._id}
                      className="p-4"
                    >

                      {/* Job */}

                      <div>

                        <p className="font-semibold text-gray-900">

                          {
                            application
                              .job
                              ?.title ||
                            "Job unavailable"
                          }

                        </p>

                        <p className="mt-1 text-sm text-gray-500">

                          {
                            application
                              .job
                              ?.company ||
                            "-"
                          }

                        </p>

                      </div>


                      {/* Details */}

                      <div className="mt-4 space-y-3">

                        <div className="flex items-start justify-between gap-4">

                          <span className="text-xs text-gray-400">
                            Location
                          </span>

                          <span className="text-right text-sm text-gray-600">

                            {
                              application
                                .job
                                ?.location ||
                              "-"
                            }

                          </span>

                        </div>


                        <div className="flex items-center justify-between gap-4">

                          <span className="text-xs text-gray-400">
                            Status
                          </span>

                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-700">

                            {
                              application.status
                            }

                          </span>

                        </div>


                        <div className="flex items-center justify-between gap-4">

                          <span className="text-xs text-gray-400">
                            Applied On
                          </span>

                          <span className="text-sm text-gray-500">

                            {new Date(
                              application.createdAt
                            ).toLocaleDateString()}

                          </span>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>


              {/* ==========================================================
                  TABLET / DESKTOP TABLE
              =========================================================== */}

              <div className="hidden overflow-x-auto sm:block">

                <table className="w-full min-w-[700px]">

                  <thead>

                    <tr className="border-b text-left text-sm text-gray-500">

                      <th className="px-4 py-4 sm:px-6">
                        Job
                      </th>

                      <th className="px-4 py-4 sm:px-6">
                        Company
                      </th>

                      <th className="px-4 py-4 sm:px-6">
                        Location
                      </th>

                      <th className="px-4 py-4 sm:px-6">
                        Status
                      </th>

                      <th className="px-4 py-4 sm:px-6">
                        Applied On
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {recentApplications.map(
                      (application) => (

                        <tr
                          key={
                            application._id
                          }
                          className="border-b last:border-b-0"
                        >

                          <td className="px-4 py-5 sm:px-6">

                            <p className="font-medium text-gray-900">

                              {
                                application
                                  .job
                                  ?.title ||
                                "Job unavailable"
                              }

                            </p>

                          </td>


                          <td className="px-4 py-5 text-sm text-gray-600 sm:px-6">

                            {
                              application
                                .job
                                ?.company ||
                              "-"
                            }

                          </td>


                          <td className="px-4 py-5 text-sm text-gray-600 sm:px-6">

                            {
                              application
                                .job
                                ?.location ||
                              "-"
                            }

                          </td>


                          <td className="px-4 py-5 sm:px-6">

                            <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize text-gray-700">

                              {
                                application.status
                              }

                            </span>

                          </td>


                          <td className="px-4 py-5 text-sm text-gray-500 sm:px-6">

                            {new Date(
                              application.createdAt
                            ).toLocaleDateString()}

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </>

          )}

        </div>

      </div>

    </div>

  );

};

export default StudentDashboard;