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
  FiMail,
  FiMapPin,
  FiRefreshCw,
  FiUser,
  FiXCircle,
} from "react-icons/fi";

import {
  motion,
} from "framer-motion";

import toast from "react-hot-toast";

import {
  getApplicationById,
  updateApplicationStatus,
} from "../../api/applicationApi";

import ApplicationStatus from "../../components/Application/ApplicationStatus";

import ApplicationTimeline from "../../components/Application/ApplicationTimeline";


/*
|--------------------------------------------------------------------------
| Animation Variants
|--------------------------------------------------------------------------
*/

const pageVariants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};


const itemVariants = {
  hidden: {
    opacity: 0,
    y: 15,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
};


/*
|--------------------------------------------------------------------------
| Component
|--------------------------------------------------------------------------
*/

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
    updatingStatus,
    setUpdatingStatus,
  ] = useState(false);


  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState("");


  /*
  |--------------------------------------------------------------------------
  | Fetch Application
  |--------------------------------------------------------------------------
  */

  const fetchApplication =
    async () => {

      try {

        setLoading(true);

        const response =
          await getApplicationById(
            applicationId
          );

        console.log(
          "Recruiter Application Details:",
          response
        );

        const applicationData =
          response?.data || null;

        setApplication(
          applicationData
        );

        setSelectedStatus(
          applicationData?.status || ""
        );

      } catch (error) {

        console.error(
          "Failed to fetch recruiter application:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load application details"
        );

        navigate(
          "/recruiter/applications"
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

    if (applicationId) {
      fetchApplication();
    }

  }, [
    applicationId,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Update Status
  |--------------------------------------------------------------------------
  */

  const handleStatusUpdate =
    async () => {

      if (!application?._id) {
        return;
      }

      if (
        !selectedStatus ||
        selectedStatus === application.status
      ) {
        return;
      }

      try {

        setUpdatingStatus(true);

        const response =
          await updateApplicationStatus(
            application._id,
            selectedStatus
          );

        toast.success(
          response?.message ||
            response?.data?.message ||
            "Application status updated successfully"
        );

        await fetchApplication();

      } catch (error) {

        console.error(
          "Failed to update application status:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to update application status"
        );

        setSelectedStatus(
          application.status
        );

      } finally {

        setUpdatingStatus(false);

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

      const {
        min,
        max,
      } = salary;

      if (
        min !== undefined &&
        max !== undefined
      ) {
        return `₹${min} - ₹${max}`;
      }

      if (
        min !== undefined
      ) {
        return `₹${min}+`;
      }

      if (
        max !== undefined
      ) {
        return `Up to ₹${max}`;
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

          <FiRefreshCw
            className="animate-spin"
          />

          <span>
            Loading application...
          </span>

        </div>

      </div>
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Not Found
  |--------------------------------------------------------------------------
  */

  if (!application) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">

        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">

            <FiXCircle className="text-2xl text-gray-500" />

          </div>

          <h2 className="mt-5 text-xl font-semibold text-gray-900">
            Application Not Found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            The application you're looking for could not be found.
          </p>

          <button
            onClick={() =>
              navigate(
                "/recruiter/applications"
              )
            }
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
          >

            <FiArrowLeft />

            Back to Applications

          </button>

        </div>

      </div>
    );

  }


  const job =
    application.job;

  const student =
    application.student;


  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (

    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50"
    >

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">


        {/* ------------------------------------------------
            Back
        ------------------------------------------------ */}

        <button
          onClick={() =>
            navigate(
              "/recruiter/applications"
            )
          }
          className="mb-6 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-gray-600 transition hover:bg-white hover:text-blue-600"
        >

          <FiArrowLeft />

          Back to Applications

        </button>


        {/* ------------------------------------------------
            Header
        ------------------------------------------------ */}

        <motion.div
          variants={itemVariants}
          className="rounded-2xl bg-white p-5 shadow-sm sm:p-7"
        >

          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

            <div className="min-w-0">

              <p className="text-sm font-medium text-blue-600">
                Candidate Application
              </p>

              <h1 className="mt-1 break-words text-2xl font-bold text-gray-900 sm:text-3xl">
                {student?.name ||
                  "Unknown Candidate"}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">

                <span className="inline-flex items-center gap-2">
                  <FiMail className="text-blue-600" />
                  {student?.email ||
                    "No email available"}
                </span>

                {job?.title && (
                  <span className="inline-flex items-center gap-2">
                    <FiBriefcase className="text-blue-600" />
                    {job.title}
                  </span>
                )}

              </div>

            </div>


            <div className="shrink-0">

              <ApplicationStatus
                status={
                  application.status
                }
              />

            </div>

          </div>


          {/* Application metadata */}

          <div className="mt-6 grid gap-3 border-t pt-6 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-lg bg-gray-50 p-4">

              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Applied
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-800">
                {formatDate(
                  application.createdAt
                )}
              </p>

            </div>


            <div className="rounded-lg bg-gray-50 p-4">

              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Last Updated
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-800">
                {formatDate(
                  application.updatedAt
                )}
              </p>

            </div>


            <div className="rounded-lg bg-gray-50 p-4">

              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Application ID
              </p>

              <p className="mt-1 break-all text-sm font-semibold text-gray-800">
                {application._id}
              </p>

            </div>


            <div className="rounded-lg bg-gray-50 p-4">

              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Current Status
              </p>

              <div className="mt-2">

                <ApplicationStatus
                  status={
                    application.status
                  }
                />

              </div>

            </div>

          </div>

        </motion.div>


        {/* ------------------------------------------------
            Candidate Information
        ------------------------------------------------ */}

        <motion.div
          variants={itemVariants}
          className="mt-6 rounded-2xl bg-white p-5 shadow-sm sm:p-7"
        >

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">

              <FiUser className="text-xl" />

            </div>

            <div>

              <h2 className="text-xl font-semibold text-gray-900">
                Candidate Information
              </h2>

              <p className="text-sm text-gray-500">
                Applicant details
              </p>

            </div>

          </div>


          <div className="mt-6 grid gap-5 sm:grid-cols-2">

            <div>

              <p className="text-sm text-gray-500">
                Full Name
              </p>

              <p className="mt-1 font-medium text-gray-800">
                {student?.name ||
                  "N/A"}
              </p>

            </div>


            <div>

              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="mt-1 break-all font-medium text-gray-800">
                {student?.email ||
                  "N/A"}
              </p>

            </div>


            {student?.phone && (

              <div>

                <p className="text-sm text-gray-500">
                  Phone
                </p>

                <p className="mt-1 font-medium text-gray-800">
                  {student.phone}
                </p>

              </div>

            )}


            {student?.location && (

              <div>

                <p className="text-sm text-gray-500">
                  Location
                </p>

                <p className="mt-1 font-medium text-gray-800">
                  {student.location}
                </p>

              </div>

            )}

          </div>

        </motion.div>


        {/* ------------------------------------------------
            Job Information
        ------------------------------------------------ */}

        <motion.div
          variants={itemVariants}
          className="mt-6 rounded-2xl bg-white p-5 shadow-sm sm:p-7"
        >

          <h2 className="text-xl font-semibold text-gray-900">
            Job Information
          </h2>


          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">

              <FiBriefcase className="shrink-0 text-blue-600" />

              <div>

                <p className="text-xs text-gray-500">
                  Job
                </p>

                <p className="font-medium text-gray-800">
                  {job?.title ||
                    "N/A"}
                </p>

              </div>

            </div>


            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">

              <FiMapPin className="shrink-0 text-blue-600" />

              <div>

                <p className="text-xs text-gray-500">
                  Location
                </p>

                <p className="font-medium text-gray-800">
                  {job?.location ||
                    "N/A"}
                </p>

              </div>

            </div>


            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">

              <FiClock className="shrink-0 text-blue-600" />

              <div>

                <p className="text-xs text-gray-500">
                  Work Mode
                </p>

                <p className="font-medium text-gray-800">
                  {job?.workMode ||
                    "N/A"}
                </p>

              </div>

            </div>


            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">

              <FiDollarSign className="shrink-0 text-blue-600" />

              <div>

                <p className="text-xs text-gray-500">
                  Salary
                </p>

                <p className="font-medium text-gray-800">
                  {formatSalary(
                    job?.salary
                  )}
                </p>

              </div>

            </div>


            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">

              <FiCalendar className="shrink-0 text-blue-600" />

              <div>

                <p className="text-xs text-gray-500">
                  Applied On
                </p>

                <p className="font-medium text-gray-800">
                  {formatDate(
                    application.createdAt
                  )}
                </p>

              </div>

            </div>


            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-4">

              <FiCalendar className="shrink-0 text-blue-600" />

              <div>

                <p className="text-xs text-gray-500">
                  Deadline
                </p>

                <p className="font-medium text-gray-800">
                  {formatDate(
                    job?.applicationDeadline
                  )}
                </p>

              </div>

            </div>

          </div>

        </motion.div>


        {/* ------------------------------------------------
            Application Progress
        ------------------------------------------------ */}

        <motion.div
          variants={itemVariants}
          className="mt-6"
        >

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

        </motion.div>


        {/* ------------------------------------------------
            Update Status
        ------------------------------------------------ */}

        <motion.div
          variants={itemVariants}
          className="mt-6 rounded-2xl bg-white p-5 shadow-sm sm:p-7"
        >

          <div>

            <h2 className="text-xl font-semibold text-gray-900">
              Update Application Status
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Change the candidate's application status.
            </p>

          </div>


          <div className="mt-5 flex flex-col gap-3 sm:flex-row">

            <select
              value={selectedStatus}
              onChange={(event) =>
                setSelectedStatus(
                  event.target.value
                )
              }
              disabled={
                updatingStatus
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:max-w-xs"
            >

              <option value="applied">
                Applied
              </option>

              <option value="shortlisted">
                Shortlisted
              </option>

              <option value="rejected">
                Rejected
              </option>

              <option value="hired">
                Hired
              </option>

            </select>


            <button
              type="button"
              onClick={
                handleStatusUpdate
              }
              disabled={
                updatingStatus ||
                selectedStatus ===
                  application.status
              }
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {updatingStatus ? (
                <>
                  <FiRefreshCw className="animate-spin" />

                  Updating...
                </>
              ) : (
                <>
                  <FiCheckCircle />

                  Update Status
                </>
              )}

            </button>

          </div>

        </motion.div>


        {/* ------------------------------------------------
            Bottom Actions
        ------------------------------------------------ */}

        <div className="mt-6 flex flex-col gap-3 pb-8 sm:flex-row sm:justify-between">

          <button
            onClick={() =>
              navigate(
                "/recruiter/applications"
              )
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >

            <FiArrowLeft />

            Back to Applications

          </button>


          <button
            onClick={
              fetchApplication
            }
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >

            <FiRefreshCw
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh

          </button>

        </div>

      </div>

    </motion.div>

  );

};


export default ApplicationDetails;