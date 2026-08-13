import Job from "../models/Job.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

class JobService {

  /*
  |--------------------------------------------------------------------------
  | Create Job
  |--------------------------------------------------------------------------
  */

  async createJob(jobData, recruiterId) {
    const recruiter = await User.findById(
      recruiterId
    );

    if (!recruiter) {
      throw new ApiError(
        404,
        "Recruiter not found"
      );
    }

    if (recruiter.role !== "recruiter") {
      throw new ApiError(
        403,
        "Only recruiters can create jobs"
      );
    }

    const job = await Job.create({
      ...jobData,
      recruiter: recruiterId,
    });

    return job;
  }

  /*
  |--------------------------------------------------------------------------
  | Get All Jobs
  |--------------------------------------------------------------------------
  */

  /*
|--------------------------------------------------------------------------
| Get All Jobs
|--------------------------------------------------------------------------
*/

async getAllJobs(filters = {}) {
  const {
    search,
    location,
    jobType,
    workMode,
    experienceLevel,
    skills,
    minSalary,
    maxSalary,

    page = 1,
    limit = 10,

    sortBy = "createdAt",
    sortOrder = "desc",

    status = "published",
  } = filters;

  const query = {};

  /*
  |--------------------------------------------------------------------------
  | Status
  |--------------------------------------------------------------------------
  */

  if (status) {
    query.status = status;
  }

  /*
  |--------------------------------------------------------------------------
  | Keyword Search
  |--------------------------------------------------------------------------
  */

  if (search) {
    query.$text = {
      $search: search,
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Location
  |--------------------------------------------------------------------------
  */

  if (location) {
    query.location = {
      $regex: location,
      $options: "i",
    };
  }

  /*
  |--------------------------------------------------------------------------
  | Job Type
  |--------------------------------------------------------------------------
  */

  if (jobType) {
    query.jobType = jobType;
  }

  /*
  |--------------------------------------------------------------------------
  | Work Mode
  |--------------------------------------------------------------------------
  */

  if (workMode) {
    query.workMode = workMode;
  }

  /*
  |--------------------------------------------------------------------------
  | Experience Level
  |--------------------------------------------------------------------------
  */

  if (experienceLevel) {
    query.experienceLevel =
      experienceLevel;
  }

  /*
  |--------------------------------------------------------------------------
  | Skills
  |--------------------------------------------------------------------------
  */

  if (skills) {
    const skillArray = Array.isArray(skills)
      ? skills
      : skills.split(",");

    query.skills = {
      $in: skillArray.map((skill) =>
        new RegExp(
          `^${skill.trim()}$`,
          "i"
        )
      ),
    };
  }

  /*
|--------------------------------------------------------------------------
| Salary Filter
|--------------------------------------------------------------------------
*/

if (
  minSalary !== undefined ||
  maxSalary !== undefined
) {
  const salaryFilter = {};

    if (minSalary !== undefined) {
      salaryFilter["salary.max"] = {
        $gte: Number(minSalary),
      };
    }

    if (maxSalary !== undefined) {
      salaryFilter["salary.min"] = {
        $lte: Number(maxSalary),
      };
    }

    Object.assign(query, salaryFilter);
}

  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  const currentPage = Math.max(
    Number(page) || 1,
    1
  );

  const itemsPerPage = Math.min(
    Math.max(Number(limit) || 10, 1),
    100
  );

  const skip =
    (currentPage - 1) *
    itemsPerPage;

  /*
  |--------------------------------------------------------------------------
  | Sorting
  |--------------------------------------------------------------------------
  */

  const allowedSortFields = [
    "createdAt",
    "updatedAt",
    "title",
    "company",
  ];

  const safeSortBy =
    allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

  const safeSortOrder =
    sortOrder === "asc" ? 1 : -1;

  const sort = {
    [safeSortBy]: safeSortOrder,
  };

  /*
  |--------------------------------------------------------------------------
  | Fetch Jobs
  |--------------------------------------------------------------------------
  */

  const [jobs, totalJobs] =
    await Promise.all([
      Job.find(query)
        .populate(
          "recruiter",
          "name email avatar"
        )
        .sort(sort)
        .skip(skip)
        .limit(itemsPerPage),

      Job.countDocuments(query),
    ]);

  /*
  |--------------------------------------------------------------------------
  | Pagination Information
  |--------------------------------------------------------------------------
  */

  const totalPages = Math.ceil(
    totalJobs / itemsPerPage
  );

  return {
    jobs,

    pagination: {
      currentPage,
      itemsPerPage,
      totalJobs,
      totalPages,

      hasNextPage:
        currentPage < totalPages,

      hasPreviousPage:
        currentPage > 1,
    },
  };
}

  /*
  |--------------------------------------------------------------------------
  | Update Job
  |--------------------------------------------------------------------------
  */

  async updateJob(
    jobId,
    recruiterId,
    updateData
  ) {
    const job = await Job.findById(jobId);

    if (!job) {
      throw new ApiError(
        404,
        "Job not found"
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Ownership Check
    |--------------------------------------------------------------------------
    */

    if (
      job.recruiter.toString() !==
      recruiterId.toString()
    ) {
      throw new ApiError(
        403,
        "You can only update your own jobs"
      );
    }

    const allowedFields = [
      "title",
      "description",
      "company",
      "location",
      "jobType",
      "workMode",
      "experienceLevel",
      "salary",
      "skills",
      "openings",
      "applicationDeadline",
      "status",
    ];

    allowedFields.forEach((field) => {
      if (
        updateData[field] !== undefined
      ) {
        job[field] = updateData[field];
      }
    });

    await job.save();

    return job;
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Job
  |--------------------------------------------------------------------------
  */

  async deleteJob(
    jobId,
    recruiterId
  ) {
    const job = await Job.findById(jobId);

    if (!job) {
      throw new ApiError(
        404,
        "Job not found"
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Ownership Check
    |--------------------------------------------------------------------------
    */

    if (
      job.recruiter.toString() !==
      recruiterId.toString()
    ) {
      throw new ApiError(
        403,
        "You can only delete your own jobs"
      );
    }

    await job.deleteOne();

    return true;
  }

  /*
|--------------------------------------------------------------------------
| Admin Update Job
|--------------------------------------------------------------------------
*/

async adminUpdateJob(
  jobId,
  updateData
) {
  const job = await Job.findById(jobId);

  if (!job) {
    throw new ApiError(
      404,
      "Job not found"
    );
  }

  const allowedFields = [
    "title",
    "description",
    "company",
    "location",
    "jobType",
    "workMode",
    "experienceLevel",
    "salary",
    "skills",
    "openings",
    "applicationDeadline",
    "status",
  ];

  allowedFields.forEach((field) => {
    if (
      updateData[field] !== undefined
    ) {
      job[field] = updateData[field];
    }
  });

  await job.save();

  return job;
}

/*
|--------------------------------------------------------------------------
| Admin Delete Job
|--------------------------------------------------------------------------
*/

async adminDeleteJob(jobId) {
  const job = await Job.findById(jobId);

    if (!job) {
      throw new ApiError(
        404,
        "Job not found"
      );
    }

    await job.deleteOne();

    return true;
  }

  /*
|--------------------------------------------------------------------------
| Get Recruiter's Jobs
|--------------------------------------------------------------------------
*/

async getMyJobs(
  recruiterId,
  filters = {}
) {
  const {
    page = 1,
    limit = 10,
    status,
  } = filters;

  const currentPage = Math.max(
    Number(page) || 1,
    1
  );

  const itemsPerPage = Math.min(
    Math.max(Number(limit) || 10, 1),
    100
  );

  const query = {
    recruiter: recruiterId,
  };

  /*
  |--------------------------------------------------------------------------
  | Status Filter
  |--------------------------------------------------------------------------
  */

  if (status) {
    query.status = status;
  }

  const skip =
    (currentPage - 1) *
    itemsPerPage;

  const [
    jobs,
    totalJobs,
  ] = await Promise.all([
    Job.find(query)
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(itemsPerPage),

    Job.countDocuments(query),
  ]);

  const totalPages = Math.ceil(
    totalJobs / itemsPerPage
  );

  return {
    jobs,

    pagination: {
      currentPage,
      itemsPerPage,
      totalJobs,
      totalPages,

      hasNextPage:
        currentPage < totalPages,

      hasPreviousPage:
        currentPage > 1,
    },
  };
}

}

export default new JobService();