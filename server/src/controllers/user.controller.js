import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import userService from "../services/user.service.js";

class UserController {
  /*
  |--------------------------------------------------------------------------
  | Get My Profile
  |--------------------------------------------------------------------------
  */

  getMyProfile = asyncHandler(
    async (req, res) => {
      const user =
        await userService.getMyProfile(
          req.user.id
        );

      return res
        .status(200)
        .json(
          new ApiResponse({
            statusCode: 200,
            data: user,
            message:
              "Profile fetched successfully",
          })
        );
    }
  );

  /*
  |--------------------------------------------------------------------------
  | Update My Profile
  |--------------------------------------------------------------------------
  */

  updateMyProfile = asyncHandler(
    async (req, res) => {
      const user =
        await userService.updateMyProfile(
          req.user.id,
          req.body
        );

      return res
        .status(200)
        .json(
          new ApiResponse({
            statusCode: 200,
            data: user,
            message:
              "Profile updated successfully",
          })
        );
    }
  );
}

export default new UserController();