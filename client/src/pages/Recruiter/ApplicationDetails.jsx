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

import {
  motion,
} from "framer-motion";

import toast from "react-hot-toast";

import {
  getApplicationById,
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
    y: 20,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};


const buttonVariants = {
  hover: {
    x: 2,
    transition: {
      duration: 0.2,
    },
  },

  tap: {
    scale: 0.97,
  },
};


const cardHoverVariants = {
  hover: {
    y: -2,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};


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
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.25,
        }}
        className="flex min-h-screen items-center justify-center bg-gray-50 px-4"
      >

        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
          }}
          className="flex items-center gap-3 text-center text-gray-500"
        >

          <FiRefreshCw className="shrink-0 animate-spin" />

          <span>
            Loading application...
          </span>

        </motion.div>

      </motion.div>
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Application Not Found
  |--------------------------------------------------------------------------
  */

  if (!application) {

    return (
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        className="flex min-h-screen items-center justify-center bg-gray-50 px-4"
      >

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 0.3,
          }}
          className="w-full max-w-md rounded-xl bg-white p-6 text-center shadow-sm sm:p-8"
        >

          <h2 className="text-xl font-semibold text-gray-800">
            Application not found
          </h2>

          <motion.button
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.97,
            }}
            onClick={() =>
              navigate(
                "/student/applications"
              )
            }
            className="mt-4 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 sm:w-auto"
          >
            Back to Applications
          </motion.button>

        </motion.div>

      </motion.div>
    );

  }


  const job =
    application.job;


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


  /*
  |--------------------------------------------------------------------------
  | Format Salary
  |--------------------------------------------------------------------------
  */

  const formatSalary = () => {

    if (!job?.salary) {
      return "Not specified";
    }

    const {
      min,
      max,
    } = job.salary;

    if (
      min !== undefined &&
      max !== undefined
    ) {
      return `₹${min} - ₹${max}`;
    }

    if (min !== undefined) {
      return `₹${min}`;
    }

    if (max !== undefined) {
      return `₹${max}`;
    }

    return "Not specified";
  };


  return (

    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gray-50"
    >

      <div className="mx-auto w-full max-w-5xl px-3 py-5 sm:px-5 sm:py-7 md:px-6 md:py-8 lg:px-8">


        {/* ------------------------------------------------
            Back Button
        ------------------------------------------------ */}

        <motion.button
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          onClick={() =>
            navigate(
              "/student/applications"
            )
          }
          className="mb-5 flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-medium text-gray-600 transition hover:bg-white hover:text-blue-600 sm:mb-6"
        >

          <FiArrowLeft className="shrink-0" />

          <span>
            Back to My Applications
          </span>

        </motion.button>


        {/* ------------------------------------------------
            Application Header
        ------------------------------------------------ */}

        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          className="rounded-xl bg-white p-4 shadow-sm sm:p-6"
        >

          <div className="flex flex-col gap-4 sm:gap-5 md:flex-row md:items-start md:justify-between">

            <div className="min-w-0">

              <h1 className="break-words text-xl font-bold leading-tight text-gray-900 sm:text-2xl md:text-3xl">
                {job?.title || "Job Title"}
              </h1>

              <p className="mt-2 break-words text-base text-gray-500 sm:text-lg">
                {job?.company || "Company"}
              </p>

            </div>


            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              transition={{
                delay: 0.15,
                duration: 0.3,
              }}
              className="shrink-0"
            >

              <ApplicationStatus
                status={application.status}
              />

            </motion.div>

          </div>


          {/* ------------------------------------------------
              Job Information Grid
          ------------------------------------------------ */}

          <div className="mt-5 grid grid-cols-1 gap-3 border-t pt-5 sm:mt-6 sm:grid-cols-2 sm:gap-4 sm:pt-6 lg:grid-cols-3">

            {[
              {
                icon: FiMapPin,
                value: job?.location || "N/A",
              },

              {
                icon: FiBriefcase,
                value: job?.jobType || "N/A",
              },

              {
                icon: FiClock,
                value: job?.workMode || "N/A",
              },

              {
                icon: FiDollarSign,
                value: formatSalary(),
              },

              {
                icon: FiCalendar,
                value: `Applied on ${formatDate(
                  application.createdAt
                )}`,
              },

              {
                icon: FiCalendar,
                value: `Updated on ${formatDate(
                  application.updatedAt
                )}`,
              },
            ].map(
              (
                item,
                index
              ) => {

                const Icon =
                  item.icon;

                return (
                  <motion.div
                    key={index}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      delay:
                        0.15 +
                        index * 0.05,
                      duration: 0.3,
                    }}
                    whileHover={{
                      y: -2,
                    }}
                    className="flex min-w-0 items-center gap-3 rounded-lg bg-gray-50 p-3 text-sm text-gray-600"
                  >

                    <Icon className="shrink-0 text-blue-600" />

                    <span className="break-words">
                      {item.value}
                    </span>

                  </motion.div>
                );
              }
            )}

          </div>

        </motion.div>


        {/* ------------------------------------------------
            Application Information
        ------------------------------------------------ */}

        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{
            delay: 0.15,
          }}
          className="mt-5 rounded-xl bg-white p-4 shadow-sm sm:mt-6 sm:p-6"
        >

          <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
            Application Information
          </h2>


          <div className="mt-4 divide-y">

            <motion.div
              whileHover={{
                x: 2,
              }}
              className="flex flex-col gap-1 py-4 first:pt-0 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
            >

              <span className="shrink-0 text-sm text-gray-500">
                Application ID
              </span>

              <span className="break-all text-sm font-medium text-gray-800 sm:text-right">
                {application._id}
              </span>

            </motion.div>


            <motion.div
              whileHover={{
                x: 2,
              }}
              className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
            >

              <span className="text-sm text-gray-500">
                Current Status
              </span>

              <div className="sm:text-right">

                <ApplicationStatus
                  status={application.status}
                />

              </div>

            </motion.div>


            <motion.div
              whileHover={{
                x: 2,
              }}
              className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
            >

              <span className="text-sm text-gray-500">
                Application Date
              </span>

              <span className="text-sm font-medium text-gray-800 sm:text-right">
                {formatDate(
                  application.createdAt
                )}
              </span>

            </motion.div>


            <motion.div
              whileHover={{
                x: 2,
              }}
              className="flex flex-col gap-1 py-4 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
            >

              <span className="text-sm text-gray-500">
                Last Updated
              </span>

              <span className="text-sm font-medium text-gray-800 sm:text-right">
                {formatDate(
                  application.updatedAt
                )}
              </span>

            </motion.div>

          </div>

        </motion.div>


        {/* ------------------------------------------------
            Application Timeline
        ------------------------------------------------ */}

        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{
            delay: 0.25,
          }}
          className="mt-5 sm:mt-6"
        >

          <ApplicationTimeline
            status={application.status}
            appliedAt={application.createdAt}
            updatedAt={application.updatedAt}
          />

        </motion.div>


        {/* ------------------------------------------------
            Job Details
        ------------------------------------------------ */}

        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{
            delay: 0.3,
          }}
          className="mt-5 rounded-xl bg-white p-4 shadow-sm sm:mt-6 sm:p-6"
        >

          <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
            Job Details
          </h2>


          <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-5 sm:mt-5 sm:grid-cols-2">

            {[
              {
                label: "Experience Level",
                value:
                  job?.experienceLevel ||
                  "N/A",
              },

              {
                label: "Job Type",
                value:
                  job?.jobType ||
                  "N/A",
              },

              {
                label: "Work Mode",
                value:
                  job?.workMode ||
                  "N/A",
              },

              {
                label: "Application Deadline",
                value:
                  formatDate(
                    job?.applicationDeadline
                  ),
              },
            ].map(
              (
                item,
                index
              ) => (

                <motion.div
                  key={item.label}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay:
                      0.35 +
                      index * 0.05,
                    duration: 0.3,
                  }}
                  whileHover={{
                    x: 2,
                  }}
                >

                  <p className="text-xs font-medium uppercase tracking-wide text-gray-500 sm:text-sm">
                    {item.label}
                  </p>

                  <p className="mt-1 break-words text-sm font-medium text-gray-800 sm:text-base">
                    {item.value}
                  </p>

                </motion.div>

              )
            )}

          </div>

        </motion.div>


        {/* ------------------------------------------------
            Bottom Action
        ------------------------------------------------ */}

        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.4,
            duration: 0.3,
          }}
          className="mt-5 pb-5 sm:mt-6 sm:pb-8"
        >

          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() =>
              navigate(
                "/student/applications"
              )
            }
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:w-auto"
          >

            <FiArrowLeft />

            Back to My Applications

          </motion.button>

        </motion.div>

      </div>

    </motion.div>
  );
};


export default ApplicationDetails;