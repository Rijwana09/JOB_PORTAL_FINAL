import {
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiMinusCircle,
  FiBriefcase,
} from "react-icons/fi";

import {
  motion,
} from "framer-motion";


const ApplicationTimeline = ({
  status,
  appliedAt,
  updatedAt,
}) => {

  const normalizedStatus =
    status?.toLowerCase();


  const steps = [
    {
      key: "applied",
      label: "Application Submitted",
      description:
        "Your application has been submitted successfully.",
      icon: FiClock,
    },

    {
      key: "shortlisted",
      label: "Shortlisted",
      description:
        "Your application has been shortlisted by the recruiter.",
      icon: FiBriefcase,
    },

    {
      key: "hired",
      label: "Hired",
      description:
        "Congratulations! You have been selected for this position.",
      icon: FiCheckCircle,
    },
  ];


  const statusOrder = {
    applied: 0,
    shortlisted: 1,
    hired: 2,
  };


  const currentStep =
    statusOrder[normalizedStatus] ?? 0;


  const isRejected =
    normalizedStatus === "rejected";

  const isWithdrawn =
    normalizedStatus === "withdrawn";


  const formatDate = (date) => {

    if (!date) {
      return null;
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


  const terminalConfig = isRejected
    ? {
        label: "Application Rejected",
        description:
          "Unfortunately, this application was not selected.",
        icon: FiXCircle,
      }
    : {
        label: "Application Withdrawn",
        description:
          "You have withdrawn this application.",
        icon: FiMinusCircle,
      };


  return (
    <div className="rounded-xl bg-white p-4 shadow-sm sm:p-6">

      {/* Header */}

      <div className="mb-5 sm:mb-6">

        <h2 className="text-lg font-semibold text-gray-900 sm:text-xl">
          Application Timeline
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Track the progress of your application.
        </p>

      </div>


      {/* Timeline */}

      <div className="relative">

        {steps.map(
          (step, index) => {

            const Icon =
              step.icon;

            const isCompleted =
              !isRejected &&
              !isWithdrawn &&
              currentStep >=
                statusOrder[step.key];

            const isCurrent =
              !isRejected &&
              !isWithdrawn &&
              normalizedStatus ===
                step.key;

            const isLast =
              index ===
              steps.length - 1;


            return (
              <motion.div
                key={step.key}
                initial={{
                  opacity: 0,
                  x: -15,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay:
                    index * 0.12,
                  duration: 0.35,
                  ease: "easeOut",
                }}
                className="relative flex gap-3 sm:gap-4"
              >

                {/* Connector */}

                {!isLast && (
                  <motion.div
                    initial={{
                      scaleY: 0,
                    }}
                    animate={{
                      scaleY:
                        isCompleted &&
                        currentStep >
                          statusOrder[
                            step.key
                          ]
                          ? 1
                          : 0,
                    }}
                    transition={{
                      delay:
                        0.15 +
                        index * 0.12,
                      duration: 0.35,
                    }}
                    style={{
                      transformOrigin:
                        "top",
                    }}
                    className={`absolute left-[15px] top-8 h-[calc(100%-8px)] w-0.5 ${
                      isCompleted &&
                      currentStep >
                        statusOrder[
                          step.key
                        ]
                        ? "bg-blue-500"
                        : "bg-gray-200"
                    }`}
                  />
                )}


                {/* Icon */}

                <motion.div
                  initial={{
                    scale: 0.7,
                  }}
                  animate={{
                    scale: 1,
                  }}
                  transition={{
                    delay:
                      index * 0.12,
                    duration: 0.25,
                  }}
                  className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                    isCompleted
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-300 bg-white text-gray-400"
                  }`}
                >

                  <Icon className="text-sm" />

                </motion.div>


                {/* Content */}

                <div
                  className={`min-w-0 flex-1 ${
                    isLast
                      ? "pb-0"
                      : "pb-8"
                  }`}
                >

                  <div className="flex flex-wrap items-center gap-2">

                    <h3
                      className={`break-words text-sm font-semibold sm:text-base ${
                        isCurrent
                          ? "text-blue-700"
                          : isCompleted
                          ? "text-gray-900"
                          : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </h3>


                    {isCurrent && (
                      <motion.span
                        initial={{
                          opacity: 0,
                          scale: 0.8,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                        }}
                        className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 sm:text-xs"
                      >
                        Current
                      </motion.span>
                    )}

                  </div>


                  <p
                    className={`mt-1 max-w-2xl text-xs leading-5 sm:text-sm ${
                      isCompleted
                        ? "text-gray-600"
                        : "text-gray-400"
                    }`}
                  >
                    {step.description}
                  </p>


                  {/* Applied Date */}

                  {step.key ===
                    "applied" &&
                    appliedAt && (
                      <p className="mt-2 text-xs text-gray-400">
                        Submitted on{" "}
                        <span className="font-medium">
                          {formatDate(
                            appliedAt
                          )}
                        </span>
                      </p>
                    )}


                  {/* Updated Date */}

                  {isCurrent &&
                    updatedAt &&
                    appliedAt &&
                    new Date(
                      updatedAt
                    ).getTime() !==
                      new Date(
                        appliedAt
                      ).getTime() && (
                      <p className="mt-1 text-xs text-gray-400">
                        Last updated{" "}
                        <span className="font-medium">
                          {formatDate(
                            updatedAt
                          )}
                        </span>
                      </p>
                    )}

                </div>

              </motion.div>
            );
          }
        )}


        {/* ------------------------------------------------
            Rejected / Withdrawn
        ------------------------------------------------ */}

        {(isRejected ||
          isWithdrawn) && (

          <motion.div
            initial={{
              opacity: 0,
              x: -15,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.4,
              duration: 0.35,
            }}
            className="relative mt-2 flex gap-3 sm:gap-4"
          >

            {/* Connector */}

            <div className="absolute left-[15px] -top-2 h-4 w-0.5 bg-gray-200" />


            {/* Icon */}

            <motion.div
              initial={{
                scale: 0.7,
              }}
              animate={{
                scale: 1,
              }}
              transition={{
                delay: 0.4,
                duration: 0.25,
              }}
              className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${
                isRejected
                  ? "border-red-500 bg-red-500 text-white"
                  : "border-gray-500 bg-gray-500 text-white"
              }`}
            >

              {(() => {

                const Icon =
                  terminalConfig.icon;

                return (
                  <Icon className="text-sm" />
                );

              })()}

            </motion.div>


            {/* Content */}

            <div className="min-w-0 flex-1">

              <h3
                className={`break-words text-sm font-semibold sm:text-base ${
                  isRejected
                    ? "text-red-700"
                    : "text-gray-700"
                }`}
              >
                {terminalConfig.label}
              </h3>


              <p className="mt-1 text-xs leading-5 text-gray-600 sm:text-sm">
                {terminalConfig.description}
              </p>


              {updatedAt && (
                <p className="mt-2 text-xs text-gray-400">
                  Updated on{" "}
                  <span className="font-medium">
                    {formatDate(
                      updatedAt
                    )}
                  </span>
                </p>
              )}

            </div>

          </motion.div>
        )}

      </div>

    </div>
  );
};


export default ApplicationTimeline;