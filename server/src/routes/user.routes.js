import express from "express";

import userController from "../controllers/user.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Get My Profile
|--------------------------------------------------------------------------
|
| Student + Recruiter
|
*/

router.get(
  "/me",
  authMiddleware,
  authorizeRoles("student", "recruiter"),
  userController.getMyProfile
);

/*
|--------------------------------------------------------------------------
| Update My Profile
|--------------------------------------------------------------------------
|
| Student + Recruiter
|
*/

router.patch(
  "/me",
  authMiddleware,
  authorizeRoles("student", "recruiter"),
  userController.updateMyProfile
);

export default router;