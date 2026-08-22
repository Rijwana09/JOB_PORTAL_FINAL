import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  FiAlertCircle,
  FiArrowLeft,
  FiArrowRight,
  FiBriefcase,
  FiCalendar,
  FiEye,
  FiMapPin,
  FiRefreshCw,
  FiSearch,
} from "react-icons/fi";

import toast from "react-hot-toast";

import {
  getMyApplications,
} from "../../api/applicationApi";


const MyApplications = () => {

  const navigate = useNavigate();


  /*
  |--------------------------------------------------------------------------
  | Applications
  |--------------------------------------------------------------------------
  */

  const [
    applications,
    setApplications,
  ] = useState([]);


  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  const [
    pagination,
    setPagination,
  ] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalApplications: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });


  /*
  |--------------------------------------------------------------------------
  | Loading / Error
  |--------------------------------------------------------------------------
  */

  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    error,
    setError,
  ] = useState(null);


  /*
  |--------------------------------------------------------------------------
  | Filters
  |--------------------------------------------------------------------------
  */

  const [
    statusFilter,
    setStatusFilter,
  ] = useState("");


  const [
    sort,
    setSort,
  ] = useState("latest");


  const [
    search,
    setSearch,
  ] = useState("");


  /*
  |--------------------------------------------------------------------------
  | Fetch Applications
  |--------------------------------------------------------------------------
  */

  const fetchApplications = useCallback(
    async (
      page = 1,
      status = statusFilter,
      sortOption = sort
    ) => {

      try {

        setLoading(true);

        setError(null);


        const response =
          await getMyApplications({
            page,
            limit: 10,
            status,
            sort: sortOption,
          });


        console.log(
          "My Applications API Response:",
          response
        );


        /*
        |--------------------------------------------------------------------------
        | Expected backend response
        |--------------------------------------------------------------------------
        |
        | response
        |   └── data
        |       ├── applications
        |       └── pagination
        |
        */

        const applicationData =
          response?.data;


        const fetchedApplications =
          Array.isArray(
            applicationData?.applications
          )
            ? applicationData.applications
            : [];


        const fetchedPagination =
          applicationData?.pagination;


        setApplications(
          fetchedApplications
        );


        if (fetchedPagination) {

          setPagination(
            fetchedPagination
          );

        } else {

          /*
          |--------------------------------------------------------------------------
          | Fallback
          |--------------------------------------------------------------------------
          */

          setPagination({
            currentPage: page,
            itemsPerPage: 10,
            totalApplications:
              fetchedApplications.length,
            totalPages:
              fetchedApplications.length > 0
                ? 1
                : 0,
            hasNextPage: false,
            hasPreviousPage: false,
          });

        }

      } catch (err) {

        console.error(
          "Failed to fetch applications:",
          err
        );


        const message =
          err?.response?.data?.message ||
          "Failed to load your applications";


        setError(message);


        toast.error(message);

      } finally {

        setLoading(false);

      }

    },
    [
      statusFilter,
      sort,
    ]
  );


  /*
  |--------------------------------------------------------------------------
  | Initial Fetch
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    fetchApplications(
      1,
      statusFilter,
      sort
    );

  }, [
    fetchApplications,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Status Filter Change
  |--------------------------------------------------------------------------
  */

  const handleStatusChange = (
    event
  ) => {

    const newStatus =
      event.target.value;


    setStatusFilter(
      newStatus
    );


    setSearch("");


    fetchApplications(
      1,
      newStatus,
      sort
    );

  };


  /*
  |--------------------------------------------------------------------------
  | Sort Change
  |--------------------------------------------------------------------------
  */

  const handleSortChange = (
    event
  ) => {

    const newSort =
      event.target.value;


    setSort(
      newSort
    );


    fetchApplications(
      1,
      statusFilter,
      newSort
    );

  };


  /*
  |--------------------------------------------------------------------------
  | Search
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  | Backend currently does not support search.
  |
  | Therefore search is performed on the applications
  | already fetched for the current page.
  |
  */

  const filteredApplications =
    useMemo(() => {

      const keyword =
        search
          .trim()
          .toLowerCase();


      if (!keyword) {
        return applications;
      }


      return applications.filter(
        (application) => {

          const title =
            application?.job?.title
              ?.toLowerCase() || "";


          const company =
            application?.job?.company
              ?.toLowerCase() || "";


          const location =
            application?.job?.location
              ?.toLowerCase() || "";


          const jobType =
            application?.job?.jobType
              ?.toLowerCase() || "";


          return (
            title.includes(keyword) ||
            company.includes(keyword) ||
            location.includes(keyword) ||
            jobType.includes(keyword)
          );

        }
      );

    }, [
      applications,
      search,
    ]);


  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  const handlePageChange = (
    page
  ) => {

    if (
      page < 1 ||
      page > pagination.totalPages ||
      page === pagination.currentPage
    ) {
      return;
    }


    fetchApplications(
      page,
      statusFilter,
      sort
    );


    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  /*
  |--------------------------------------------------------------------------
  | Retry
  |--------------------------------------------------------------------------
  */

  const handleRetry = () => {

    fetchApplications(
      pagination.currentPage || 1,
      statusFilter,
      sort
    );

  };


  /*
  |--------------------------------------------------------------------------
  | Clear Filters
  |--------------------------------------------------------------------------
  */

  const handleClearFilters = () => {

    setStatusFilter("");

    setSort("latest");

    setSearch("");


    fetchApplications(
      1,
      "",
      "latest"
    );

  };


  /*
  |--------------------------------------------------------------------------
  | Status Configuration
  |--------------------------------------------------------------------------
  */

  const getStatusConfig = (
    status
  ) => {

    switch (status) {

      case "applied":
        return {
          label: "Applied",
          className:
            "bg-blue-100 text-blue-700",
        };


      case "shortlisted":
        return {
          label: "Shortlisted",
          className:
            "bg-yellow-100 text-yellow-700",
        };


      case "rejected":
        return {
          label: "Rejected",
          className:
            "bg-red-100 text-red-700",
        };


      case "hired":
        return {
          label: "Hired",
          className:
            "bg-green-100 text-green-700",
        };


      case "withdrawn":
        return {
          label: "Withdrawn",
          className:
            "bg-gray-100 text-gray-700",
        };


      default:
        return {
          label: "Unknown",
          className:
            "bg-gray-100 text-gray-700",
        };

    }

  };


  /*
  |--------------------------------------------------------------------------
  | Format Date
  |--------------------------------------------------------------------------
  */

  const formatDate = (
    date
  ) => {

    if (!date) {
      return "N/A";
    }


    const parsedDate =
      new Date(date);


    if (
      Number.isNaN(
        parsedDate.getTime()
      )
    ) {
      return "N/A";
    }


    return parsedDate.toLocaleDateString(
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
  | Loading State
  |--------------------------------------------------------------------------
  */

  if (
    loading &&
    applications.length === 0
  ) {

    return (

      <div className="min-h-screen bg-gray-50">

        <div className="mx-auto max-w-6xl px-4 py-8">

          <div className="mb-8">

            <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />

            <div className="mt-3 h-4 w-80 animate-pulse rounded bg-gray-200" />

          </div>


          <div className="rounded-xl bg-white p-6 shadow-sm">

            <div className="space-y-5">

              {[1, 2, 3].map(
                (item) => (

                  <div
                    key={item}
                    className="animate-pulse border-b pb-5 last:border-0"
                  >

                    <div className="h-5 w-1/3 rounded bg-gray-200" />

                    <div className="mt-3 h-4 w-1/4 rounded bg-gray-200" />

                    <div className="mt-4 h-4 w-1/2 rounded bg-gray-200" />

                  </div>

                )
              )}

            </div>

          </div>

        </div>

      </div>

    );

  }


  /*
  |--------------------------------------------------------------------------
  | Error State
  |--------------------------------------------------------------------------
  */

  if (
    error &&
    applications.length === 0
  ) {

    return (

      <div className="min-h-screen bg-gray-50">

        <div className="mx-auto flex min-h-[70vh] max-w-6xl items-center justify-center px-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">

              <FiAlertCircle
                className="text-2xl text-red-600"
              />

            </div>


            <h2 className="mt-5 text-xl font-bold text-gray-900">

              Unable to Load Applications

            </h2>


            <p className="mt-2 text-sm leading-6 text-gray-500">

              {error}

            </p>


            <button
              type="button"
              onClick={handleRetry}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >

              <FiRefreshCw />

              Try Again

            </button>

          </div>

        </div>

      </div>

    );

  }


  /*
  |--------------------------------------------------------------------------
  | Main UI
  |--------------------------------------------------------------------------
  */

  return (

    <div className="min-h-screen bg-gray-50">

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">


        {/* ------------------------------------------------
            Header
        ------------------------------------------------ */}

        <div className="mb-8">

          <button
            type="button"
            onClick={() =>
              navigate(
                "/student/dashboard"
              )
            }
            className="mb-5 flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-blue-600"
          >

            <FiArrowLeft />

            Back to Dashboard

          </button>


          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>

              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">

                My Applications

              </h1>


              <p className="mt-2 text-sm text-gray-500 sm:text-base">

                Track and manage all the jobs you have applied for.

              </p>

            </div>


            <div className="rounded-lg bg-white px-4 py-2 text-sm shadow-sm">

              <span className="text-gray-500">
                Total Applications:
              </span>

              <span className="ml-2 font-bold text-gray-900">
                {pagination.totalApplications}
              </span>

            </div>

          </div>

        </div>


        {/* ------------------------------------------------
            Filters
        ------------------------------------------------ */}

        <div className="mb-6 rounded-xl bg-white p-4 shadow-sm sm:p-5">

          <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">


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
                placeholder="Search by job title, company, location..."
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>


            {/* Status */}

            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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


            {/* Sort */}

            <select
              value={sort}
              onChange={handleSortChange}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >

              <option value="latest">
                Latest First
              </option>

              <option value="oldest">
                Oldest First
              </option>

            </select>

          </div>


          {(search ||
            statusFilter ||
            sort !== "latest") && (

            <div className="mt-4 flex items-center justify-between border-t pt-4">

              <p className="text-sm text-gray-500">

                Showing filtered results

              </p>


              <button
                type="button"
                onClick={
                  handleClearFilters
                }
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >

                Clear Filters

              </button>

            </div>

          )}

        </div>


        {/* ------------------------------------------------
            Background Refresh Indicator
        ------------------------------------------------ */}

        {loading && applications.length > 0 && (

          <div className="mb-4 flex items-center justify-center gap-2 text-sm text-gray-500">

            <FiRefreshCw className="animate-spin" />

            Updating applications...

          </div>

        )}


        {/* ------------------------------------------------
            Empty State
        ------------------------------------------------ */}

        {!loading &&
          filteredApplications.length === 0 && (

            <div className="rounded-2xl bg-white px-6 py-14 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">

                <FiBriefcase
                  className="text-2xl text-blue-600"
                />

              </div>


              <h2 className="mt-5 text-xl font-bold text-gray-900">

                {applications.length === 0
                  ? "No Applications Yet"
                  : "No Matching Applications"}

              </h2>


              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">

                {applications.length === 0
                  ? "You haven't applied for any jobs yet. Start exploring jobs and submit your first application."
                  : "We couldn't find any applications matching your current search or filters."}

              </p>


              {applications.length === 0 ? (

                <button
                  type="button"
                  onClick={() =>
                    navigate("/jobs")
                  }
                  className="mt-6 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >

                  Browse Jobs

                </button>

              ) : (

                <button
                  type="button"
                  onClick={
                    handleClearFilters
                  }
                  className="mt-6 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >

                  Clear Filters

                </button>

              )}

            </div>

          )}


        {/* ------------------------------------------------
            Application List
        ------------------------------------------------ */}

        {filteredApplications.length > 0 && (

          <div className="space-y-4">

            {filteredApplications.map(
              (application) => {

                const job =
                  application?.job;


                const status =
                  getStatusConfig(
                    application?.status
                  );


                return (

                  <div
                    key={
                      application._id
                    }
                    className="rounded-xl bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6"
                  >

                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">


                      {/* Job Information */}

                      <div className="min-w-0 flex-1">

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50">

                            <FiBriefcase
                              className="text-xl text-blue-600"
                            />

                          </div>


                          <div className="min-w-0">

                            <h2 className="truncate text-lg font-bold text-gray-900">

                              {job?.title ||
                                "Job Title"}

                            </h2>


                            <p className="mt-1 font-medium text-gray-600">

                              {job?.company ||
                                "Company"}

                            </p>


                            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">

                              {job?.location && (

                                <span className="flex items-center gap-1.5">

                                  <FiMapPin />

                                  {job.location}

                                </span>

                              )}


                              {job?.jobType && (

                                <span className="flex items-center gap-1.5">

                                  <FiBriefcase />

                                  {job.jobType}

                                </span>

                              )}

                            </div>

                          </div>

                        </div>

                      </div>


                      {/* Status + Date + Action */}

                      <div className="flex flex-col gap-4 border-t pt-4 lg:min-w-[250px] lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">

                        <div className="flex items-center justify-between gap-4 lg:justify-end">

                          <span className="text-sm text-gray-500 lg:hidden">

                            Status

                          </span>


                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
                          >

                            {status.label}

                          </span>

                        </div>


                        <div className="flex items-center justify-between gap-3 text-sm text-gray-500 lg:justify-end">

                          <span className="flex items-center gap-1.5">

                            <FiCalendar />

                            Applied

                          </span>


                          <span className="font-medium text-gray-700">

                            {formatDate(
                              application.createdAt
                            )}

                          </span>

                        </div>


                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/student/applications/${application._id}`
                            )
                          }
                          className="flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-100"
                        >

                          <FiEye />

                          View Details

                        </button>

                      </div>

                    </div>

                  </div>

                );

              }
            )}

          </div>

        )}


        {/* ------------------------------------------------
            Pagination
        ------------------------------------------------ */}

        {pagination.totalPages > 1 && (

          <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-sm sm:flex-row">

            <p className="text-sm text-gray-500">

              Page{" "}

              <span className="font-semibold text-gray-800">

                {pagination.currentPage}

              </span>

              {" "}of{" "}

              <span className="font-semibold text-gray-800">

                {pagination.totalPages}

              </span>

            </p>


            <div className="flex items-center gap-2">

              <button
                type="button"
                disabled={
                  !pagination.hasPreviousPage ||
                  loading
                }
                onClick={() =>
                  handlePageChange(
                    pagination.currentPage -
                      1
                  )
                }
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >

                <FiArrowLeft />

                Previous

              </button>


              <div className="hidden items-center gap-1 sm:flex">

                {Array.from(
                  {
                    length:
                      pagination.totalPages,
                  },
                  (_, index) =>
                    index + 1
                )
                  .filter(
                    (page) => {

                      const current =
                        pagination.currentPage;

                      return (
                        page === 1 ||
                        page ===
                          pagination.totalPages ||
                        Math.abs(
                          page - current
                        ) <= 1
                      );

                    }
                  )
                  .map(
                    (page) => (

                      <button
                        key={page}
                        type="button"
                        onClick={() =>
                          handlePageChange(
                            page
                          )
                        }
                        disabled={
                          loading
                        }
                        className={`h-9 min-w-9 rounded-lg px-3 text-sm font-medium transition ${
                          page ===
                          pagination.currentPage
                            ? "bg-blue-600 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >

                        {page}

                      </button>

                    )
                  )}

              </div>


              <button
                type="button"
                disabled={
                  !pagination.hasNextPage ||
                  loading
                }
                onClick={() =>
                  handlePageChange(
                    pagination.currentPage +
                      1
                  )
                }
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >

                Next

                <FiArrowRight />

              </button>

            </div>

          </div>

        )}

      </div>

    </div>

  );

};


export default MyApplications;