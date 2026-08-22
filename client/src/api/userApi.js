import api from "./axios";

/*
|--------------------------------------------------------------------------
| Get My Profile
|--------------------------------------------------------------------------
*/

export const getMyProfile =
  async () => {
    const response =
      await api.get(
        "/users/me"
      );

    return response.data;
  };

/*
|--------------------------------------------------------------------------
| Update My Profile
|--------------------------------------------------------------------------
*/

export const updateMyProfile =
  async (profileData) => {
    const response =
      await api.patch(
        "/users/me",
        profileData
      );

    return response.data;
  };