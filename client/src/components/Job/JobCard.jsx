import {
  FiMapPin,
  FiBriefcase,
  FiClock,
  FiDollarSign,
} from "react-icons/fi";

import { Link } from "react-router-dom";

const JobCard = ({ job }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

      {/* Company */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900">
          {job.title}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          {job.company}
        </p>
      </div>

      {/* Job Information */}
      <div className="space-y-2 text-sm text-gray-600">

        <div className="flex items-center gap-2">
          <FiMapPin />
          <span>{job.location}</span>
        </div>

        <div className="flex items-center gap-2">
          <FiBriefcase />
          <span>{job.jobType}</span>
        </div>

        <div className="flex items-center gap-2">
          <FiClock />
          <span>{job.workMode}</span>
        </div>

        {job.salary && (
          <div className="flex items-center gap-2">
            <FiDollarSign />

            <span>
              ₹{job.salary.min} - ₹
              {job.salary.max}
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
              className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Button */}
      <div className="mt-6">
        <Link
          to={`/jobs/${job._id}`}
          className="inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          View Details
        </Link>
      </div>

    </div>
  );
};

export default JobCard;