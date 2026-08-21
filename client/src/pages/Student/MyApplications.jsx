import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  FiBriefcase,
  FiMapPin,
  FiClock,
  FiEye,
  FiArrowLeft,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";

import toast from "react-hot-toast";

import {
  getMyApplications,
} from "../../api/applicationApi";

import ApplicationStatus from "../../components/Application/ApplicationStatus";


const MyApplications = () => {

  const navigate = useNavigate();

  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(null);

  /*
  |--------------------------------------------------------------------------
  | Fetch Applications
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

  const fetchApplications = async () => {

    try {

      setLoading(true);
      setError(null);

      const response =
        await getMyApplications();

      console.log(
        "My Applications API Response:",
        response
      );

      /*
      |--------------------------------------------------------------------------
      | API Response
      |--------------------------------------------------------------------------
      |
      | response
      |   └── data
      |       └── applications
      |
      */

      const applicationList =
        response?.data?.applications || [];

      if (!Array.isArray(applicationList)) {
        throw new Error(
          "Invalid applications response"
        );
      }

      setApplications(applicationList);

    } catch (error) {

      console.error(
        "Failed to fetch applications:",
        error
      );

      setApplications([]);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to load applications"
      );

    } finally {

      setLoading(false);

    }

  };

  fetchApplications();

}, []);

const handleRetry = () => {
  window.location.reload();
};


  /*
  |--------------------------------------------------------------------------
  | Status Badge
  |--------------------------------------------------------------------------
  */

//   const getStatusStyle = (status) => {

//     switch (status) {

//       case "applied":
//         return "bg-blue-50 text-blue-600";

//       case "shortlisted":
//         return "bg-yellow-50 text-yellow-600";

//       case "hired":
//         return "bg-green-50 text-green-600";

//       case "rejected":
//         return "bg-red-50 text-red-600";

//       case "withdrawn":
//         return "bg-gray-100 text-gray-600";

//       default:
//         return "bg-gray-100 text-gray-600";
//     }

//   };


  /*
  |--------------------------------------------------------------------------
  | Format Status
  |--------------------------------------------------------------------------
  */

//   const formatStatus = (status) => {

//     if (!status) {
//       return "Unknown";
//     }

//     return status
//       .charAt(0)
//       .toUpperCase() +
//       status.slice(1);

