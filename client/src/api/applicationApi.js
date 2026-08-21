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
  async () => {
    const response =
      await api.get(
        "/applications/my-applications"
      );
    return response.data;
  };

/*
|--------------------------------------------------------------------------
| Get Application By ID
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