import mongoose from "mongoose";
import Application from "../models/Application.js";
import Job from "../models/Job.js";
import ApiError from "../utils/ApiError.js";
import Notification from "../models/Notification.js";


class ApplicationService {

  /*
  |--------------------------------------------------------------------------
  | Apply For Job
  |--------------------------------------------------------------------------
  */

  async applyForJob(
    jobId,
    studentId
  ) {
    const job =
      await Job.findById(jobId);

    if (!job) {
      throw new ApiError(
        404,
        "Job not found"
      );
    }

    if (
      job.status !==
      "published"
    ) {
      throw new ApiError(
        400,
        "You can only apply for published jobs"
      );
    }

    if (
      job.applicationDeadline &&
      new Date(
        job.applicationDeadline
      ) < new Date()
    ) {
      throw new ApiError(
        400,
        "Application deadline has passed"
      );
    }

    const existingApplication =
      await Application.findOne({
        student: studentId,
        job: jobId,
      });

    if (existingApplication) {
      throw new ApiError(
        409,
        "You have already applied for this job"
      );
    }

    const application =
      await Application.create({
        student: studentId,
        job: jobId,
      });

    return application;
  }

/*
|--------------------------------------------------------------------------
| Get My Applications
|--------------------------------------------------------------------------
*/

