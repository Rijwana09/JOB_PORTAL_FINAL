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
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiMapPin,
  FiRefreshCw,
  FiXCircle,
} from "react-icons/fi";

import toast from "react-hot-toast";

import {
  getApplicationById,
} from "../../api/applicationApi";

import api from "../../api/axios";


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


  const [
    error,
    setError,
  ] = useState("");


  const [
    withdrawing,
    setWithdrawing,
  ] = useState(false);


  /*
  |--------------------------------------------------------------------------
  | Fetch Application
  |--------------------------------------------------------------------------
  */

  const fetchApplication =
    async () => {

      try {

        setLoading(true);
        setError("");

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
        | Backend ApiResponse
        |--------------------------------------------------------------------------
        |
        | response
        |   └── data
        |       └── application
        |
        */

        if (!response?.data) {

          throw new Error(
            "Application data not found"
          );

        }

        setApplication(
          response.data
        );

      } catch (error) {

        console.error(
          "Failed to fetch application:",
          error
        );

        const message =
          error.response?.data?.message ||
          error.message ||
          "Failed to load application details";

        setError(message);

      } finally {

        setLoading(false);

      }

    };


  /*
  |--------------------------------------------------------------------------
  | Initial Fetch
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    if (applicationId) {
      fetchApplication();
    }

  }, [
    applicationId,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Withdraw Application
  |--------------------------------------------------------------------------
  */

  const handleWithdraw =
    async () => {

      if (!application?._id) {
        return;
      }

      const confirmed =
        window.confirm(
          "Are you sure you want to withdraw this application?"
        );

      if (!confirmed) {
        return;
      }

      try {

        setWithdrawing(true);

        const response =
          await api.patch(
            `/applications/${application._id}/withdraw`
          );

        toast.success(
          response?.data?.message ||
            "Application withdrawn successfully"
        );

        /*
        |--------------------------------------------------------------------------
        | Refresh Application
        |--------------------------------------------------------------------------
        */

        await fetchApplication();

      } catch (error) {

        console.error(
          "Failed to withdraw application:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to withdraw application"
        );

      } finally {

        setWithdrawing(false);

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

        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4">

          <div className="flex items-center gap-3 text-gray-500">

            <FiRefreshCw
              className="animate-spin text-lg"
            />

            <span>
              Loading application...
            </span>

          </div>

        </div>

      </div>
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Error State
  |--------------------------------------------------------------------------
  */

  if (error) {

    return (
      <div className="min-h-screen bg-gray-50">

        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">

              <FiXCircle className="text-2xl text-red-600" />

            </div>

            <h2 className="mt-5 text-xl font-semibold text-gray-900">
              Unable to Load Application
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {error}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">

              <button
                onClick={fetchApplication}
                className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
              >

                <FiRefreshCw />

                Retry

              </button>

              <button
                onClick={() =>
                  navigate(
                    "/student/applications"
                  )
                }
                className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
              >

                <FiArrowLeft />

                Back to Applications

              </button>

            </div>

          </div>

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
      <div className="min-h-screen bg-gray-50">

        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-4">

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
              className="mt-4 rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
            >
              Back to Applications
            </button>

          </div>

        </div>

      </div>
    );

  }


  const job =
    application.job;


  /*
  |--------------------------------------------------------------------------
  | Status Helpers
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

        case "withdrawn":
          return "bg-gray-100 text-gray-700";

        default:
          return "bg-gray-100 text-gray-700";

      }

    };


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
  | Date Formatter
  |--------------------------------------------------------------------------
  */

  const formatDate =
    (date) => {

      if (!date) {
        return "N/A";
      }

      const parsedDate =
        new Date(date);

      if (
        Number.isNaN(
          parsedDate.getTime()
        )
      ) {
        return "N/A";
      }

      return parsedDate.toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );

    };


  /*
  |--------------------------------------------------------------------------
  | Date + Time Formatter
  |--------------------------------------------------------------------------
  */

  const formatDateTime =
    (date) => {

      if (!date) {
        return "N/A";
      }

      const parsedDate =
        new Date(date);

      if (
        Number.isNaN(
          parsedDate.getTime()
        )
      ) {
        return "N/A";
      }

      return parsedDate.toLocaleString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );

    };


  /*
  |--------------------------------------------------------------------------
  | Salary Formatter
  |--------------------------------------------------------------------------
  */

  const formatSalary =
    (salary) => {

      if (!salary) {
        return "Not specified";
      }

      if (
        typeof salary === "string" ||
        typeof salary === "number"
      ) {
        return String(salary);
      }

      if (
        salary.min !== undefined &&
        salary.max !== undefined
      ) {

        return `₹${salary.min} - ₹${salary.max}`;

      }

      if (
        salary.min !== undefined
      ) {

        return `₹${salary.min}+`;

      }

      if (
        salary.max !== undefined
      ) {

        return `Up to ₹${salary.max}`;

      }

      return "Not specified";

    };


  /*
  |--------------------------------------------------------------------------
  | Application Status Timeline
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  | The backend does not store status history.
  |
  | Therefore this is NOT historical data.
  | It represents the current application progression
  | based on the current status.
  |
  */

  const timelineStatuses = [
    "applied",
    "shortlisted",
    "hired",
  ];


  const getTimelineState =
    (status) => {

      if (
        status === "rejected"
      ) {
        return {
          applied: "completed",
          shortlisted: "inactive",
          hired: "inactive",
        };
      }

      if (
        status === "withdrawn"
      ) {
        return {
          applied: "completed",
          shortlisted: "inactive",
          hired: "inactive",
        };
      }

      const currentIndex =
        timelineStatuses.indexOf(
          status
        );

      return {
        applied:
          currentIndex >= 0
            ? "completed"
            : "inactive",

        shortlisted:
          currentIndex >= 1
            ? "completed"
            : "inactive",

        hired:
          currentIndex >= 2
            ? "completed"
            : "inactive",
      };

    };


  const timelineState =
    getTimelineState(
      application.status
    );


  /*
  |--------------------------------------------------------------------------
  | Can Withdraw
  |--------------------------------------------------------------------------
  */

  const canWithdraw =
    application.status !==
      "withdrawn" &&
    application.status !==
      "rejected" &&
    application.status !==
      "hired";


  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

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

        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">

            <div>

              <p className="text-sm font-medium text-blue-600">
                Application Details
              </p>

              <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
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

              <FiMapPin className="shrink-0 text-blue-600" />

              <span>
                {job?.location || "N/A"}
              </span>

            </div>


            <div className="flex items-center gap-3 text-gray-600">

              <FiBriefcase className="shrink-0 text-blue-600" />

              <span>
                {job?.jobType || "N/A"}
              </span>

            </div>


            <div className="flex items-center gap-3 text-gray-600">

              <FiClock className="shrink-0 text-blue-600" />

              <span>
                {job?.workMode || "N/A"}
              </span>

            </div>


            <div className="flex items-center gap-3 text-gray-600">

              <FiDollarSign className="shrink-0 text-blue-600" />

              <span>
                {formatSalary(
                  job?.salary
                )}
              </span>

            </div>


            <div className="flex items-center gap-3 text-gray-600">

              <FiCalendar className="shrink-0 text-blue-600" />

              <span>
                Applied on{" "}
                {formatDate(
                  application.createdAt
                )}
              </span>

            </div>


            <div className="flex items-center gap-3 text-gray-600">

              <FiCalendar className="shrink-0 text-blue-600" />

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

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8">

          <h2 className="text-xl font-semibold text-gray-900">
            Application Information
          </h2>


          <div className="mt-5 space-y-4">

            <div className="flex flex-col gap-1 border-b pb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">

              <span className="text-gray-500">
                Application ID
              </span>

              <span className="break-all font-medium text-gray-800 sm:text-right">
                {application._id}
              </span>

            </div>


            <div className="flex flex-col gap-1 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">

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


            <div className="flex flex-col gap-1 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">

              <span className="text-gray-500">
                Application Date
              </span>

              <span className="font-medium text-gray-800">
                {formatDateTime(
                  application.createdAt
                )}
              </span>

            </div>


            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

              <span className="text-gray-500">
                Last Updated
              </span>

              <span className="font-medium text-gray-800">
                {formatDateTime(
                  application.updatedAt
                )}
              </span>

            </div>

          </div>

        </div>


        {/* ------------------------------------------------
            Status Progress
        ------------------------------------------------ */}

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8">

          <div>

            <h2 className="text-xl font-semibold text-gray-900">
              Application Progress
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Current application status
            </p>

          </div>


          <div className="mt-6 space-y-5">

            {timelineStatuses.map(
              (status, index) => {

                const state =
                  timelineState[
                    status
                  ];

                const isCurrent =
                  application.status ===
                  status;

                return (

                  <div
                    key={status}
                    className="flex items-start gap-4"
                  >

                    <div className="flex flex-col items-center">

                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full ${
                          state === "completed"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >

                        {state ===
                        "completed" ? (
                          <FiCheckCircle />
                        ) : (
                          <span className="h-2.5 w-2.5 rounded-full bg-current" />
                        )}

                      </div>

                      {index <
                        timelineStatuses.length -
                          1 && (
                        <div className="mt-1 h-7 w-px bg-gray-200" />
                      )}

                    </div>


                    <div className="pt-1">

                      <p
                        className={`font-semibold ${
                          isCurrent
                            ? "text-blue-600"
                            : state ===
                                "completed"
                              ? "text-gray-800"
                              : "text-gray-400"
                        }`}
                      >
                        {formatStatus(
                          status
                        )}

                        {isCurrent &&
                          " • Current"}
                      </p>

                    </div>

                  </div>

                );

              }
            )}


            {/* ------------------------------------------------
                Rejected / Withdrawn
            ------------------------------------------------ */}

            {(application.status ===
              "rejected" ||
              application.status ===
                "withdrawn") && (

              <div className="flex items-start gap-4">

                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-red-600">

                  <FiXCircle />

                </div>

                <div className="pt-1">

                  <p className="font-semibold text-red-600">

                    {formatStatus(
                      application.status
                    )}

                    {" • Current"}

                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    This application is no longer active.
                  </p>

                </div>

              </div>

            )}

          </div>

        </div>


        {/* ------------------------------------------------
            Job Details
        ------------------------------------------------ */}

        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8">

          <h2 className="text-xl font-semibold text-gray-900">
            Job Details
          </h2>


          <div className="mt-5 grid gap-5 sm:grid-cols-2">

            <div>

              <p className="text-sm text-gray-500">
                Experience Level
              </p>

              <p className="mt-1 font-medium text-gray-800">
                {job?.experienceLevel ||
                  "N/A"}
              </p>

            </div>


            <div>

              <p className="text-sm text-gray-500">
                Job Type
              </p>

              <p className="mt-1 font-medium text-gray-800">
                {job?.jobType ||
                  "N/A"}
              </p>

            </div>


            <div>

              <p className="text-sm text-gray-500">
                Work Mode
              </p>

              <p className="mt-1 font-medium text-gray-800">
                {job?.workMode ||
                  "N/A"}
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
            Actions
        ------------------------------------------------ */}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <button
            onClick={() =>
              navigate(
                "/student/applications"
              )
            }
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
          >

            <FiArrowLeft />

            Back to My Applications

          </button>


          {canWithdraw && (

            <button
              onClick={
                handleWithdraw
              }
              disabled={withdrawing}
              className="flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-5 py-3 font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {withdrawing ? (
                <>
                  <FiRefreshCw className="animate-spin" />

                  Withdrawing...
                </>
              ) : (
                <>
                  <FiXCircle />

                  Withdraw Application
                </>
              )}

            </button>

          )}

        </div>

      </div>

    </div>

  );

};


export default ApplicationDetails;