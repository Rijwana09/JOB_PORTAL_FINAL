import mongoose from "mongoose";

const { Schema } = mongoose;

const jobSchema = new Schema(
  {
    /*
    |--------------------------------------------------------------------------
    | Job Title
    |--------------------------------------------------------------------------
    */

    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      minlength: [3, "Job title must be at least 3 characters"],
      maxlength: [100, "Job title cannot exceed 100 characters"],
    },

    /*
    |--------------------------------------------------------------------------
    | Job Description
    |--------------------------------------------------------------------------
    */

    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
      minlength: [
        20,
        "Job description must be at least 20 characters",
      ],
    },

    /*
    |--------------------------------------------------------------------------
    | Company
    |--------------------------------------------------------------------------
    */

    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },

    /*
    |--------------------------------------------------------------------------
    | Location
    |--------------------------------------------------------------------------
    */

    location: {
      type: String,
      required: [true, "Job location is required"],
      trim: true,
      maxlength: [100, "Location cannot exceed 100 characters"],
    },

    /*
    |--------------------------------------------------------------------------
    | Job Type
    |--------------------------------------------------------------------------
    */

    jobType: {
      type: String,
      enum: [
        "full-time",
        "part-time",
        "internship",
        "contract",
        "freelance",
      ],
      required: [true, "Job type is required"],
    },

    /*
    |--------------------------------------------------------------------------
    | Work Mode
    |--------------------------------------------------------------------------
    */

    workMode: {
      type: String,
      enum: [
        "on-site",
        "remote",
        "hybrid",
      ],
      required: [true, "Work mode is required"],
    },

    /*
    |--------------------------------------------------------------------------
    | Experience Level
    |--------------------------------------------------------------------------
    */

    experienceLevel: {
      type: String,
      enum: [
        "fresher",
        "entry-level",
        "mid-level",
        "senior-level",
      ],
      required: [true, "Experience level is required"],
    },

    /*
    |--------------------------------------------------------------------------
    | Salary
    |--------------------------------------------------------------------------
    */

    salary: {
      min: {
        type: Number,
        min: [0, "Minimum salary cannot be negative"],
      },

      max: {
        type: Number,
        min: [0, "Maximum salary cannot be negative"],
      },

      currency: {
        type: String,
        default: "INR",
        trim: true,
        uppercase: true,
      },

      period: {
        type: String,
        enum: [
          "hourly",
          "monthly",
          "yearly",
        ],
        default: "yearly",
      },
    },

    /*
    |--------------------------------------------------------------------------
    | Skills
    |--------------------------------------------------------------------------
    */

    skills: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      required: [true, "At least one skill is required"],
      validate: {
        validator: function (skills) {
          return skills.length > 0;
        },
        message: "At least one skill is required",
      },
    },

    /*
    |--------------------------------------------------------------------------
    | Number of Openings
    |--------------------------------------------------------------------------
    */

    openings: {
      type: Number,
      required: [true, "Number of openings is required"],
      min: [1, "There must be at least one opening"],
    },

    /*
    |--------------------------------------------------------------------------
    | Application Deadline
    |--------------------------------------------------------------------------
    */

    applicationDeadline: {
      type: Date,
      required: [
        true,
        "Application deadline is required",
      ],
    },

    /*
    |--------------------------------------------------------------------------
    | Recruiter
    |--------------------------------------------------------------------------
    */

    recruiter: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Recruiter is required"],
    },

    /*
    |--------------------------------------------------------------------------
    | Job Status
    |--------------------------------------------------------------------------
    */

    status: {
      type: String,
      enum: [
        "draft",
        "published",
        "closed",
      ],
      default: "published",
    },
  },
  {
    timestamps: true,
  }
);

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

jobSchema.index({
  title: "text",
  description: "text",
  company: "text",
  skills: "text",
});

jobSchema.index({
  recruiter: 1,
});

jobSchema.index({
  location: 1,
});

jobSchema.index({
  jobType: 1,
});

jobSchema.index({
  workMode: 1,
});

jobSchema.index({
  experienceLevel: 1,
});

jobSchema.index({
  status: 1,
});

jobSchema.index({
  createdAt: -1,
});

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

jobSchema.pre("validate", function (next) {
  if (
    this.salary?.min !== undefined &&
    this.salary?.max !== undefined &&
    this.salary.min > this.salary.max
  ) {
    return next(
      new Error(
        "Minimum salary cannot be greater than maximum salary"
      )
    );
  }

  if (
    this.applicationDeadline &&
    this.applicationDeadline <= new Date()
  ) {
    return next(
      new Error(
        "Application deadline must be in the future"
      )
    );
  }

  next();
});

export default mongoose.model("Job", jobSchema);