  async getMyApplications(
    studentId,
    filters = {}
  ) {
    const {
      status,
      sort = "latest",
      page = 1,
      limit = 10,
    } = filters;

    /*
    |--------------------------------------------------------------------------
    | Build Query
    |--------------------------------------------------------------------------
    */

    const query = {
      student: studentId,
    };

    /*
    |--------------------------------------------------------------------------
    | Status Filter
    |--------------------------------------------------------------------------
    */

    if (status) {
      query.status = status;
    }

    /*
    |--------------------------------------------------------------------------
    | Pagination
    |--------------------------------------------------------------------------
    */

    const currentPage =
      Math.max(Number(page) || 1, 1);

    const itemsPerPage =
      Math.min(
        Math.max(Number(limit) || 10, 1),
        100
      );

    const skip =
      (currentPage - 1) *
      itemsPerPage;

    /*
    |--------------------------------------------------------------------------
    | Sort
    |--------------------------------------------------------------------------
    */

    const sortOption =
      sort === "oldest"
        ? { createdAt: 1 }
        : { createdAt: -1 };

    /*
    |--------------------------------------------------------------------------
    | Total Count
    |--------------------------------------------------------------------------
    */

    const totalApplications =
      await Application.countDocuments(
        query
      );

    /*
    |--------------------------------------------------------------------------
    | Fetch Applications
    |--------------------------------------------------------------------------
    */

    const applications =
      await Application.find(query)
        .populate(
          "job",
          "title company location jobType workMode experienceLevel salary status applicationDeadline"
        )
        .sort(sortOption)
        .skip(skip)
        .limit(itemsPerPage);

    /*
    |--------------------------------------------------------------------------
    | Pagination Metadata
    |--------------------------------------------------------------------------
    */

    const totalPages =
      Math.ceil(
        totalApplications /
          itemsPerPage
      );

    return {
      applications,

      pagination: {
        currentPage,
        itemsPerPage,
        totalApplications,
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
| Get Recruiter's Applications
|--------------------------------------------------------------------------
*/

async getRecruiterApplications(
  recruiterId,
  filters = {}
) {
  const {
    status,
    sort = "latest",
    page = 1,
    limit = 10,
  } = filters;

  /*
  |--------------------------------------------------------------------------
  | Find Recruiter's Jobs
  |--------------------------------------------------------------------------
  */

  const jobs = await Job.find({
    recruiter: recruiterId,
  }).select("_id");

  const jobIds = jobs.map(
    (job) => job._id
  );

  /*
  |--------------------------------------------------------------------------
  | Build Application Query
  |--------------------------------------------------------------------------
  */

  const query = {
    job: {
      $in: jobIds,
    },
  };

  /*
  |--------------------------------------------------------------------------
  | Status Filter
  |--------------------------------------------------------------------------
  */

  if (status) {
    query.status = status;
  }

  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  const currentPage =
    Math.max(Number(page) || 1, 1);

  const itemsPerPage =
    Math.min(
      Math.max(Number(limit) || 10, 1),
      100
    );

  const skip =
    (currentPage - 1) *
    itemsPerPage;

  /*
  |--------------------------------------------------------------------------
  | Sort
  |--------------------------------------------------------------------------
  */

  const sortOption =
    sort === "oldest"
      ? { createdAt: 1 }
      : { createdAt: -1 };

  /*
  |--------------------------------------------------------------------------
  | Total Count
  |--------------------------------------------------------------------------
  */

  const totalApplications =
    await Application.countDocuments(
      query
    );

  /*
  |--------------------------------------------------------------------------
  | Fetch Applications
  |--------------------------------------------------------------------------
  */

  const applications =
    await Application.find(query)
      .populate(
        "student",
        "name email avatar"
      )
      .populate(
        "job",
        "title company location jobType workMode experienceLevel salary status applicationDeadline"
      )
      .sort(sortOption)
      .skip(skip)
      .limit(itemsPerPage);

  /*
  |--------------------------------------------------------------------------
  | Pagination Metadata
  |--------------------------------------------------------------------------
  */

  const totalPages =
    Math.ceil(
      totalApplications /
        itemsPerPage
    );

  return {
    applications,

    pagination: {
      currentPage,
      itemsPerPage,
      totalApplications,
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
| Get Recruiter's Application By ID
|--------------------------------------------------------------------------
*/

async getRecruiterApplicationById(
  applicationId,
  recruiterId
) {
  const application =
    await Application.findById(applicationId)
      .populate(
        "student",
        "name email avatar"
      )
      .populate(
        "job",
        "title company location jobType workMode experienceLevel salary status applicationDeadline recruiter"
      )

  if (!application) {
    throw new ApiError(
      404,
      "Application not found"
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Check Recruiter Ownership
  |--------------------------------------------------------------------------
  */

  const jobs = await Job.find({
    recruiter: recruiterId,
  }).select("_id");

  const jobIds = jobs.map(
    (job) => job._id.toString()
  );

  const applicationJobId =
    application.job._id.toString();

  if (!jobIds.includes(applicationJobId)) {
    throw new ApiError(
      403,
      "You are not authorized to view this application"
    );
  }

  return application;
}

  /*
|--------------------------------------------------------------------------
| Get Application By ID
|--------------------------------------------------------------------------
*/

  /*
|--------------------------------------------------------------------------
| Get Student Application Status
|--------------------------------------------------------------------------
*/

async getApplicationById(
    applicationId,
    studentId
  ) {
    const application =
      await Application.findOne({
        _id: applicationId,
        student: studentId,
      })
        .select(
          "student job status createdAt updatedAt"
        )
        .populate(
          "job",
          "title company location jobType workMode experienceLevel salary status applicationDeadline"
        );

    if (!application) {
      throw new ApiError(
        404,
        "Application not found"
      );
    }

    return application;
  }

/*
|--------------------------------------------------------------------------
| Withdraw Student Application
|--------------------------------------------------------------------------
*/

  async withdrawApplication(
    applicationId,
    studentId
  ) {
    const application =
      await Application.findOne({
        _id: applicationId,
        student: studentId,
      });

    if (!application) {
      throw new ApiError(
        404,
        "Application not found"
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Check Current Application Status
    |--------------------------------------------------------------------------
    */

    if (application.status === "withdrawn") {
      throw new ApiError(
        400,
        "Application has already been withdrawn"
      );
    }

    if (
      application.status === "rejected" ||
      application.status === "hired"
    ) {
      throw new ApiError(
        400,
        `You cannot withdraw an application that is ${application.status}`
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Withdraw Application
    |--------------------------------------------------------------------------
    */

    application.status = "withdrawn";

    await application.save();

    /*
    |--------------------------------------------------------------------------
    | Populate Application Data
    |--------------------------------------------------------------------------
    */

    await application.populate({
      path: "job",
      select:
        "title company location jobType workMode experienceLevel salary status applicationDeadline",
    });

    return application;
  }


  /*
|--------------------------------------------------------------------------
| Update Recruiter's Application Status
|--------------------------------------------------------------------------
*/

async updateApplicationStatus(
  applicationId,
  recruiterId,
  status
) {
  const application =
    await Application.findById(
      applicationId
    );

  if (!application) {
    throw new ApiError(
      404,
      "Application not found"
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Check Recruiter Ownership
  |--------------------------------------------------------------------------
  */

  const job =
    await Job.findOne({
      _id: application.job,
      recruiter: recruiterId,
    });

  if (!job) {
    throw new ApiError(
      403,
      "You are not authorized to update this application"
    );
  }

  /*
|--------------------------------------------------------------------------
| Validate Application Status
|--------------------------------------------------------------------------
*/

const allowedStatuses = [
  "applied",
  "shortlisted",
  "rejected",
  "hired",
];

if (!allowedStatuses.includes(status)) {
  throw new ApiError(
    400,
    "Invalid application status"
  );
}

/*
|--------------------------------------------------------------------------
| Validate Status Transition
|--------------------------------------------------------------------------
*/

  const allowedTransitions = {
    applied: ["shortlisted", "rejected", "withdrawn"],
    shortlisted: ["hired", "rejected", "withdrawn"],
    rejected: [],
    hired: [],
    withdrawn: [],
  };
  const currentStatus =
    application.status;

  if (
    !allowedTransitions[currentStatus].includes(
      status
    )
  ) {
    throw new ApiError(
      400,
      `Application cannot be changed from ${currentStatus} to ${status}`
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Update Application Status
  |--------------------------------------------------------------------------
  */

  application.status = status;

  await application.save();

  /*
  |--------------------------------------------------------------------------
  | Populate Application Data
  |--------------------------------------------------------------------------
  */

  await application.populate([
    {
      path: "job",
      select: "title company location",
    },
    {
      path: "student",
      select: "name email avatar",
    },
  ]);

  /*
  |--------------------------------------------------------------------------
  | Create Student Notification
  |--------------------------------------------------------------------------
  */

  let notificationMessage;

  switch (status) {
    case "shortlisted":
      notificationMessage =
        `Your application for ${job.title} has been shortlisted.`;
      break;

    case "rejected":
      notificationMessage =
        `Your application for ${job.title} has been rejected.`;
      break;

    case "hired":
      notificationMessage =
        `Congratulations! Your application for ${job.title} has been hired.`;
      break;

    default:
      notificationMessage =
        `Your application for ${job.title} has been updated.`;
  }

  await Notification.create({
    recipient: application.student._id,
    type: "application_status",
    title: "Application Status Updated",
    message: notificationMessage,
    application: application._id,
  });

  return application;
}

/*
|--------------------------------------------------------------------------
| Get Student Dashboard
|--------------------------------------------------------------------------
*/

  async getStudentDashboard(studentId) {

  /*
  |--------------------------------------------------------------------------
  | Validate Student ID
  |--------------------------------------------------------------------------
  */

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      throw new ApiError(
        400,
        "Invalid student ID"
      );
    }

    /*
  |--------------------------------------------------------------------------
  | Application Statistics
  |--------------------------------------------------------------------------
  */
      const total =
        await Application.countDocuments({
          student: studentId,
        });

      const applied =
        await Application.countDocuments({
          student: studentId,
          status: "applied",
        });

      const shortlisted =
        await Application.countDocuments({
          student: studentId,
          status: "shortlisted",
        });

      const rejected =
        await Application.countDocuments({
          student: studentId,
          status: "rejected",
        });

      const hired =
        await Application.countDocuments({
          student: studentId,
          status: "hired",
        });

      const withdrawn =
        await Application.countDocuments({
          student: studentId,
          status: "withdrawn",
        });

      /*
|--------------------------------------------------------------------------
| Status Summary
|--------------------------------------------------------------------------
*/

    const statusSummary = [
      {
        status: "applied",
        count: applied,
      },
      {
        status: "shortlisted",
        count: shortlisted,
      },
      {
        status: "rejected",
        count: rejected,
      },
      {
        status: "hired",
        count: hired,
      },
      {
        status: "withdrawn",
        count: withdrawn,
      },
    ];

 /*
|--------------------------------------------------------------------------
| Recent Applications
|--------------------------------------------------------------------------
*/

  const recentApplications =
    await Application.find({
      student: studentId,
    })
      .select(
        "job status createdAt updatedAt"
      )
      .populate(
        "job",
        "title company location jobType workMode experienceLevel salary status applicationDeadline"
      )
      .sort({
        createdAt: -1,
      })
      .limit(5);

      /*
|--------------------------------------------------------------------------
| Application Summary
|--------------------------------------------------------------------------
*/

  const activeApplications =
    applied + shortlisted;

  const completedApplications =
    rejected + hired;

  const successfulApplications =
  shortlisted + hired;

  const successRate =
    total > 0
      ? Number(
          (
            (successfulApplications / total) *
            100
          ).toFixed(2)
        )
      : 0;

/*
|--------------------------------------------------------------------------
| Return Dashboard
|--------------------------------------------------------------------------
*/

    return {
      statistics: {
        total,
        applied,
        shortlisted,
        rejected,
        hired,
        withdrawn,
      },

      summary: {
        activeApplications,
        completedApplications,
        successRate,
      },

      statusSummary,
      recentApplications,
    };
  }

/*
|--------------------------------------------------------------------------
| Get Recruiter Dashboard
|--------------------------------------------------------------------------
*/

  async getRecruiterDashboard(recruiterId) {


  /*
  |--------------------------------------------------------------------------
  | Validate Recruiter ID
  |--------------------------------------------------------------------------
  */
    if (!mongoose.Types.ObjectId.isValid(recruiterId)) {
      throw new ApiError(
        400,
        "Invalid recruiter ID"
      );
    }
/*
|--------------------------------------------------------------------------
| Find recruiter's jobs
|--------------------------------------------------------------------------
*/

  const jobs = await Job.find({
    recruiter: recruiterId,
    })
      .select(
        "_id title company location jobType workMode status applicationDeadline createdAt"
      )
      .sort({
        createdAt: -1,
      });

  const jobIds = jobs.map(
    (job) => job._id
  );

  /*
  |--------------------------------------------------------------------------
  | Job Statistics
  |--------------------------------------------------------------------------
  */

  const totalJobs = jobs.length;

  const activeJobs = jobs.filter(
    (job) => job.status === "published"
  ).length;

  /*
  |--------------------------------------------------------------------------
  | Application Statistics
  |--------------------------------------------------------------------------
  */

  const totalApplications =
    await Application.countDocuments({
      job: {
        $in: jobIds,
      },
    });

  const pendingApplications =
    await Application.countDocuments({
      job: {
        $in: jobIds,
      },
      status: "applied",
    });

  const shortlistedApplications =
    await Application.countDocuments({
      job: {
        $in: jobIds,
      },
      status: "shortlisted",
    });

  const hiredCandidates =
    await Application.countDocuments({
      job: {
        $in: jobIds,
      },
      status: "hired",
    });

  const rejectedApplications =
  await Application.countDocuments({
    job: {
      $in: jobIds,
    },
    status: "rejected",
  });

  const withdrawnApplications =
  await Application.countDocuments({
    job: {
      $in: jobIds,
    },
    status: "withdrawn",
  });

  /*
|--------------------------------------------------------------------------
| Application Status Summary
|--------------------------------------------------------------------------
*/

const applicationStatusSummary = [
  {
    status: "applied",
    count: pendingApplications,
  },
  {
    status: "shortlisted",
    count: shortlistedApplications,
  },
  {
    status: "rejected",
    count: rejectedApplications,
  },
  {
    status: "hired",
    count: hiredCandidates,
  },
  {
    status: "withdrawn",
    count: withdrawnApplications,
  },
];

  /*
  |--------------------------------------------------------------------------
  | Hiring Rate
  |--------------------------------------------------------------------------
  */

  const hiringRate =
    totalApplications > 0
      ? Number(
          (
            (hiredCandidates /
              totalApplications) *
            100
          ).toFixed(2)
        )
      : 0;

  /*
  |--------------------------------------------------------------------------
  | Recent Applications
  |--------------------------------------------------------------------------
  */

  const recentApplications =
    await Application.find({
      job: {
        $in: jobIds,
      },
    })
      .populate(
        "student",
        "name email avatar"
      )
      .populate(
        "job",
        "title company location jobType workMode"
      )
      .sort({
        createdAt: -1,
      })
      .limit(5);

      /*
|--------------------------------------------------------------------------
| Candidate Summary
|--------------------------------------------------------------------------
*/

const candidateSummary =
  recentApplications.map(
    (application) => ({
      applicationId: application._id,
      candidate: application.student
        ? {
            id: application.student._id,
            name: application.student.name,
            email: application.student.email,
            avatar: application.student.avatar,
          }
        : null,

      job: application.job
        ? {
            id: application.job._id,
            title: application.job.title,
            company: application.job.company,
          }
        : null,

      status: application.status,
      appliedAt: application.createdAt,
    })
  );

/*
|--------------------------------------------------------------------------
| Recent Jobs With Application Count
|--------------------------------------------------------------------------
*/

const recentJobs = await Promise.all(
  jobs.slice(0, 5).map(
    async (job) => {
      const applicationCount =
        await Application.countDocuments({
          job: job._id,
        });

      return {
        ...job.toObject(),
        applicationCount,
      };
    }
  )
);

/*
|--------------------------------------------------------------------------
| Job Performance Summary
|--------------------------------------------------------------------------
*/

const jobPerformance =
  await Promise.all(
    jobs.map(async (job) => {

      const applicationCount =
        await Application.countDocuments({
          job: job._id,
        });

      const shortlistedCount =
        await Application.countDocuments({
          job: job._id,
          status: "shortlisted",
        });

      const hiredCount =
        await Application.countDocuments({
          job: job._id,
          status: "hired",
        });

      const rejectedCount =
        await Application.countDocuments({
          job: job._id,
          status: "rejected",
        });

      const withdrawnCount =
        await Application.countDocuments({
          job: job._id,
          status: "withdrawn",
        });

      return {
        jobId: job._id,
        title: job.title,
        company: job.company,
        status: job.status,
        applicationCount,
        shortlistedCount,
        hiredCount,
        rejectedCount,
        withdrawnCount,
      };
    })
  );

/*
|--------------------------------------------------------------------------
| Sort Jobs By Application Count
|--------------------------------------------------------------------------
*/

  jobPerformance.sort(
    (a, b) =>
      b.applicationCount -
      a.applicationCount
  );

  const topJobPerformance =
  jobPerformance.slice(0, 5);
  /*
  |--------------------------------------------------------------------------
  | Return Dashboard
  |--------------------------------------------------------------------------
  */

    return {
      statistics: {
        totalJobs,
        activeJobs,
        totalApplications,
        pendingApplications,
        shortlistedApplications,
        rejectedApplications,
        hiredCandidates,
        withdrawnApplications,
        hiringRate,
      },

      applicationStatusSummary,

      recentApplications,

      candidateSummary,

      recentJobs,

      jobPerformance: topJobPerformance,
    };
  }

/*
|--------------------------------------------------------------------------
| Admin - Get All Applications
|--------------------------------------------------------------------------
*/

async getAllApplications(
  filters = {}
) {
  const {
    status,
    sort = "latest",
    page = 1,
    limit = 10,
  } = filters;

  /*
  |--------------------------------------------------------------------------
  | Build Application Query
  |--------------------------------------------------------------------------
  */

  const query = {};

  /*
  |--------------------------------------------------------------------------
  | Status Filter
  |--------------------------------------------------------------------------
  */

  if (status) {
    query.status = status;
  }

  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  const currentPage =
    Math.max(Number(page) || 1, 1);

  const itemsPerPage =
    Math.min(
      Math.max(Number(limit) || 10, 1),
      100
    );

  const skip =
    (currentPage - 1) *
    itemsPerPage;

  /*
  |--------------------------------------------------------------------------
  | Sort
  |--------------------------------------------------------------------------
  */

  const sortOption =
    sort === "oldest"
      ? { createdAt: 1 }
      : { createdAt: -1 };

  /*
  |--------------------------------------------------------------------------
  | Total Count
  |--------------------------------------------------------------------------
  */

  const totalApplications =
    await Application.countDocuments(
      query
    );

  /*
  |--------------------------------------------------------------------------
  | Fetch Applications
  |--------------------------------------------------------------------------
  */

  const applications =
    await Application.find(query)
      .populate(
        "student",
        "name email avatar"
      )
      .populate(
        "job",
        "title company location jobType workMode experienceLevel salary status applicationDeadline recruiter"
      )
      .sort(sortOption)
      .skip(skip)
      .limit(itemsPerPage);

  /*
  |--------------------------------------------------------------------------
  | Pagination Metadata
  |--------------------------------------------------------------------------
  */

  const totalPages =
    Math.ceil(
      totalApplications /
        itemsPerPage
    );

  return {
    applications,

    pagination: {
      currentPage,
      itemsPerPage,
      totalApplications,
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
| Admin - Get Application By ID
|--------------------------------------------------------------------------
*/

  async getAdminApplicationById(
    applicationId
  ) {
    const application =
      await Application.findById(
        applicationId
      )
        .populate(
          "student",
          "name email avatar"
        )
        .populate(
          "job",
          "title company location jobType workMode experienceLevel salary status applicationDeadline recruiter"
        );

    if (!application) {
      throw new ApiError(
        404,
        "Application not found"
      );
    }

    return application;
  }

  /*
|--------------------------------------------------------------------------
| Admin - Application Statistics
|--------------------------------------------------------------------------
*/

async getAdminApplicationStatistics() {
  const total =
    await Application.countDocuments();

  const applied =
    await Application.countDocuments({
      status: "applied",
    });

  const shortlisted =
    await Application.countDocuments({
      status: "shortlisted",
    });

  const rejected =
    await Application.countDocuments({
      status: "rejected",
    });

  const hired =
    await Application.countDocuments({
      status: "hired",
    });

  return {
    total,
    applied,
    shortlisted,
    rejected,
    hired,
  };
}

}

export default new ApplicationService();

