import api from "./axios";

/*
|--------------------------------------------------------------------------
| Get Admin Dashboard
|--------------------------------------------------------------------------
*/

export const getAdminDashboard =
  async () => {

    const response =
      await api.get(
        "/admin/dashboard"
      );

    return response.data;
  };

/*
|--------------------------------------------------------------------------
| Get All Users
|--------------------------------------------------------------------------
*/

export const getAllUsers =
  async (params = {}) => {

    const response =
      await api.get(
        "/admin/users",
        {
          params,
        }
      );

    return response.data;
  };