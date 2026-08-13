import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import jobService from "../services/job.service.js";

class JobController {

  /*
  |--------------------------------------------------------------------------
  | Create Job
  |--------------------------------------------------------------------------
  */

  createJob = asyncHandler(
    async (req, res) => {
      const job =
        await jobService.createJob(
          req.body,
          req.user.id
        );

      return res.status(201).json(
        new ApiResponse({
          statusCode: 201,
          message:
            "Job created successfully",
          data: job,
        })
      );
    }
  );

  /*
  |--------------------------------------------------------------------------
  | Get All Jobs
  |--------------------------------------------------------------------------
  */

  getAllJobs = asyncHandler(
    async (req, res) => {
      const jobs =
        await jobService.getAllJobs(
          req.query
        );

      return res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          message:
            "Jobs fetched successfully",
          data: jobs,
        })
      );
    }
  );

  /*
  |--------------------------------------------------------------------------
  | Get Single Job
  |--------------------------------------------------------------------------
  */

  getJobById = asyncHandler(
    async (req, res) => {
      const job =
        await jobService.getJobById(
          req.params.id
        );

      return res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          message:
            "Job fetched successfully",
          data: job,
        })
      );
    }
  );

  /*
  |--------------------------------------------------------------------------
  | Update Job
  |--------------------------------------------------------------------------
  */

  updateJob = asyncHandler(
    async (req, res) => {
      const job =
        await jobService.updateJob(
          req.params.id,
          req.user.id,
          req.body
        );

      return res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          message:
            "Job updated successfully",
          data: job,
        })
      );
    }
  );

  /*
  |--------------------------------------------------------------------------
  | Delete Job
  |--------------------------------------------------------------------------
  */

  deleteJob = asyncHandler(
    async (req, res) => {
      await jobService.deleteJob(
        req.params.id,
        req.user.id
      );

      return res.status(200).json(
        new ApiResponse({
          statusCode: 200,
          message:
            "Job deleted successfully",
        })
      );
    }
  );

  /*
|--------------------------------------------------------------------------
| Admin Update Job
|--------------------------------------------------------------------------
*/

adminUpdateJob = asyncHandler(
  async (req, res) => {
    const job =
      await jobService.adminUpdateJob(
        req.params.id,
        req.body
      );

    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message:
          "Job updated successfully by admin",
        data: job,
      })
    );
  }
);

/*
|--------------------------------------------------------------------------
| Admin Delete Job
|--------------------------------------------------------------------------
*/

adminDeleteJob = asyncHandler(
  async (req, res) => {
    await jobService.adminDeleteJob(
      req.params.id
    );

    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message:
          "Job deleted successfully by admin",
      })
    );
  }
);

/*
|--------------------------------------------------------------------------
| Get My Jobs
|--------------------------------------------------------------------------
*/

getMyJobs = asyncHandler(
  async (req, res) => {
    const result =
      await jobService.getMyJobs(
        req.user.id,
        req.query
      );

    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message:
          "Recruiter's jobs fetched successfully",
        data: result,
      })
    );
  }
);

}

export default new JobController();