import express from "express";

import studentController from "../controllers/student.controller.js";

import protect from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";

import validate from "../middlewares/validate.middleware.js";

import ROLES from "../constants/roles.js";

import {
  updateStudentProfileValidation,
} from "../validators/student.validator.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Student Profile
|--------------------------------------------------------------------------
*/

router.get(
  "/profile",
  protect,
  authorizeRoles(ROLES.STUDENT),
  studentController.getProfile
);

router.patch(
  "/profile",
  protect,
  authorizeRoles(ROLES.STUDENT),
  updateStudentProfileValidation,
  validate,
  studentController.updateProfile
);

export default router;