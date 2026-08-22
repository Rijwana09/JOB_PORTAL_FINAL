import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  FiEye,
  FiRefreshCw,
  FiSearch,
} from "react-icons/fi";

import toast from "react-hot-toast";

import {
  getRecruiterApplications,
} from "../../api/applicationApi";


const Applications = () => {

  const navigate = useNavigate();

  const [
    applications,
    setApplications,
  ] = useState([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    page,
    setPage,
  ] = useState(1);

  const [
    pagination,
    setPagination,
  ] = useState({
    currentPage: 1,
    totalPages: 0,
    totalApplications: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });


  /*
  |--------------------------------------------------------------------------
  | Fetch Applications
  |--------------------------------------------------------------------------
  */

  const fetchApplications =
    async () => {

      try {

        setLoading(true);
        setError("");

        const response =
          await getRecruiterApplications({
            status,
            sort: "latest",
            page,
            limit: 10,
          });

        console.log(
          "Recruiter Applications:",
          response
        );

        setApplications(
          response?.data?.applications || []
        );

        setPagination(
          response?.data?.pagination || {
            currentPage: page,
            totalPages: 0,
            totalApplications: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          }
        );

      } catch (error) {

        console.error(
          "Failed to fetch recruiter applications:",
          error
        );

        setError(
          error?.response?.data?.message ||
            "Failed to load applications"
        );

        toast.error(
          error?.response?.data?.message ||
            "Failed to load applications"
        );

      } finally {

        setLoading(false);

      }

    };


  /*
  |--------------------------------------------------------------------------
  | Load Applications
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    fetchApplications();

  }, [
    status,
    page,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Status Badge
  |--------------------------------------------------------------------------
  */

  const getStatusClass =
    (applicationStatus) => {

      switch (applicationStatus) {

        case "applied":
          return "bg-blue-100 text-blue-700";

        case "shortlisted":
          return "bg-yellow-100 text-yellow-700";

        case "rejected":
          return "bg-red-100 text-red-700";

        case "hired":
          return "bg-green-100 text-green-700";

        case "withdrawn":
          return "bg-gray-100 text-gray-700";

        default:
          return "bg-gray-100 text-gray-700";

      }

    };


  /*
  |--------------------------------------------------------------------------
  | Format Status
  |--------------------------------------------------------------------------
  */

  const formatStatus =
    (applicationStatus) => {

      if (!applicationStatus) {
        return "Unknown";
      }

      return (
        applicationStatus
          .charAt(0)
          .toUpperCase() +
        applicationStatus.slice(1)
      );

    };


  /*
  |--------------------------------------------------------------------------
  | Format Date
  |--------------------------------------------------------------------------
  */

  const formatDate =
    (date) => {

      if (!date) {
        return "N/A";
      }

      return new Date(date)
        .toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        );

    };


  /*
  |--------------------------------------------------------------------------
  | Client-side Search
  |--------------------------------------------------------------------------
  */

  const filteredApplications =
    applications.filter(
      (application) => {

        const searchValue =
          search
            .trim()
            .toLowerCase();

        if (!searchValue) {
          return true;
        }

        const candidateName =
          application.student?.name
            ?.toLowerCase() || "";

        const candidateEmail =
          application.student?.email
            ?.toLowerCase() || "";

        const jobTitle =
          application.job?.title
            ?.toLowerCase() || "";

        const company =
          application.job?.company
            ?.toLowerCase() || "";

        return (
          candidateName.includes(
            searchValue
          ) ||
          candidateEmail.includes(
            searchValue
          ) ||
          jobTitle.includes(
            searchValue
          ) ||
          company.includes(
            searchValue
          )
        );

      }
    );


  /*
  |--------------------------------------------------------------------------
  | View Details
  |--------------------------------------------------------------------------
  */

  const handleViewDetails =
    (applicationId) => {

      navigate(
        `/recruiter/applications/${applicationId}`
      );

    };


  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {

    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">

        <div className="flex items-center gap-3 text-gray-500">

          <FiRefreshCw
            className="animate-spin"
          />

          <span>
            Loading applications...
          </span>

        </div>

      </div>
    );

  }


  /*
  |--------------------------------------------------------------------------
  | Error State
  |--------------------------------------------------------------------------
  */

  if (error) {

    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">

        <div className="mx-auto max-w-5xl rounded-xl bg-white p-8 text-center shadow-sm">

          <h2 className="text-xl font-semibold text-gray-800">
            Unable to load applications
          </h2>

          <p className="mt-2 text-gray-500">
            {error}
          </p>

          <button
            onClick={fetchApplications}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
          >

            <FiRefreshCw />

            Retry

          </button>

        </div>

      </div>
    );

  }


  return (

    <div className="min-h-screen bg-gray-50">

      <div className="mx-auto max-w-6xl px-4 py-8">


        {/* ------------------------------------------------
            Header
        ------------------------------------------------ */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h1 className="text-2xl font-bold text-gray-900">
              Applications
            </h1>

            <p className="mt-1 text-gray-500">
              Manage applications received for your jobs.
            </p>

          </div>

          <button
            onClick={fetchApplications}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >

            <FiRefreshCw />

            Refresh

          </button>

        </div>


        {/* ------------------------------------------------
            Search + Filter
        ------------------------------------------------ */}

        <div className="mt-6 rounded-xl bg-white p-4 shadow-sm">

          <div className="grid gap-4 md:grid-cols-2">


            {/* Search */}

            <div className="relative">

              <FiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search candidate, email or job..."
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>


            {/* Status */}

            <select
              value={status}
              onChange={(event) => {

                setStatus(
                  event.target.value
                );

                setPage(1);

              }}
              className="rounded-lg border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >

              <option value="">
                All Statuses
              </option>

              <option value="applied">
                Applied
              </option>

              <option value="shortlisted">
                Shortlisted
              </option>

              <option value="rejected">
                Rejected
              </option>

              <option value="hired">
                Hired
              </option>

              <option value="withdrawn">
                Withdrawn
              </option>

            </select>

          </div>

        </div>


        {/* ------------------------------------------------
            Empty State
        ------------------------------------------------ */}

        {filteredApplications.length === 0 && (

          <div className="mt-6 rounded-xl bg-white p-10 text-center shadow-sm">

            <h2 className="text-lg font-semibold text-gray-800">
              No Applications Found
            </h2>

            <p className="mt-2 text-gray-500">

              {search
                ? "No applications match your search."
                : "No candidates have applied to your jobs yet."}

            </p>

          </div>

        )}


        {/* ------------------------------------------------
            Applications
        ------------------------------------------------ */}

        {filteredApplications.length > 0 && (

          <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">

            <div className="overflow-x-auto">

              <table className="w-full min-w-[800px]">

                <thead className="border-b bg-gray-50">

                  <tr>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Candidate
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Job
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Applied
                    </th>

                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                      Action
                    </th>

                  </tr>

                </thead>


                <tbody className="divide-y">

                  {filteredApplications.map(
                    (application) => (

                      <tr
                        key={
                          application._id
                        }
                        className="transition hover:bg-gray-50"
                      >

                        {/* Candidate */}

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-3">

                            {application.student?.avatar ? (

                              <img
                                src={
                                  application.student.avatar
                                }
                                alt={
                                  application.student.name ||
                                  "Candidate"
                                }
                                className="h-10 w-10 rounded-full object-cover"
                              />

                            ) : (

                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">

                                {application.student?.name
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                  "C"}

                              </div>

                            )}

                            <div>

                              <p className="font-medium text-gray-900">
                                {application.student?.name ||
                                  "Unknown Candidate"}
                              </p>

                              <p className="text-sm text-gray-500">
                                {application.student?.email ||
                                  "No email"}
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* Job */}

                        <td className="px-6 py-4">

                          <p className="font-medium text-gray-900">
                            {application.job?.title ||
                              "Unknown Job"}
                          </p>

                          <p className="text-sm text-gray-500">
                            {application.job?.company ||
                              "Unknown Company"}
                          </p>

                        </td>


                        {/* Status */}

                        <td className="px-6 py-4">

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                              application.status
                            )}`}
                          >

                            {formatStatus(
                              application.status
                            )}

                          </span>

                        </td>


                        {/* Date */}

                        <td className="px-6 py-4 text-sm text-gray-600">

                          {formatDate(
                            application.createdAt
                          )}

                        </td>


                        {/* Action */}

                        <td className="px-6 py-4 text-right">

                          <button
                            onClick={() =>
                              handleViewDetails(
                                application._id
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                          >

                            <FiEye />

                            View Details

                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>


            {/* ------------------------------------------------
                Pagination
            ------------------------------------------------ */}

            {pagination.totalPages > 1 && (

              <div className="flex flex-col gap-3 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

                <p className="text-sm text-gray-500">

                  Page{" "}
                  {pagination.currentPage}{" "}
                  of{" "}
                  {pagination.totalPages}

                </p>


                <div className="flex gap-2">

                  <button
                    disabled={
                      !pagination.hasPreviousPage
                    }
                    onClick={() =>
                      setPage(
                        (previous) =>
                          previous - 1
                      )
                    }
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>


                  <button
                    disabled={
                      !pagination.hasNextPage
                    }
                    onClick={() =>
                      setPage(
                        (previous) =>
                          previous + 1
                      )
                    }
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>

                </div>

              </div>

            )}

          </div>

        )}

      </div>

    </div>

  );

};


export default Applications;