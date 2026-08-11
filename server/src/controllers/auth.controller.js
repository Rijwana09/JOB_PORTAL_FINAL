import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import authService from "../services/auth.service.js";

import { refreshCookieOptions } from "../config/cookies.js";

class AuthController {
  /*
  |--------------------------------------------------------------------------
  | Register
  |--------------------------------------------------------------------------
  */

  register = asyncHandler(async (req, res) => {
    const user = await authService.register(req.body);

    return res.status(201).json(
      new ApiResponse({
        statusCode: 201,
        message:
          "Registration successful. Please verify your email.",
        data: user,
      })
    );
  });

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

login = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken, user } =
    await authService.login(req.body);

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Login successful",
      data: {
        accessToken,
        refreshToken,
        user,
      },
    })
  );
});

  /*
  |--------------------------------------------------------------------------
  | Verify Email
  |--------------------------------------------------------------------------
  */

  verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.body;

    const user = await authService.verifyEmail(token);

    return res.status(200).json(
      new ApiResponse({
        statusCode: 200,
        message: "Email verified successfully",
        data: user,
      })
    );
  });


   /*
 |--------------------------------------------------------------------------
 | Resend Verification Email
 |--------------------------------------------------------------------------
 */

resendVerificationEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const result =
    await authService.resendVerificationEmail(email);

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: result.message,
    })
  );
});

    /*
|--------------------------------------------------------------------------
| Forgot Password
|--------------------------------------------------------------------------
*/

forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const result =
    await authService.forgotPassword(email);

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: result.message,
    })
  );
});


/*
|--------------------------------------------------------------------------
| Reset Password
|--------------------------------------------------------------------------
*/

resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  const user = await authService.resetPassword(
    token,
    password
  );

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Password reset successfully",
      data: user,
    })
  );
});

  /*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/

changePassword = asyncHandler(async (req, res) => {
  const {
    currentPassword,
    newPassword,
  } = req.body;

  const user = await authService.changePassword(
    req.user.id,
    currentPassword,
    newPassword
  );

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Password changed successfully",
      data: user,
    })
  );
});

  /*
  |--------------------------------------------------------------------------
  | Refresh Access Token
  |--------------------------------------------------------------------------
  */

  refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  const tokens =
    await authService.refreshAccessToken(
      refreshToken
    );

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Access token refreshed successfully",
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    })
  );
});

 //me
  getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Current user fetched successfully",
      data: {
        user: req.user,
      },
    })
  );
});


/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

logout = asyncHandler(async (req, res) => {

  await authService.logout(req.user.id);

  return res.status(200).json(
    new ApiResponse({
      statusCode: 200,
      message: "Logged out successfully",
    })
  );
});
  
}

export default new AuthController();