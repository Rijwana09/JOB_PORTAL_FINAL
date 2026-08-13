import {
  useEffect,
  useState,
} from "react";

import {
  useForm,
} from "react-hook-form";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
  getJobById,
  updateJob,
} from "../../api/jobApi";

const EditJob = () => {
  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [loading, setLoading] =
    useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm();

  /*
  |--------------------------------------------------------------------------
  | Fetch Job
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response =
          await getJobById(id);

        const job =
          response.data;

        reset({
          title:
            job.title || "",

          company:
            job.company || "",

          description:
            job.description || "",

          location:
            job.location || "",

          jobType:
            job.jobType || "full-time",

          workMode:
            job.workMode || "on-site",

          experienceLevel:
            job.experienceLevel ||
            "fresher",

          skills:
            job.skills?.join(", ") ||
            "",

          salaryMin:
            job.salary?.min || "",

          salaryMax:
            job.salary?.max || "",

          status:
            job.status || "draft",
        });

      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load job"
        );

        navigate(
          "/recruiter/dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, navigate, reset]);

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
        location: data.location,

        jobType: data.jobType,

        workMode: data.workMode,

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

        status: data.status,
      };

      await updateJob(
        id,
        jobData
      );

      toast.success(
        "Job updated successfully"
      );

      navigate(
        "/recruiter/dashboard"
      );

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to update job"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">
          Loading job...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">

      <div className="mx-auto max-w-3xl">

        <div className="rounded-xl bg-white p-6 shadow-sm sm:p-8">

          <h1 className="text-2xl font-bold">
            Edit Job
          </h1>

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
              />
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
              />
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
              />
            </div>

            {/* Job Type */}

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
                      "Skills are required",
                  }
                )}
                className="mt-2 w-full rounded-lg border px-4 py-3"
              />
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
                    }
                  )}
                  className="mt-2 w-full rounded-lg border px-4 py-3"
                />
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
                    }
                  )}
                  className="mt-2 w-full rounded-lg border px-4 py-3"
                />
              </div>

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

                <option value="closed">
                  Closed
                </option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting
                ? "Updating..."
                : "Update Job"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
};

export default EditJob;