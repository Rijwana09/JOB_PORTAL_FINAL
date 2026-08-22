import api from "./axios";

/*
|--------------------------------------------------------------------------
| Apply For Job
|--------------------------------------------------------------------------
*/

export const applyForJob =
  async (jobId) => {
    const response =
      await api.post(
        `/applications/${jobId}`
      );

    return response.data;
  };

/*
|--------------------------------------------------------------------------
| Get My Applications
|--------------------------------------------------------------------------
*/

export const getMyApplications =
  async ({
    status = "",
    sort = "latest",
    page = 1,
    limit = 10,
  } = {}) => {

    const params = {
      page,
      limit,
      sort,
    };

    if (status) {
      params.status = status;
    }

    const response =
      await api.get(
        "/applications/my-applications",
        {
          params,
        }
      );

    return response.data;
  };

/*
|--------------------------------------------------------------------------
| Get Application By ID - Student
|--------------------------------------------------------------------------
*/

export const getApplicationById =
  async (applicationId) => {

    const response =
      await api.get(
        `/applications/${applicationId}`
      );

    return response.data;
  };

/*
|--------------------------------------------------------------------------
| Get Student Dashboard
|--------------------------------------------------------------------------
*/

export const getStudentDashboard =
  async () => {

    const response =
      await api.get(
        "/applications/dashboard"
      );

    return response.data;
  };


/*
|--------------------------------------------------------------------------
| Get Recruiter Applications
|--------------------------------------------------------------------------
*/

export const getRecruiterApplications =
  async ({
    status = "",
    sort = "latest",
    page = 1,
    limit = 10,
  } = {}) => {

    const params = {
      page,
      limit,
      sort,
    };

    if (status) {
      params.status = status;
    }

    const response =
      await api.get(
        "/applications/recruiter",
        {
          params,
        }
      );

    return response.data;
  };


/*
|--------------------------------------------------------------------------
| Get Recruiter Application By ID
|--------------------------------------------------------------------------
*/

export const getRecruiterApplicationById =
  async (applicationId) => {

    const response =
      await api.get(
        `/applications/recruiter/${applicationId}`
      );

    return response.data;
  };


/*
|--------------------------------------------------------------------------
| Update Recruiter Application Status
|--------------------------------------------------------------------------
*/

export const updateApplicationStatus =
  async (
    applicationId,
    status
  ) => {

    const response =
      await api.patch(
        `/applications/recruiter/${applicationId}/status`,
        {
          status,
        }
      );

    return response.data;
  };