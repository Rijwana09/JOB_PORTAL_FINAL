import express from "express";

import applicationController from "../controllers/application.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

import authorizeRoles from "../middlewares/role.middleware.js";

import {applyForJobValidator,applicationIdValidator,} from "../validators/application.validator.js";

import validate from "../middlewares/validate.middleware.js";

const router = express.Router();

router.get(
  "/my-applications",
  authMiddleware,
  authorizeRoles("student"),
  applicationController.getMyApplications
);

router.get(
  "/dashboard",
  authMiddleware,
  authorizeRoles("student"),
  applicationController.getStudentDashboard
);

/*
|--------------------------------------------------------------------------
| Recruiter - Dashboard
|--------------------------------------------------------------------------
*/

router.get(
  "/recruiter/dashboard",
  authMiddleware,
  authorizeRoles("recruiter"),
  applicationController.getRecruiterDashboard
);

/*
|--------------------------------------------------------------------------
| Recruiter - Get Applications
|--------------------------------------------------------------------------
*/

router.get(
  "/recruiter",
  authMiddleware,
  authorizeRoles("recruiter"),
  applicationController.getRecruiterApplications
);

router.get(
  "/recruiter/:applicationId",
  authMiddleware,
  authorizeRoles("recruiter"),
  applicationController.getRecruiterApplicationById
);

router.patch(
  "/recruiter/:applicationId/status",
  authMiddleware,
  authorizeRoles("recruiter"),
  applicationController.updateApplicationStatus
);

/*
|--------------------------------------------------------------------------
| Admin - Applications
|--------------------------------------------------------------------------
*/

router.get(
  "/admin",
  authMiddleware,
  authorizeRoles("admin"),
  applicationController.getAllApplications
);

router.get(
  "/admin/statistics",
  authMiddleware,
  authorizeRoles("admin"),
  applicationController
    .getAdminApplicationStatistics
);

router.get(
  "/admin/:applicationId",
  authMiddleware,
  authorizeRoles("admin"),
  applicationIdValidator,
  validate,
  applicationController.getAdminApplicationById
);

/*
|--------------------------------------------------------------------------
| Student - Application Details
|--------------------------------------------------------------------------
*/
router.get(
  "/:applicationId",
  authMiddleware,
  authorizeRoles("student"),
  applicationIdValidator,
  validate,
  applicationController.getApplicationById
);

router.post(
  "/:jobId",
  authMiddleware,
  authorizeRoles("student"),
  applyForJobValidator,
  validate,
  applicationController.applyForJob
);

export default router;