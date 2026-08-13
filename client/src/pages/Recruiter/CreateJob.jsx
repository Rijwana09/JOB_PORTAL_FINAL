import {
  useForm,
} from "react-hook-form";

import {
  useNavigate,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  createJob,
} from "../../api/jobApi";

const CreateJob = () => {
  const navigate =
    useNavigate();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    defaultValues: {
      title: "",
      company: "",
      description: "",
      location: "",
      jobType: "full-time",
      workMode: "on-site",
      experienceLevel: "fresher",
      skills: "",
      salaryMin: "",
      salaryMax: "",
      openings: 1,
      applicationDeadline: "",
      status: "draft",
    },
  });

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  */

  const onSubmit = async (
    data
  ) => {
    try {
      const jobData = {
        title: data.title,
        company: data.company,
        description:
          data.description,

        location:
          data.location,

        jobType:
          data.jobType,

        workMode:
          data.workMode,

        experienceLevel:
          data.experienceLevel,

        skills: data.skills
          .split(",")
          .map(
            (skill) =>
              skill.trim()
          )
          .filter(Boolean),

        salary: {
          min: Number(
            data.salaryMin
          ),

          max: Number(
            data.salaryMax
          ),
        },

        openings: Number(
          data.openings
        ),

        applicationDeadline:
          data.applicationDeadline,

        status:
          data.status,
      };

      console.log(
        "Create Job Payload:",
        jobData
      );

      await createJob(
        jobData
      );

      toast.success(
        "Job created successfully"
      );

      navigate(
        "/recruiter/dashboard"
      );
    } catch (error) {
      console.error(
        "Create Job Error:",
        error.response?.data || error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to create job"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">

      <div className="mx-auto max-w-3xl">

        <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">

          <h1 className="text-2xl font-bold">
            Create Job
          </h1>

          <p className="mt-1 text-gray-500">
            Create a new job posting
          </p>

          <form
            onSubmit={handleSubmit(
              onSubmit
            )}
            className="mt-8 space-y-6"
          >

            {/* Title */}

            <div>
              <label className="text-sm font-medium">
                Job Title
              </label>

              <input
                {...register(
                  "title",
                  {
                    required:
                      "Job title is required",
                  }
                )}
                className="mt-2 w-full rounded-lg border px-4 py-3"
                placeholder="React Developer"
              />

              {errors.title && (
                <p className="mt-1 text-sm text-red-500">
                  {
                    errors.title
                      .message
                  }
                </p>
              )}
            </div>


            {/* Company */}

            <div>
              <label className="text-sm font-medium">
                Company
              </label>

              <input
                {...register(
                  "company",
                  {
                    required:
                      "Company is required",
                  }
                )}
                className="mt-2 w-full rounded-lg border px-4 py-3"
                placeholder="ABC Technologies"
              />

              {errors.company && (
                <p className="mt-1 text-sm text-red-500">
                  {
                    errors.company
                      .message
                  }
                </p>
              )}
            </div>


            {/* Description */}

            <div>
              <label className="text-sm font-medium">
                Description
              </label>

              <textarea
                {...register(
                  "description",
                  {
                    required:
                      "Description is required",
                  }
                )}
                rows={7}
                className="mt-2 w-full rounded-lg border px-4 py-3"
                placeholder="Describe the job..."
              />

              {errors.description && (
                <p className="mt-1 text-sm text-red-500">
                  {
                    errors.description
                      .message
                  }
                </p>
              )}
            </div>


            {/* Location */}

            <div>
              <label className="text-sm font-medium">
                Location
              </label>

              <input
                {...register(
                  "location",
                  {
                    required:
                      "Location is required",
                  }
                )}
                className="mt-2 w-full rounded-lg border px-4 py-3"
                placeholder="Bangalore"
              />

              {errors.location && (
                <p className="mt-1 text-sm text-red-500">
                  {
                    errors.location
                      .message
                  }
                </p>
              )}
            </div>


            {/* Job Type + Work Mode */}

            <div className="grid gap-5 sm:grid-cols-2">

              <div>
                <label className="text-sm font-medium">
                  Job Type
                </label>

                <select
                  {...register(
                    "jobType"
                  )}
                  className="mt-2 w-full rounded-lg border px-4 py-3"
                >
                  <option value="full-time">
                    Full Time
                  </option>

                  <option value="part-time">
                    Part Time
                  </option>

                  <option value="internship">
                    Internship
                  </option>

                  <option value="contract">
                    Contract
                  </option>

                  <option value="freelance">
                    Freelance
                  </option>
                </select>
              </div>


              <div>
                <label className="text-sm font-medium">
                  Work Mode
                </label>

                <select
                  {...register(
                    "workMode"
                  )}
                  className="mt-2 w-full rounded-lg border px-4 py-3"
                >
                  <option value="on-site">
                    On-site
                  </option>

                  <option value="remote">
                    Remote
                  </option>

                  <option value="hybrid">
                    Hybrid
                  </option>
                </select>
              </div>

            </div>


            {/* Experience */}

            <div>
              <label className="text-sm font-medium">
                Experience Level
              </label>

              <select
                {...register(
                  "experienceLevel"
                )}
                className="mt-2 w-full rounded-lg border px-4 py-3"
              >
                <option value="fresher">
                  Fresher
                </option>

                <option value="entry-level">
                  Entry Level
                </option>

                <option value="mid-level">
                  Mid Level
                </option>

                <option value="senior-level">
                  Senior Level
                </option>
              </select>
            </div>


            {/* Skills */}

            <div>
              <label className="text-sm font-medium">
                Skills
              </label>

              <input
                {...register(
                  "skills",
                  {
                    required:
                      "At least one skill is required",
                  }
                )}
                className="mt-2 w-full rounded-lg border px-4 py-3"
                placeholder="React, Node.js, MongoDB"
              />

              <p className="mt-1 text-xs text-gray-500">
                Separate skills with commas.
              </p>

              {errors.skills && (
                <p className="mt-1 text-sm text-red-500">
                  {
                    errors.skills
                      .message
                  }
                </p>
              )}
            </div>


            {/* Salary */}

            <div className="grid gap-5 sm:grid-cols-2">

              <div>
                <label className="text-sm font-medium">
                  Minimum Salary
                </label>

                <input
                  type="number"
                  {...register(
                    "salaryMin",
                    {
                      required:
                        "Minimum salary is required",

                      valueAsNumber: true,

                      min: {
                        value: 0,
                        message:
                          "Salary cannot be negative",
                      },
                    }
                  )}
                  className="mt-2 w-full rounded-lg border px-4 py-3"
                  placeholder="30000"
                />

                {errors.salaryMin && (
                  <p className="mt-1 text-sm text-red-500">
                    {
                      errors.salaryMin
                        .message
                    }
                  </p>
                )}
              </div>


              <div>
                <label className="text-sm font-medium">
                  Maximum Salary
                </label>

                <input
                  type="number"
                  {...register(
                    "salaryMax",
                    {
                      required:
                        "Maximum salary is required",

                      valueAsNumber: true,

                      min: {
                        value: 0,
                        message:
                          "Salary cannot be negative",
                      },
                    }
                  )}
                  className="mt-2 w-full rounded-lg border px-4 py-3"
                  placeholder="60000"
                />

                {errors.salaryMax && (
                  <p className="mt-1 text-sm text-red-500">
                    {
                      errors.salaryMax
                        .message
                    }
                  </p>
                )}
              </div>

            </div>


            {/* Openings */}

            <div>
              <label className="text-sm font-medium">
                Number of Openings
              </label>

              <input
                type="number"
                min="1"
                {...register(
                  "openings",
                  {
                    required:
                      "Number of openings is required",

                    valueAsNumber: true,

                    min: {
                      value: 1,
                      message:
                        "There must be at least one opening",
                    },
                  }
                )}
                className="mt-2 w-full rounded-lg border px-4 py-3"
                placeholder="2"
              />

              {errors.openings && (
                <p className="mt-1 text-sm text-red-500">
                  {
                    errors.openings
                      .message
                  }
                </p>
              )}
            </div>


            {/* Application Deadline */}

            <div>
              <label className="text-sm font-medium">
                Application Deadline
              </label>

              <input
                type="date"
                {...register(
                  "applicationDeadline",
                  {
                    required:
                      "Application deadline is required",
                  }
                )}
                className="mt-2 w-full rounded-lg border px-4 py-3"
              />

              {errors.applicationDeadline && (
                <p className="mt-1 text-sm text-red-500">
                  {
                    errors
                      .applicationDeadline
                      .message
                  }
                </p>
              )}
            </div>


            {/* Status */}

            <div>
              <label className="text-sm font-medium">
                Status
              </label>

              <select
                {...register(
                  "status"
                )}
                className="mt-2 w-full rounded-lg border px-4 py-3"
              >
                <option value="draft">
                  Draft
                </option>

                <option value="published">
                  Published
                </option>
              </select>
            </div>


            {/* Submit */}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting
                ? "Creating..."
                : "Create Job"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
};

export default CreateJob;