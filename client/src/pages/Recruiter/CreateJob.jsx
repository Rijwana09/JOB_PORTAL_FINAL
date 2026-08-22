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


  /*
  |--------------------------------------------------------------------------
  | Form
  |--------------------------------------------------------------------------
  */

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

  const onSubmit = async (data) => {

    try {

      const jobData = {

        title:
          data.title.trim(),

        company:
          data.company.trim(),

        description:
          data.description.trim(),

        location:
          data.location.trim(),

        jobType:
          data.jobType,

        workMode:
          data.workMode,

        experienceLevel:
          data.experienceLevel,

        skills:
          data.skills
            .split(",")
            .map((skill) =>
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

        openings:
          Number(data.openings),

        applicationDeadline:
          data.applicationDeadline,

        status:
          data.status,
      };


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
        error.response?.data ||
          error
      );


      toast.error(
        error.response?.data?.message ||
          "Failed to create job"
      );

    }

  };


  /*
  |--------------------------------------------------------------------------
  | Input Classes
  |--------------------------------------------------------------------------
  */

  const inputClass =
    "mt-2 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100";

  const selectClass =
    "mt-2 w-full min-w-0 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const labelClass =
    "block text-sm font-medium text-gray-700";


  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (

    <div className="min-h-screen bg-gray-50 px-3 py-5 sm:px-6 sm:py-8 lg:px-8">

      <div className="mx-auto w-full max-w-3xl">

        {/* ------------------------------------------------
            Header
        ------------------------------------------------ */}

        <div className="mb-5 sm:mb-6">

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Create Job
          </h1>

          <p className="mt-1 text-sm text-gray-500 sm:text-base">
            Create a new job posting and reach qualified candidates.
          </p>

        </div>


        {/* ------------------------------------------------
            Form Card
        ------------------------------------------------ */}

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

          <div className="p-4 sm:p-6 lg:p-8">

            <form
              onSubmit={handleSubmit(
                onSubmit
              )}
              className="space-y-6"
            >

              {/* ------------------------------------------------
                  Basic Information
              ------------------------------------------------ */}

              <div>

                <div className="mb-5">

                  <h2 className="text-lg font-semibold text-gray-900">
                    Basic Information
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Provide the basic details of the position.
                  </p>

                </div>


                {/* Job Title */}

                <div>

                  <label
                    htmlFor="title"
                    className={labelClass}
                  >
                    Job Title
                  </label>

                  <input
                    id="title"
                    type="text"
                    {...register(
                      "title",
                      {
                        required:
                          "Job title is required",
                      }
                    )}
                    className={inputClass}
                    placeholder="React Developer"
                  />

                  {errors.title && (

                    <p className="mt-1.5 text-xs text-red-500 sm:text-sm">
                      {errors.title.message}
                    </p>

                  )}

                </div>


                {/* Company */}

                <div className="mt-5">

                  <label
                    htmlFor="company"
                    className={labelClass}
                  >
                    Company
                  </label>

                  <input
                    id="company"
                    type="text"
                    {...register(
                      "company",
                      {
                        required:
                          "Company is required",
                      }
                    )}
                    className={inputClass}
                    placeholder="ABC Technologies"
                  />

                  {errors.company && (

                    <p className="mt-1.5 text-xs text-red-500 sm:text-sm">
                      {errors.company.message}
                    </p>

                  )}

                </div>


                {/* Location */}

                <div className="mt-5">

                  <label
                    htmlFor="location"
                    className={labelClass}
                  >
                    Location
                  </label>

                  <input
                    id="location"
                    type="text"
                    {...register(
                      "location",
                      {
                        required:
                          "Location is required",
                      }
                    )}
                    className={inputClass}
                    placeholder="Bangalore"
                  />

                  {errors.location && (

                    <p className="mt-1.5 text-xs text-red-500 sm:text-sm">
                      {errors.location.message}
                    </p>

                  )}

                </div>


                {/* Description */}

                <div className="mt-5">

                  <label
                    htmlFor="description"
                    className={labelClass}
                  >
                    Job Description
                  </label>

                  <textarea
                    id="description"
                    {...register(
                      "description",
                      {
                        required:
                          "Description is required",
                      }
                    )}
                    rows={7}
                    className={`${inputClass} resize-y`}
                    placeholder="Describe the job responsibilities, requirements, and expectations..."
                  />

                  {errors.description && (

                    <p className="mt-1.5 text-xs text-red-500 sm:text-sm">
                      {errors.description.message}
                    </p>

                  )}

                </div>

              </div>


              {/* ------------------------------------------------
                  Job Details
              ------------------------------------------------ */}

              <div className="border-t border-gray-100 pt-6">

                <div className="mb-5">

                  <h2 className="text-lg font-semibold text-gray-900">
                    Job Details
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Define the type, work mode, and experience level.
                  </p>

                </div>


                {/* Job Type + Work Mode */}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  <div>

                    <label
                      htmlFor="jobType"
                      className={labelClass}
                    >
                      Job Type
                    </label>

                    <select
                      id="jobType"
                      {...register(
                        "jobType"
                      )}
                      className={selectClass}
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

                    <label
                      htmlFor="workMode"
                      className={labelClass}
                    >
                      Work Mode
                    </label>

                    <select
                      id="workMode"
                      {...register(
                        "workMode"
                      )}
                      className={selectClass}
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

                <div className="mt-5">

                  <label
                    htmlFor="experienceLevel"
                    className={labelClass}
                  >
                    Experience Level
                  </label>

                  <select
                    id="experienceLevel"
                    {...register(
                      "experienceLevel"
                    )}
                    className={selectClass}
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

                <div className="mt-5">

                  <label
                    htmlFor="skills"
                    className={labelClass}
                  >
                    Skills
                  </label>

                  <input
                    id="skills"
                    type="text"
                    {...register(
                      "skills",
                      {
                        required:
                          "At least one skill is required",
                      }
                    )}
                    className={inputClass}
                    placeholder="React, Node.js, MongoDB"
                  />

                  <p className="mt-1.5 text-xs text-gray-500">
                    Separate skills using commas.
                  </p>

                  {errors.skills && (

                    <p className="mt-1.5 text-xs text-red-500 sm:text-sm">
                      {errors.skills.message}
                    </p>

                  )}

                </div>

              </div>


              {/* ------------------------------------------------
                  Salary & Openings
              ------------------------------------------------ */}

              <div className="border-t border-gray-100 pt-6">

                <div className="mb-5">

                  <h2 className="text-lg font-semibold text-gray-900">
                    Salary & Openings
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Add compensation and vacancy information.
                  </p>

                </div>


                {/* Salary */}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  {/* Minimum */}

                  <div>

                    <label
                      htmlFor="salaryMin"
                      className={labelClass}
                    >
                      Minimum Salary
                    </label>

                    <input
                      id="salaryMin"
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
                      className={inputClass}
                      placeholder="30000"
                    />

                    {errors.salaryMin && (

                      <p className="mt-1.5 text-xs text-red-500 sm:text-sm">
                        {errors.salaryMin.message}
                      </p>

                    )}

                  </div>


                  {/* Maximum */}

                  <div>

                    <label
                      htmlFor="salaryMax"
                      className={labelClass}
                    >
                      Maximum Salary
                    </label>

                    <input
                      id="salaryMax"
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
                      className={inputClass}
                      placeholder="60000"
                    />

                    {errors.salaryMax && (

                      <p className="mt-1.5 text-xs text-red-500 sm:text-sm">
                        {errors.salaryMax.message}
                      </p>

                    )}

                  </div>

                </div>


                {/* Openings */}

                <div className="mt-5">

                  <label
                    htmlFor="openings"
                    className={labelClass}
                  >
                    Number of Openings
                  </label>

                  <input
                    id="openings"
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
                    className={inputClass}
                    placeholder="2"
                  />

                  {errors.openings && (

                    <p className="mt-1.5 text-xs text-red-500 sm:text-sm">
                      {errors.openings.message}
                    </p>

                  )}

                </div>

              </div>


              {/* ------------------------------------------------
                  Application Settings
              ------------------------------------------------ */}

              <div className="border-t border-gray-100 pt-6">

                <div className="mb-5">

                  <h2 className="text-lg font-semibold text-gray-900">
                    Application Settings
                  </h2>

                </div>


                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  {/* Deadline */}

                  <div>

                    <label
                      htmlFor="applicationDeadline"
                      className={labelClass}
                    >
                      Application Deadline
                    </label>

                    <input
                      id="applicationDeadline"
                      type="date"
                      {...register(
                        "applicationDeadline",
                        {
                          required:
                            "Application deadline is required",
                        }
                      )}
                      className={inputClass}
                    />

                    {errors.applicationDeadline && (

                      <p className="mt-1.5 text-xs text-red-500 sm:text-sm">
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

                    <label
                      htmlFor="status"
                      className={labelClass}
                    >
                      Status
                    </label>

                    <select
                      id="status"
                      {...register(
                        "status"
                      )}
                      className={selectClass}
                    >

                      <option value="draft">
                        Draft
                      </option>

                      <option value="published">
                        Published
                      </option>

                    </select>

                  </div>

                </div>

              </div>


              {/* ------------------------------------------------
                  Submit
              ------------------------------------------------ */}

              <div className="border-t border-gray-100 pt-6">

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:min-w-[160px]"
                >

                  {isSubmitting
                    ? "Creating..."
                    : "Create Job"}

                </button>

              </div>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
};


export default CreateJob;