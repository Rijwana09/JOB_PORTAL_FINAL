import {
  body,
  param,
  query,
} from "express-validator";
/*
|--------------------------------------------------------------------------
| Create Job Validation
|--------------------------------------------------------------------------
*/

export const createJobValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Job title is required")
    .isLength({
      min: 3,
      max: 100,
    })
    .withMessage(
      "Job title must be between 3 and 100 characters"
    ),

  body("description")
    .trim()
    .notEmpty()
    .withMessage(
      "Job description is required"
    )
    .isLength({
      min: 20,
    })
    .withMessage(
      "Job description must be at least 20 characters"
    ),

  body("company")
    .trim()
    .notEmpty()
    .withMessage(
      "Company name is required"
    )
    .isLength({
      max: 100,
    })
    .withMessage(
      "Company name cannot exceed 100 characters"
    ),

  body("location")
    .trim()
    .notEmpty()
    .withMessage(
      "Job location is required"
    ),

  body("jobType")
    .isIn([
      "full-time",
      "part-time",
      "internship",
      "contract",
      "freelance",
    ])
    .withMessage("Invalid job type"),

  body("workMode")
    .isIn([
      "on-site",
      "remote",
      "hybrid",
    ])
    .withMessage("Invalid work mode"),

  body("experienceLevel")
    .isIn([
      "fresher",
      "entry-level",
      "mid-level",
      "senior-level",
    ])
    .withMessage(
      "Invalid experience level"
    ),

  body("salary.min")
    .optional()
    .isFloat({
      min: 0,
    })
    .withMessage(
      "Minimum salary must be a positive number"
    ),

  body("salary.max")
    .optional()
    .isFloat({
      min: 0,
    })
    .withMessage(
      "Maximum salary must be a positive number"
    ),

  body("salary.currency")
    .optional()
    .isString()
    .withMessage(
      "Salary currency must be a string"
    ),

  body("salary.period")
    .optional()
    .isIn([
      "hourly",
      "monthly",
      "yearly",
    ])
    .withMessage(
      "Invalid salary period"
    ),

  body("skills")
    .isArray({
      min: 1,
    })
    .withMessage(
      "At least one skill is required"
    ),

  body("skills.*")
    .trim()
    .notEmpty()
    .withMessage(
      "Skill cannot be empty"
    ),

  body("openings")
    .isInt({
      min: 1,
    })
    .withMessage(
      "There must be at least one opening"
    ),

  body("applicationDeadline")
    .isISO8601()
    .withMessage(
      "Please provide a valid application deadline"
    ),
];

/*
|--------------------------------------------------------------------------
| Get Jobs Validation
|--------------------------------------------------------------------------
*/

export const getJobsValidation = [
  query("search")
    .optional()
    .trim()
    .isLength({
      max: 100,
    })
    .withMessage(
      "Search cannot exceed 100 characters"
    ),

  query("location")
    .optional()
    .trim()
    .isLength({
      max: 100,
    })
    .withMessage(
      "Location cannot exceed 100 characters"
    ),

  query("jobType")
    .optional()
    .isIn([
      "full-time",
      "part-time",
      "internship",
      "contract",
      "freelance",
    ])
    .withMessage(
      "Invalid job type"
    ),

  query("workMode")
    .optional()
    .isIn([
      "on-site",
      "remote",
      "hybrid",
    ])
    .withMessage(
      "Invalid work mode"
    ),

  query("experienceLevel")
    .optional()
    .isIn([
      "fresher",
      "entry-level",
      "mid-level",
      "senior-level",
    ])
    .withMessage(
      "Invalid experience level"
    ),

  query("skills")
    .optional()
    .trim()
    .isLength({
      max: 300,
    })
    .withMessage(
      "Skills query is too long"
    ),

  query("minSalary")
    .optional()
    .isFloat({
      min: 0,
    })
    .withMessage(
      "Minimum salary must be a positive number"
    ),

  query("maxSalary")
    .optional()
    .isFloat({
      min: 0,
    })
    .withMessage(
      "Maximum salary must be a positive number"
    ),

  query("page")
    .optional()
    .isInt({
      min: 1,
    })
    .withMessage(
      "Page must be at least 1"
    ),

  query("limit")
    .optional()
    .isInt({
      min: 1,
      max: 100,
    })
    .withMessage(
      "Limit must be between 1 and 100"
    ),

  query("sortBy")
    .optional()
    .isIn([
      "createdAt",
      "updatedAt",
      "title",
      "company",
    ])
    .withMessage(
      "Invalid sort field"
    ),

  query("sortOrder")
    .optional()
    .isIn([
      "asc",
      "desc",
    ])
    .withMessage(
      "Sort order must be asc or desc"
    ),

  query("status")
    .optional()
    .isIn([
      "draft",
      "published",
      "closed",
    ])
    .withMessage(
      "Invalid job status"
    ),
];

/*
|--------------------------------------------------------------------------
| Update Job Validation
|--------------------------------------------------------------------------
*/

export const updateJobValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid job ID"),

  body("title")
    .optional()
    .trim()
    .isLength({
      min: 3,
      max: 100,
    })
    .withMessage(
      "Job title must be between 3 and 100 characters"
    ),

  body("description")
    .optional()
    .trim()
    .isLength({
      min: 20,
    })
    .withMessage(
      "Job description must be at least 20 characters"
    ),

  body("company")
    .optional()
    .trim()
    .isLength({
      max: 100,
    })
    .withMessage(
      "Company name cannot exceed 100 characters"
    ),

  body("location")
    .optional()
    .trim()
    .notEmpty()
    .withMessage(
      "Location cannot be empty"
    ),

  body("jobType")
    .optional()
    .isIn([
      "full-time",
      "part-time",
      "internship",
      "contract",
      "freelance",
    ])
    .withMessage("Invalid job type"),

  body("workMode")
    .optional()
    .isIn([
      "on-site",
      "remote",
      "hybrid",
    ])
    .withMessage("Invalid work mode"),

  body("experienceLevel")
    .optional()
    .isIn([
      "fresher",
      "entry-level",
      "mid-level",
      "senior-level",
    ])
    .withMessage(
      "Invalid experience level"
    ),

  body("salary.min")
    .optional()
    .isFloat({
      min: 0,
    })
    .withMessage(
      "Minimum salary must be a positive number"
    ),

  body("salary.max")
    .optional()
    .isFloat({
      min: 0,
    })
    .withMessage(
      "Maximum salary must be a positive number"
    ),

  body("skills")
    .optional()
    .isArray({
      min: 1,
    })
    .withMessage(
      "At least one skill is required"
    ),

  body("skills.*")
    .optional()
    .trim()
    .notEmpty()
    .withMessage(
      "Skill cannot be empty"
    ),

  body("openings")
    .optional()
    .isInt({
      min: 1,
    })
    .withMessage(
      "There must be at least one opening"
    ),

  body("applicationDeadline")
    .optional()
    .isISO8601()
    .withMessage(
      "Please provide a valid application deadline"
    ),

  body("status")
    .optional()
    .isIn([
      "draft",
      "published",
      "closed",
    ])
    .withMessage("Invalid job status"),
];

/*
|--------------------------------------------------------------------------
| Job ID Validation
|--------------------------------------------------------------------------
*/

export const jobIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid job ID"),
];