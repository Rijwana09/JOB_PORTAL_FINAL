import Application from "../models/Application.js";
import Job from "../models/Job.js";
import ApiError from "../utils/ApiError.js";

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
| Get Application By ID
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
        }).populate(
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
}

export default new ApplicationService();

