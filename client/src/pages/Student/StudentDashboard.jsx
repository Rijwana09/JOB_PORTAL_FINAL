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
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">
          Loading dashboard...
        </p>
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

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="mx-auto max-w-7xl px-4 py-8">

        {/* Header */}

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Student Dashboard
          </h1>

          <p className="mt-1 text-gray-500">
            Track your job applications
          </p>
        </div>

        {/* Statistics */}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

          {/* Total */}

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                <FiBriefcase />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Total
                </p>

                <p className="text-2xl font-bold">
                  {
                    statistics.totalApplications ||
                    0
                  }
                </p>
              </div>

            </div>

          </div>

          {/* Applied */}

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="rounded-lg bg-yellow-50 p-3 text-yellow-600">
                <FiClock />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Applied
                </p>

                <p className="text-2xl font-bold">
                  {
                    statistics.applied ||
                    0
                  }
                </p>
              </div>

            </div>

          </div>

          {/* Shortlisted */}

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                <FiCheckCircle />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Shortlisted
                </p>

                <p className="text-2xl font-bold">
                  {
                    statistics.shortlisted ||
                    0
                  }
                </p>
              </div>

            </div>

          </div>

          {/* Rejected */}

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="rounded-lg bg-red-50 p-3 text-red-600">
                <FiXCircle />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Rejected
                </p>

                <p className="text-2xl font-bold">
                  {
                    statistics.rejected ||
                    0
                  }
                </p>
              </div>

            </div>

          </div>

          {/* Hired */}

          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="rounded-lg bg-green-50 p-3 text-green-600">
                <FiAward />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Hired
                </p>

                <p className="text-2xl font-bold">
                  {
                    statistics.hired ||
                    0
                  }
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* Recent Applications */}

        <div className="mt-8 rounded-xl bg-white shadow-sm">

          <div className="border-b px-6 py-5">

            <h2 className="text-xl font-semibold">
              Recent Applications
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Your latest job applications
            </p>

          </div>

          {recentApplications.length ===
          0 ? (
            <div className="px-6 py-16 text-center">

              <FiBriefcase
                className="mx-auto text-4xl text-gray-300"
              />

              <h3 className="mt-4 font-semibold text-gray-900">
                No applications yet
              </h3>

              <p className="mt-1 text-gray-500">
                Start applying for jobs to see them here.
              </p>

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
                      Company
                    </th>

                    <th className="px-6 py-4">
                      Location
                    </th>

                    <th className="px-6 py-4">
                      Status
                    </th>

                    <th className="px-6 py-4">
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

                        <td className="px-6 py-5">

                          <p className="font-medium text-gray-900">
                            {
                              application
                                .job
                                ?.title ||
                              "Job unavailable"
                            }
                          </p>

                        </td>

                        <td className="px-6 py-5 text-sm text-gray-600">
                          {
                            application
                              .job
                              ?.company ||
                            "-"
                          }
                        </td>

                        <td className="px-6 py-5 text-sm text-gray-600">
                          {
                            application
                              .job
                              ?.location ||
                            "-"
                          }
                        </td>

                        <td className="px-6 py-5">

                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium capitalize">
                            {
                              application.status
                            }
                          </span>

                        </td>

                        <td className="px-6 py-5 text-sm text-gray-500">
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
          )}

        </div>

      </div>

    </div>
  );
};

export default StudentDashboard;