import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import applicationService from "../services/application.service.js";

class ApplicationController {

  /*
  |--------------------------------------------------------------------------
  | Apply For Job
  |--------------------------------------------------------------------------
  */

  applyForJob = asyncHandler(
    async (req, res) => {
      const application =
        await applicationService.applyForJob(
          req.params.jobId,
          req.user.id
        );

      return res
        .status(201)
        .json(
          new ApiResponse({
            statusCode: 201,
            data: application,
            message:
              "Application submitted successfully",
          })
        );
    }
  );

  /*
  |--------------------------------------------------------------------------
  | Get My Applications
  |--------------------------------------------------------------------------
  */

  getMyApplications = asyncHandler(
    async (req, res) => {
      const applications =
        await applicationService.getMyApplications(
          req.user.id
        );

      return res
        .status(200)
        .json(
          new ApiResponse({
            statusCode: 200,
            data: applications,
            message:
              "Applications fetched successfully",
          })
        );
    }
  );

  /*
|--------------------------------------------------------------------------
| Get Recruiter's Applications
|--------------------------------------------------------------------------
*/

getRecruiterApplications =
  asyncHandler(
    async (req, res) => {
      const applications =
        await applicationService
          .getRecruiterApplications(
            req.user.id,
            req.query
          );

      return res
        .status(200)
        .json(
          new ApiResponse({
            statusCode: 200,
            data: applications,
            message:
              "Recruiter's applications fetched successfully",
          })
        );
    }
  );

/*
|--------------------------------------------------------------------------
| Get Application By ID
|--------------------------------------------------------------------------
*/

    getApplicationById = asyncHandler(
      async (req, res) => {

        const application =
          await applicationService.getApplicationById(
            req.params.applicationId,
            req.user.id
          );

        return res
          .status(200)
          .json(
            new ApiResponse({
              statusCode: 200,
              data: application,
              message:
                "Application fetched successfully",
            })
          );
      }
    );

/*
|--------------------------------------------------------------------------
| Get Student Dashboard
|--------------------------------------------------------------------------
*/

  getStudentDashboard = asyncHandler(
    async (req, res) => {
      const dashboard =
        await applicationService.getStudentDashboard(
          req.user.id
        );

      return res
        .status(200)
        .json(
          new ApiResponse({
            statusCode: 200,
            data: dashboard,
            message:
              "Student dashboard fetched successfully",
          })
        );
    }
  );

}

export default new ApplicationController();