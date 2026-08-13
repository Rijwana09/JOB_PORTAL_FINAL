import api from "./axios";

/*
|--------------------------------------------------------------------------
| Get All Jobs
|--------------------------------------------------------------------------
*/

export const getJobs = async (params = {}) => {
  const response = await api.get("/jobs", {
    params,
  });

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Get Single Job
|--------------------------------------------------------------------------
*/

export const getJobById = async (jobId) => {
  const response = await api.get(
    `/jobs/${jobId}`
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Get Recruiter's Jobs
|--------------------------------------------------------------------------
*/

export const getMyJobs = async (
  params = {}
) => {
  const response = await api.get(
    "/jobs/my-jobs",
    {
      params,
    }
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Create Job
|--------------------------------------------------------------------------
*/

export const createJob = async (jobData) => {
  const response = await api.post(
    "/jobs",
    jobData
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Update Job
|--------------------------------------------------------------------------
*/

export const updateJob = async (
  jobId,
  jobData
) => {
  const response = await api.patch(
    `/jobs/${jobId}`,
    jobData
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Delete Job
|--------------------------------------------------------------------------
*/

export const deleteJob = async (jobId) => {
  const response = await api.delete(
    `/jobs/${jobId}`
  );

  return response.data;
};