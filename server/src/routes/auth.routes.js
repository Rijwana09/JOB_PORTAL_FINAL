import express from "express";

import authController from "../controllers/auth.controller.js";

import validate from "../middlewares/validate.middleware.js";

import protect from "../middlewares/auth.middleware.js";

// import authorizeRoles from "../middlewares/role.middleware.js";

import ROLES from "../constants/roles.js";

import {
  registerValidation,
  loginValidation,
  verifyEmailValidation,
  resendVerificationEmailValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  changePasswordValidation,
} from "../validators/auth.validator.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

router.post(
  "/register",
  registerValidation,
  validate,
  authController.register
);

router.post(
  "/login",
  loginValidation,
  validate,
  authController.login
);

router.post(
  "/verify-email",
  verifyEmailValidation,
  validate,
  authController.verifyEmail
);

router.post(
  "/resend-verification",
  resendVerificationEmailValidation,
  validate,
  authController.resendVerificationEmail
);

router.post(
  "/forgot-password",
  forgotPasswordValidation,
  validate,
  authController.forgotPassword
);

router.post(
  "/reset-password",
  resetPasswordValidation,
  validate,
  authController.resetPassword
);

router.patch(
  "/change-password",
  protect,
  changePasswordValidation,
  validate,
  authController.changePassword
);

router.post(
  "/refresh-token",
  authController.refreshToken
);

router.get(
  "/me",
  protect,
  authController.getCurrentUser
);

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

router.post(
  "/logout",
  protect,
  authController.logout
);

// /*
// |--------------------------------------------------------------------------
// | Authorization Test Route
// |--------------------------------------------------------------------------
// */

//   router.get(
//     "/admin-test",
//     protect,
//     authorizeRoles(ROLES.ADMIN),
//     (req, res) => {
//       res.status(200).json({
//         success: true,
//         message: "Admin authorization successful",
//         user: req.user,
//       });
//     }
//   );


export default router;