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
  FiXCircle,
} from "react-icons/fi";

import toast from "react-hot-toast";

import {
  getApplicationById,
} from "../../api/applicationApi";

import api from "../../api/axios";

import ApplicationStatus from "../../components/Application/ApplicationStatus";

import ApplicationTimeline from "../../components/Application/ApplicationTimeline";


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
          "Student Application Details:",
          response
        );

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
  | Format Date
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
  | Format Date Time
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
  | Format Salary
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
  | Loading
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
  | Error
  |--------------------------------------------------------------------------
  */

  if (error) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">

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
              onClick={
                fetchApplication
              }
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
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
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
            >

              <FiArrowLeft />

              Back

            </button>

          </div>

        </div>

      </div>
    );

  }


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
            className="mt-4 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white"
          >
            Back to Applications
          </button>

        </div>

      </div>
    );

  }


  const job =
    application.job;


  const canWithdraw =
    application.status !==
      "withdrawn" &&
    application.status !==
      "rejected" &&
    application.status !==
      "hired";


  return (

    <div className="min-h-screen bg-gray-50">

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">


        {/* Back */}

        <button
          onClick={() =>
            navigate(
              "/student/applications"
            )
          }
          className="mb-6 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-gray-600 transition hover:bg-white hover:text-blue-600"
        >

          <FiArrowLeft />

          Back to My Applications

        </button>


        {/* Header */}

        <div className="rounded-2xl bg-white p-5 shadow-sm sm:p-7">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

            <div>

              <p className="text-sm font-medium text-blue-600">
                Application Details
              </p>

              <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
                {job?.title ||
                  "Job Title"}
              </h1>

              <p className="mt-2 text-lg text-gray-500">
                {job?.company ||
                  "Company"}
              </p>

            </div>

            <ApplicationStatus
              status={
                application.status
              }
            />

          </div>


          <div className="mt-6 grid gap-3 border-t pt-6 sm:grid-cols-2 lg:grid-cols-3">

            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 text-gray-600">

              <FiMapPin className="text-blue-600" />

              <span>
                {job?.location ||
                  "N/A"}
              </span>

            </div>


            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 text-gray-600">

              <FiBriefcase className="text-blue-600" />

              <span>
                {job?.jobType ||
                  "N/A"}
              </span>

            </div>


            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 text-gray-600">

              <FiClock className="text-blue-600" />

              <span>
                {job?.workMode ||
                  "N/A"}
              </span>

            </div>


            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 text-gray-600">

              <FiDollarSign className="text-blue-600" />

              <span>
                {formatSalary(
                  job?.salary
                )}
              </span>

            </div>


            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 text-gray-600">

              <FiCalendar className="text-blue-600" />

              <span>
                Applied on{" "}
                {formatDate(
                  application.createdAt
                )}
              </span>

            </div>


            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3 text-gray-600">

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


        {/* Application Information */}

        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm sm:p-7">

          <h2 className="text-xl font-semibold text-gray-900">
            Application Information
          </h2>

          <div className="mt-5 divide-y">

            <div className="flex flex-col gap-2 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between">

              <span className="text-sm text-gray-500">
                Application ID
              </span>

              <span className="break-all text-sm font-medium text-gray-800 sm:text-right">
                {application._id}
              </span>

            </div>


            <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">

              <span className="text-sm text-gray-500">
                Current Status
              </span>

              <ApplicationStatus
                status={
                  application.status
                }
              />

            </div>


            <div className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">

              <span className="text-sm text-gray-500">
                Application Date
              </span>

              <span className="text-sm font-medium text-gray-800 sm:text-right">
                {formatDateTime(
                  application.createdAt
                )}
              </span>

            </div>


            <div className="flex flex-col gap-2 py-4 last:pb-0 sm:flex-row sm:items-center sm:justify-between">

              <span className="text-sm text-gray-500">
                Last Updated
              </span>

              <span className="text-sm font-medium text-gray-800 sm:text-right">
                {formatDateTime(
                  application.updatedAt
                )}
              </span>

            </div>

          </div>

        </div>


        {/* Timeline */}

        <div className="mt-6">

          <ApplicationTimeline
            status={
              application.status
            }
            appliedAt={
              application.createdAt
            }
            updatedAt={
              application.updatedAt
            }
          />

        </div>


        {/* Job Details */}

        <div className="mt-6 rounded-2xl bg-white p-5 shadow-sm sm:p-7">

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


        {/* Actions */}

        <div className="mt-6 flex flex-col gap-3 pb-8 sm:flex-row sm:items-center sm:justify-between">

          <button
            onClick={() =>
              navigate(
                "/student/applications"
              )
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
          >

            <FiArrowLeft />

            Back to My Applications

          </button>


          {canWithdraw && (

            <button
              onClick={
                handleWithdraw
              }
              disabled={
                withdrawing
              }
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-5 py-3 font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
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