//   };


  /*
  |--------------------------------------------------------------------------
  | Loading State
  |--------------------------------------------------------------------------
  */

  if (loading) {

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="mx-auto max-w-6xl px-4 py-10">

        <div className="animate-pulse">

          <div className="h-8 w-56 rounded bg-gray-200" />

          <div className="mt-3 h-4 w-80 rounded bg-gray-200" />

          <div className="mt-8 space-y-4">

            {[1, 2, 3].map((item) => (

              <div
                key={item}
                className="rounded-xl bg-white p-6 shadow-sm"
              >

                <div className="h-5 w-64 rounded bg-gray-200" />

                <div className="mt-3 h-4 w-40 rounded bg-gray-200" />

                <div className="mt-6 h-4 w-full rounded bg-gray-200" />

                <div className="mt-3 h-4 w-3/4 rounded bg-gray-200" />

                <div className="mt-6 h-9 w-28 rounded bg-gray-200" />

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );

}

// error state

if (error) {

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center px-4">

        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50">

            <FiAlertCircle
              className="text-3xl text-red-500"
            />

          </div>

          <h1 className="mt-6 text-2xl font-bold text-gray-900">
            Unable to Load Applications
          </h1>

          <p className="mt-3 text-gray-500">
            {error}
          </p>

          <button
            onClick={handleRetry}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
          >

            <FiRefreshCw />

            Try Again

          </button>

          <button
            onClick={() =>
              navigate("/student/dashboard")
            }
            className="mt-3 block w-full text-sm font-medium text-gray-600 transition hover:text-blue-600"
          >
            Back to Dashboard
          </button>

        </div>

      </div>

    </div>
  );

}


  /*
  |--------------------------------------------------------------------------
  | Empty State
  |--------------------------------------------------------------------------
  */

  if (applications.length === 0) {

    return (
      <div className="min-h-screen bg-gray-50">

        <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center px-4">

          <div className="text-center">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50">

              <FiBriefcase
                className="text-3xl text-blue-600"
              />

            </div>

            <h1 className="mt-6 text-2xl font-bold text-gray-900">
              No Applications Yet
            </h1>

            <p className="mt-2 max-w-md text-gray-500">
              You haven't applied for any jobs yet.
              Start exploring jobs and submit your
              first application.
            </p>

            <button
              onClick={() =>
                navigate("/jobs")
              }
              className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              Browse Jobs
            </button>

          </div>

        </div>

      </div>
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Applications Page
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="mx-auto max-w-6xl px-4 py-8">

        {/* Header */}

        <div className="mb-8">

          <button
            onClick={() =>
              navigate("/student/dashboard")
            }
            className="mb-5 flex items-center gap-2 text-sm text-gray-600 transition hover:text-blue-600"
          >
            <FiArrowLeft />
            Back to Dashboard
          </button>

          <h1 className="text-3xl font-bold text-gray-900">
            My Applications
          </h1>

          <p className="mt-2 text-gray-500">
            Track all the jobs you have applied for.
          </p>

        </div>


        {/* Application Count */}

        <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Total Applications
              </p>

              <p className="mt-1 text-2xl font-bold text-gray-900">
                {applications.length}
              </p>

            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">

              <FiBriefcase
                className="text-xl text-blue-600"
              />

            </div>

          </div>

        </div>


        {/* Applications */}

        <div className="space-y-5">

          {applications.map(
            (application) => {

              const job =
                application.job;

              return (
                <div
                  key={application._id}
                  className="rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
                >

                  {/* Top Section */}

                  <div className="flex flex-col justify-between gap-4 md:flex-row">

                    <div>

                      <h2 className="text-xl font-semibold text-gray-900">
                        {job?.title ||
                          "Job Title Unavailable"}
                      </h2>

                      <p className="mt-1 font-medium text-gray-600">
                        {job?.company ||
                          "Company Unavailable"}
                      </p>

                    </div>


                    {/* Status */}

                    <div>
                        <ApplicationStatus
                            status={application.status}
                        />
                        </div>

                  </div>


                  {/* Job Information */}

                  <div className="mt-5 grid gap-3 text-sm text-gray-600 sm:grid-cols-2 lg:grid-cols-4">

                    {job?.location && (
                      <div className="flex items-center gap-2">

                        <FiMapPin />

                        <span>
                          {job.location}
                        </span>

                      </div>
                    )}


                    {job?.jobType && (
                      <div className="flex items-center gap-2">

                        <FiBriefcase />

                        <span>
                          {job.jobType}
                        </span>

                      </div>
                    )}


                    {job?.workMode && (
                      <div className="flex items-center gap-2">

                        <FiClock />

                        <span>
                          {job.workMode}
                        </span>

                      </div>
                    )}


                    {job?.experienceLevel && (
                      <div className="flex items-center gap-2">

                        <span className="font-medium">
                          Experience:
                        </span>

                        <span>
                          {job.experienceLevel}
                        </span>

                      </div>
                    )}

                  </div>


                  {/* Footer */}

                  <div className="mt-6 flex flex-col justify-between gap-4 border-t border-gray-100 pt-5 sm:flex-row sm:items-center">

                    <div className="text-sm text-gray-500">

                      Applied on{" "}

                      <span className="font-medium text-gray-700">
                        {new Date(
                          application.createdAt
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>

                    </div>


                    {/* View Details */}

                    <button
                      onClick={() =>
                        navigate(
                          `/student/applications/${application._id}`
                        )
                      }
                      className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-blue-600 hover:text-blue-600"
                    >

                      <FiEye />

                      View Details

                    </button>

                  </div>

                </div>
              );

            }
          )}

        </div>

      </div>

    </div>
  );

};

export default MyApplications;