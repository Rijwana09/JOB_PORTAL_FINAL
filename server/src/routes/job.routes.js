import express from "express";

import jobController from "../controllers/job.controller.js";

import protect from "../middlewares/auth.middleware.js";
import roleMiddleware from "../middlewares/role.middleware.js";
import validate from "../middlewares/validate.middleware.js";

import ROLES from "../constants/roles.js";

import {
  createJobValidation,
  updateJobValidation,
  jobIdValidation,
  getJobsValidation,
} from "../validators/job.validator.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Get All Jobs
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  getJobsValidation,
  validate,
  jobController.getAllJobs
);

/*
|--------------------------------------------------------------------------
| Get Single Job
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  jobIdValidation,
  validate,
  jobController.getJobById
);

/*
|--------------------------------------------------------------------------
| Recruiter Routes
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Get My Jobs
|--------------------------------------------------------------------------
*/

router.get(
  "/my-jobs",
  protect,
  roleMiddleware(ROLES.RECRUITER),
  jobController.getMyJobs
);

/*
|--------------------------------------------------------------------------
| Create Job
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  protect,
  roleMiddleware(ROLES.RECRUITER),
  createJobValidation,
  validate,
  jobController.createJob
);

/*
|--------------------------------------------------------------------------
| Update Own Job
|--------------------------------------------------------------------------
*/

router.patch(
  "/:id",
  protect,
  roleMiddleware(ROLES.RECRUITER),
  updateJobValidation,
  validate,
  jobController.updateJob
);

/*
|--------------------------------------------------------------------------
| Delete Own Job
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  protect,
  roleMiddleware(ROLES.RECRUITER),
  jobIdValidation,
  validate,
  jobController.deleteJob
);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Admin Update Any Job
|--------------------------------------------------------------------------
*/

router.patch(
  "/admin/:id",
  protect,
  roleMiddleware(ROLES.ADMIN),
  updateJobValidation,
  validate,
  jobController.adminUpdateJob
);

/*
|--------------------------------------------------------------------------
| Admin Delete Any Job
|--------------------------------------------------------------------------
*/

router.delete(
  "/admin/:id",
  protect,
  roleMiddleware(ROLES.ADMIN),
  jobIdValidation,
  validate,
  jobController.adminDeleteJob
);

export default router;