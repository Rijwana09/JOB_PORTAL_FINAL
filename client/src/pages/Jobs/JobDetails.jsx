import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  FiMapPin,
  FiBriefcase,
  FiClock,
  FiDollarSign,
  FiArrowLeft,
} from "react-icons/fi";

import {
  getJobById,
} from "../../api/jobApi";

import {
  applyForJob,
} from "../../api/applicationApi";

import {
  useAuth,
} from "../../context/AuthContext";

import ROUTES from "../../constants/routes";

import toast from "react-hot-toast";

const JobDetails = () => {
  const { id } = useParams();

  const navigate =
    useNavigate();

  const {
    user,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  const [job, setJob] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [applying, setApplying] =
    useState(false);

  const [isApplied, setIsApplied] =
    useState(false);


  const handleApply = async () => {
  /*
  |--------------------------------------------------------------------------
  | Authentication Check
  |--------------------------------------------------------------------------
  */

  if (!isAuthenticated) {
    toast.error(
      "Please login to apply for this job"
    );

    navigate(ROUTES.LOGIN);

    return;
  }

  /*
  |--------------------------------------------------------------------------
  | Role Check
  |--------------------------------------------------------------------------
  */

  if (user?.role !== "student") {
    toast.error(
      "Only students can apply for jobs"
    );

    return;
  }

  /*
  |--------------------------------------------------------------------------
  | Prevent Duplicate Click
  |--------------------------------------------------------------------------
  */

  if (applying || isApplied) {
    return;
  }

  try {
    setApplying(true);

    /*
    |--------------------------------------------------------------------------
    | Apply For Job
    |--------------------------------------------------------------------------
    */

    await applyForJob(id);

    /*
    |--------------------------------------------------------------------------
    | Update UI
    |--------------------------------------------------------------------------
    */

    setIsApplied(true);

    toast.success(
      "Application submitted successfully"
    );

  } catch (error) {

    /*
    |--------------------------------------------------------------------------
    | Handle Backend Error
    |--------------------------------------------------------------------------
    */

    toast.error(
      error.response?.data?.message ||
        "Failed to apply for this job"
    );

  } finally {
    setApplying(false);
  }
};

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response =
          await getJobById(id);

        setJob(response.data);

      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load job"
        );

        navigate("/jobs");

      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">
          Loading job...
        </p>
      </div>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="mx-auto max-w-5xl px-4 py-8">

        {/* Back */}
        <button
          onClick={() =>
            navigate("/jobs")
          }
          className="mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
        >
          <FiArrowLeft />
          Back to Jobs
        </button>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">

          {/* Main */}
          <div className="rounded-xl bg-white p-8 shadow-sm">

            <h1 className="text-3xl font-bold text-gray-900">
              {job.title}
            </h1>

            <p className="mt-2 text-lg text-gray-500">
              {job.company}
            </p>

            {/* Info */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">

              <div className="flex items-center gap-3">
                <FiMapPin />
                <span>{job.location}</span>
              </div>

              <div className="flex items-center gap-3">
                <FiBriefcase />
                <span>{job.jobType}</span>
              </div>

              <div className="flex items-center gap-3">
                <FiClock />
                <span>{job.workMode}</span>
              </div>

              {job.salary && (
                <div className="flex items-center gap-3">
                  <FiDollarSign />

                  <span>
                    ₹{job.salary.min}
                    {" - "}
                    ₹{job.salary.max}
                  </span>
                </div>
              )}

            </div>

            {/* Description */}
            <section className="mt-10">

              <h2 className="text-xl font-semibold">
                Job Description
              </h2>

              <p className="mt-4 whitespace-pre-line leading-7 text-gray-600">
                {job.description}
              </p>

            </section>

            {/* Skills */}
            {job.skills?.length > 0 && (
              <section className="mt-8">

                <h2 className="text-xl font-semibold">
                  Required Skills
                </h2>

                <div className="mt-4 flex flex-wrap gap-2">

                  {job.skills.map(
                    (skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-600"
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>

              </section>
            )}

          </div>

          {/* Sidebar */}
          <aside className="h-fit rounded-xl bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold">
              Interested?
            </h2>

            {user?.role === "student" || !isAuthenticated ? (
          <button
            onClick={handleApply}
            disabled={
              applying ||
              isApplied ||
              authLoading
            }
            className={`mt-5 w-full rounded-lg px-5 py-3 font-medium text-white transition ${
              isApplied
                ? "cursor-not-allowed bg-green-600"
                : applying || authLoading
                ? "cursor-not-allowed bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isApplied
              ? "✓ Applied"
              : applying
              ? "Applying..."
              : authLoading
              ? "Checking..."
              : "Apply Now"}
          </button>
        ) : null}

          </aside>

        </div>

      </div>

    </div>
  );
};

export default JobDetails;