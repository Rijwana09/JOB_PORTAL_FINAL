import {
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiBriefcase,
  FiMinusCircle,
} from "react-icons/fi";


const STATUS_CONFIG = {
  applied: {
    label: "Applied",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    icon: FiClock,
  },

  shortlisted: {
    label: "Shortlisted",
    className:
      "bg-yellow-50 text-yellow-700 border-yellow-200",
    icon: FiBriefcase,
  },

  hired: {
    label: "Hired",
    className:
      "bg-green-50 text-green-700 border-green-200",
    icon: FiCheckCircle,
  },

  rejected: {
    label: "Rejected",
    className:
      "bg-red-50 text-red-700 border-red-200",
    icon: FiXCircle,
  },

  withdrawn: {
    label: "Withdrawn",
    className:
      "bg-gray-100 text-gray-600 border-gray-200",
    icon: FiMinusCircle,
  },
};


const ApplicationStatus = ({
  status,
  compact = false,
}) => {

  const normalizedStatus =
    status?.toLowerCase();

  const config =
    STATUS_CONFIG[normalizedStatus] ||
    {
      label: "Unknown",
      className:
        "bg-gray-100 text-gray-600 border-gray-200",
      icon: FiClock,
    };

  const Icon = config.icon;


  return (
    <span
      className={`
        inline-flex
        items-center
        gap-2
        rounded-full
        border
        font-medium
        ${config.className}
        ${
          compact
            ? "px-2.5 py-1 text-xs"
            : "px-3.5 py-1.5 text-sm"
        }
      `}
    >

      <Icon
        className={
          compact
            ? "text-xs"
            : "text-sm"
        }
      />

      {config.label}

    </span>
  );
};


export default ApplicationStatus;