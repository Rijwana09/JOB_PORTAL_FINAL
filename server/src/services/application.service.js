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

  async getMyApplications(studentId) {
    const applications =
      await Application.find({
        student: studentId,
      })
        .populate(
          "job",
          "title company location jobType workMode experienceLevel salary status applicationDeadline"
        )
        .sort({
          createdAt: -1,
        });

    return applications;
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
  } = filters;

  /*
  |--------------------------------------------------------------------------
  | Find recruiter's jobs
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
      .sort({
        createdAt: -1,
      });

  return applications;
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

    case "applied":
      notificationMessage =
        `Your application for ${job.title} is now marked as applied.`;
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

      const recentApplications =
        await Application.find({
          student: studentId,
        })
          .populate(
            "job",
            "title company location jobType workMode experienceLevel salary status applicationDeadline"
          )
          .sort({
            createdAt: -1,
          })
          .limit(5);

      return {
        statistics: {
          total,
          applied,
          shortlisted,
          rejected,
          hired,
        },

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
        hiredCandidates,
      },

      recentApplications,

      recentJobs,
    };
  }

/*
|--------------------------------------------------------------------------
| Admin - Get All Applications
|--------------------------------------------------------------------------
*/

async getAllApplications(filters = {}) {
  const {
    status,
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
      .sort({
        createdAt: -1,
      });

  return applications;
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

