import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import studentService from "../services/student.service.js";

class StudentController {

  /*
  |--------------------------------------------------------------------------
  | Get Student Profile
  |--------------------------------------------------------------------------
  */

  getProfile = asyncHandler(async (req, res) => {
    const user = await studentService.getProfile(
      req.user.id
    );

    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Student profile fetched successfully",
        data: {
          user,
        },
      })
    );
  });

  /*
  |--------------------------------------------------------------------------
  | Update Student Profile
  |--------------------------------------------------------------------------
  */

  updateProfile = asyncHandler(async (req, res) => {
    const user =
      await studentService.updateProfile(
        req.user.id,
        req.body
      );

    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Student profile updated successfully",
        data: {
          user,
        },
      })
    );
  });
}

export default new StudentController();