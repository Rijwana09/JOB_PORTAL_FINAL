import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FiArrowLeft,
  FiBriefcase,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiMapPin,
  FiRefreshCw,
} from "react-icons/fi";

import toast from "react-hot-toast";

import {
  getApplicationById,
} from "../../api/applicationApi";

import ApplicationStatus from "../../components/Application/ApplicationStatus";


const ApplicationDetails = () => {

  const {
    applicationId,
  } = useParams();

  const navigate =
    useNavigate();


  const [
    application,
    setApplication,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(true);


  /*
  |--------------------------------------------------------------------------
  | Fetch Application
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    const fetchApplication =
      async () => {

        try {

          setLoading(true);

          const response =
            await getApplicationById(
              applicationId
            );

          console.log(
            "Application Details API Response:",
            response
          );


          /*
          |--------------------------------------------------------------------------
          | ApiResponse structure
          |--------------------------------------------------------------------------
          |
          | response
          |   └── data
          |       └── application
          |
          */

          setApplication(
            response?.data || null
          );

        } catch (error) {

          console.error(
            "Failed to fetch application:",
            error
          );

          toast.error(
            error.response?.data?.message ||
              "Failed to load application details"
          );

          navigate(
            "/student/applications"
          );

        } finally {

          setLoading(false);

        }

      };


    if (applicationId) {
      fetchApplication();
    }

  }, [
    applicationId,
    navigate,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Loading State
  |--------------------------------------------------------------------------
  */

  if (loading) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">

        <div className="flex items-center gap-3 text-gray-500">

          <FiRefreshCw className="animate-spin" />

          <span>
            Loading application...
          </span>

        </div>

      </div>
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Application Not Found
  |--------------------------------------------------------------------------
  */

  if (!application) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">

        <div className="text-center">

          <h2 className="text-xl font-semibold text-gray-800">
            Application not found
          </h2>

          <button
            onClick={() =>
              navigate(
                "/student/applications"
              )
            }
            className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Back to Applications
          </button>

        </div>

      </div>
    );

  }


  const job =
    application.job;


  /*
  |--------------------------------------------------------------------------
  | Status Badge
  |--------------------------------------------------------------------------
  */

  const getStatusClass =
    (status) => {

      switch (status) {

        case "applied":
          return "bg-blue-100 text-blue-700";

        case "shortlisted":
          return "bg-yellow-100 text-yellow-700";

        case "rejected":
          return "bg-red-100 text-red-700";

        case "hired":
          return "bg-green-100 text-green-700";

        default:
          return "bg-gray-100 text-gray-700";

      }

    };


  /*
  |--------------------------------------------------------------------------
  | Format Status
  |--------------------------------------------------------------------------
  */

  const formatStatus =
    (status) => {

      if (!status) {
        return "Unknown";
      }

      return status
        .charAt(0)
        .toUpperCase() +
        status.slice(1);

    };


  /*
  |--------------------------------------------------------------------------
  | Format Date
  |--------------------------------------------------------------------------
  */

  const formatDate =
    (date) => {

      if (!date) {
        return "N/A";
      }

      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );

    };


  return (

    <div className="min-h-screen bg-gray-50">

      <div className="mx-auto max-w-5xl px-4 py-8">


        {/* ------------------------------------------------
            Back Button
        ------------------------------------------------ */}

        <button
          onClick={() =>
            navigate(
              "/student/applications"
            )
          }
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-blue-600"
        >

          <FiArrowLeft />

          Back to My Applications

        </button>


        {/* ------------------------------------------------
            Application Header
        ------------------------------------------------ */}

        <div className="rounded-xl bg-white p-6 shadow-sm">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">

            <div>

              <h1 className="text-2xl font-bold text-gray-900">
                {job?.title || "Job Title"}
              </h1>

              <p className="mt-2 text-lg text-gray-500">
                {job?.company || "Company"}
              </p>

            </div>


            <span
              className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusClass(
                application.status
              )}`}
            >

              {formatStatus(
                application.status
              )}

            </span>

          </div>


          {/* ------------------------------------------------
              Job Information
          ------------------------------------------------ */}

          <div className="mt-6 grid gap-4 border-t pt-6 sm:grid-cols-2 lg:grid-cols-3">


            <div className="flex items-center gap-3 text-gray-600">

              <FiMapPin className="text-blue-600" />

              <span>
                {job?.location || "N/A"}
              </span>

            </div>


            <div className="flex items-center gap-3 text-gray-600">

              <FiBriefcase className="text-blue-600" />

              <span>
                {job?.jobType || "N/A"}
              </span>

            </div>


            <div className="flex items-center gap-3 text-gray-600">

              <FiClock className="text-blue-600" />

              <span>
                {job?.workMode || "N/A"}
              </span>

            </div>


            <div className="flex items-center gap-3 text-gray-600">

              <FiDollarSign className="text-blue-600" />

              <span>

                {job?.salary
                  ? `₹${job.salary.min} - ₹${job.salary.max}`
                  : "Not specified"}

              </span>

            </div>


            <div className="flex items-center gap-3 text-gray-600">

              <FiCalendar className="text-blue-600" />

              <span>

                Applied on{" "}
                {formatDate(
                  application.createdAt
                )}

              </span>

            </div>


            <div className="flex items-center gap-3 text-gray-600">

              <FiCalendar className="text-blue-600" />

              <span>

                Updated on{" "}
                {formatDate(
                  application.updatedAt
                )}

              </span>

            </div>

          </div>

        </div>


        {/* ------------------------------------------------
            Application Information
        ------------------------------------------------ */}

        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-gray-900">
            Application Information
          </h2>


          <div className="mt-5 space-y-4">


            <div className="flex flex-col gap-1 border-b pb-4 sm:flex-row sm:justify-between">

              <span className="text-gray-500">
                Application ID
              </span>

              <span className="break-all font-medium text-gray-800">
                {application._id}
              </span>

            </div>


            <div className="flex flex-col gap-1 border-b pb-4 sm:flex-row sm:justify-between">

              <span className="text-gray-500">
                Current Status
              </span>

              <span
                className={`w-fit rounded-full px-3 py-1 text-sm font-medium ${getStatusClass(
                  application.status
                )}`}
              >

                {formatStatus(
                  application.status
                )}

              </span>

            </div>


            <div className="flex flex-col gap-1 border-b pb-4 sm:flex-row sm:justify-between">

              <span className="text-gray-500">
                Application Date
              </span>

              <span className="font-medium text-gray-800">
                {formatDate(
                  application.createdAt
                )}
              </span>

            </div>


            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">

              <span className="text-gray-500">
                Last Updated
              </span>

              <span className="font-medium text-gray-800">
                {formatDate(
                  application.updatedAt
                )}
              </span>

            </div>

          </div>

        </div>


        {/* ------------------------------------------------
            Job Details
        ------------------------------------------------ */}

        <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold text-gray-900">
            Job Details
          </h2>


          <div className="mt-5 grid gap-5 sm:grid-cols-2">


            <div>

              <p className="text-sm text-gray-500">
                Experience Level
              </p>

              <p className="mt-1 font-medium text-gray-800">
                {job?.experienceLevel || "N/A"}
              </p>

            </div>


            <div>

              <p className="text-sm text-gray-500">
                Job Type
              </p>

              <p className="mt-1 font-medium text-gray-800">
                {job?.jobType || "N/A"}
              </p>

            </div>


            <div>

              <p className="text-sm text-gray-500">
                Work Mode
              </p>

              <p className="mt-1 font-medium text-gray-800">
                {job?.workMode || "N/A"}
              </p>

            </div>


            <div>

              <p className="text-sm text-gray-500">
                Application Deadline
              </p>

              <p className="mt-1 font-medium text-gray-800">
                {formatDate(
                  job?.applicationDeadline
                )}
              </p>

            </div>

          </div>

        </div>


        {/* ------------------------------------------------
            Bottom Action
        ------------------------------------------------ */}

        <div className="mt-6">

          <button
            onClick={() =>
              navigate(
                "/student/applications"
              )
            }
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
          >

            <FiArrowLeft />

            Back to My Applications

          </button>

        </div>

      </div>

    </div>

  );

};


export default ApplicationDetails;