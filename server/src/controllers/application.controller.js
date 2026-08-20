import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

import applicationService from "../services/application.service.js";

const allowedApplicationStatuses = [
  "applied",
  "shortlisted",
  "rejected",
  "hired",
  "withdrawn",
];

const allowedSortOptions = [
  "latest",
  "oldest",
];

const validatePagination = (
  page,
  limit
) => {
  const currentPage =
    Number(page);

  const itemsPerPage =
    Number(limit);

  if (
    !Number.isInteger(currentPage) ||
    currentPage < 1
  ) {
    throw new ApiError(
      400,
      "Page must be a positive integer"
    );
  }

  if (
    !Number.isInteger(itemsPerPage) ||
    itemsPerPage < 1 ||
    itemsPerPage > 100
  ) {
    throw new ApiError(
      400,
      "Limit must be between 1 and 100"
    );
  }
};

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
    const {
      status,
      sort = "latest",
    } = req.query;

    if (
      status &&
      !allowedApplicationStatuses.includes(
        status
      )
    ) {
      throw new ApiError(
        400,
        "Invalid application status"
      );
    }

    if (
      !allowedSortOptions.includes(sort)
    ) {
      throw new ApiError(
        400,
        "Invalid sort option"
      );
    }

    const applications =
      await applicationService.getMyApplications(
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
      const {
        status,
        sort = "latest",
      } = req.query;

      if (
        status &&
        !allowedApplicationStatuses.includes(
          status
        )
      ) {
        throw new ApiError(
          400,
          "Invalid application status"
        );
      }

      if (
        !allowedSortOptions.includes(sort)
      ) {
        throw new ApiError(
          400,
          "Invalid sort option"
        );
      }

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

    getRecruiterApplicationById = asyncHandler(
      async (req, res) => {
        const application =
          await applicationService.getRecruiterApplicationById(
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
                "Application details fetched successfully",
            })
          );
      }
    );

    /*
|--------------------------------------------------------------------------
| Update Recruiter's Application Status
|--------------------------------------------------------------------------
*/

  updateApplicationStatus = asyncHandler(
    async (req, res) => {
      const { applicationId } = req.params;
      const { status } = req.body;

      const allowedStatuses = [
        "applied",
        "shortlisted",
        "rejected",
        "hired",
      ];

      if (!status) {
        throw new ApiError(
          400,
          "Application status is required"
        );
      }

      if (!allowedStatuses.includes(status)) {
        throw new ApiError(
          400,
          "Invalid application status"
        );
      }

      const application =
        await applicationService.updateApplicationStatus(
          applicationId,
          req.user.id,
          status
        );

      return res
        .status(200)
        .json(
          new ApiResponse({
            statusCode: 200,
            data: application,
            message:
              "Application status updated successfully",
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
| Withdraw Student Application
|--------------------------------------------------------------------------
*/

withdrawApplication = asyncHandler(
  async (req, res) => {
    const application =
      await applicationService.withdrawApplication(
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
            "Application withdrawn successfully",
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

  /*
|--------------------------------------------------------------------------
| Get Recruiter Dashboard
|--------------------------------------------------------------------------
*/

getRecruiterDashboard = asyncHandler(
  async (req, res) => {
    const dashboard =
      await applicationService.getRecruiterDashboard(
        req.user.id
      );

    return res
      .status(200)
      .json(
        new ApiResponse({
          statusCode: 200,
          data: dashboard,
          message:
            "Recruiter dashboard fetched successfully",
        })
      );
  }
);

/*
|--------------------------------------------------------------------------
| Admin - Get All Applications
|--------------------------------------------------------------------------
*/

getAllApplications = asyncHandler(
  async (req, res) => {
    const { status } = req.query;

    const allowedStatuses = [
      "applied",
      "shortlisted",
      "rejected",
      "hired",
      "withdrawn",
    ];
    
    const allowedSortOptions = [
      "latest",
      "oldest",
    ];

    if (
      status &&
      !allowedStatuses.includes(status)
    ) {
      throw new ApiError(
        400,
        "Invalid application status"
      );
    }

    if (!allowedSortOptions.includes(sort)
      ) {
        throw new ApiError(
          400,
          "Invalid sort option"
        );
      }

    const applications =
      await applicationService.getAllApplications(
        req.query
      );

    return res
      .status(200)
      .json(
        new ApiResponse({
          statusCode: 200,
          data: applications,
          message:
            "All applications fetched successfully",
        })
      );
  }
);

/*
|--------------------------------------------------------------------------
| Admin - Get Application By ID
|--------------------------------------------------------------------------
*/

getAdminApplicationById =
  asyncHandler(
    async (req, res) => {
      const application =
        await applicationService
          .getAdminApplicationById(
            req.params.applicationId
          );

      return res
        .status(200)
        .json(
          new ApiResponse({
            statusCode: 200,
            data: application,
            message:
              "Application details fetched successfully",
          })
        );
    }
  );

  /*
|--------------------------------------------------------------------------
| Admin - Application Statistics
|--------------------------------------------------------------------------
*/

getAdminApplicationStatistics =
  asyncHandler(
    async (req, res) => {
      const statistics =
        await applicationService
          .getAdminApplicationStatistics();

      return res
        .status(200)
        .json(
          new ApiResponse({
            statusCode: 200,
            data: statistics,
            message:
              "Application statistics fetched successfully",
          })
        );
    }
  );

}

export default new ApplicationController();