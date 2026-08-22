import {
  FiMapPin,
  FiBriefcase,
  FiClock,
  FiDollarSign,
} from "react-icons/fi";

import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  return (
    <div className="flex h-full min-w-0 flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:p-6">

      {/* Company / Title */}
      <div className="mb-4 min-w-0">

        <h3 className="break-words text-lg font-semibold leading-6 text-gray-900 sm:text-xl">
          {job.title}
        </h3>

        <p className="mt-1 break-words text-sm text-gray-500">
          {job.company}
        </p>

      </div>


      {/* Job Information */}
      <div className="space-y-2 text-sm text-gray-600">

        <div className="flex min-w-0 items-start gap-2">

          <FiMapPin className="mt-0.5 shrink-0" />

          <span className="min-w-0 break-words">
            {job.location}
          </span>

        </div>


        <div className="flex min-w-0 items-start gap-2">

          <FiBriefcase className="mt-0.5 shrink-0" />

          <span className="min-w-0 break-words capitalize">
            {job.jobType}
          </span>

        </div>


        <div className="flex min-w-0 items-start gap-2">

          <FiClock className="mt-0.5 shrink-0" />

          <span className="min-w-0 break-words capitalize">
            {job.workMode}
          </span>

        </div>


        {job.salary && (
          <div className="flex min-w-0 items-start gap-2">

            <FiDollarSign className="mt-0.5 shrink-0" />

            <span className="min-w-0 break-words">
              ₹{job.salary.min} - ₹{job.salary.max}
            </span>

          </div>
        )}

      </div>


      {/* Skills */}
      {job.skills?.length > 0 && (

        <div className="mt-4 flex flex-wrap gap-2">

          {job.skills.map((skill) => (

            <span
              key={skill}
              className="max-w-full break-words rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600"
            >
              {skill}
            </span>

          ))}

        </div>

      )}


      {/* Button */}
      <div className="mt-auto pt-6">

        <Link
          to={`/jobs/${job._id}`}
          className="inline-flex min-h-10 w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 active:scale-[0.98] sm:w-auto"
        >
          View Details
        </Link>

      </div>

    </div>
  );
};

export default JobCard;