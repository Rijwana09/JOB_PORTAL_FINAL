import {
  param,
} from "express-validator";

export const applyForJobValidator = [
  param("jobId")
    .isMongoId()
    .withMessage(
      "Invalid job ID"
    ),
];

export const applicationIdValidator = [
  param("applicationId")
    .isMongoId()
    .withMessage(
      "Invalid application ID"
    ),
];