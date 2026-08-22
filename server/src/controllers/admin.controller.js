import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

import adminService from "../services/admin.service.js";

class AdminController {

  /*
  |--------------------------------------------------------------------------
  | Admin Dashboard
  |--------------------------------------------------------------------------
  */

  getDashboard = asyncHandler(
    async (req, res) => {

      const dashboard =
        await adminService.getDashboard();

      return res
        .status(200)
        .json(
          new ApiResponse({
            statusCode: 200,
            data: dashboard,
            message:
              "Admin dashboard fetched successfully",
          })
        );
    }
  );

  /*
  |--------------------------------------------------------------------------
  | Get All Users
  |--------------------------------------------------------------------------
  */

  getAllUsers = asyncHandler(
    async (req, res) => {

      const {
        role,
      } = req.query;

      const allowedRoles = [
        "student",
        "recruiter",
        "admin",
      ];

      if (
        role &&
        !allowedRoles.includes(role)
      ) {
        throw new ApiError(
          400,
          "Invalid user role"
        );
      }

      const users =
        await adminService.getAllUsers(
          req.query
        );

      return res
        .status(200)
        .json(
          new ApiResponse({
            statusCode: 200,
            data: users,
            message:
              "Users fetched successfully",
          })
        );
    }
  );
}

export default new AdminController();