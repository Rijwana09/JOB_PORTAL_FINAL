import api from "./axios";

import { authStorage } from "../utils/authStorage";

let isRefreshing = false;

let failedQueue = [];

const processQueue = (
  error,
  token = null
) => {
  failedQueue.forEach(
    ({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    }
  );

  failedQueue = [];
};

/*
|--------------------------------------------------------------------------
| Request Interceptor
|--------------------------------------------------------------------------
*/

api.interceptors.request.use(
  (config) => {
    const isAuthRequest =
      config.url?.includes(
        "/auth/login"
      ) ||
      config.url?.includes(
        "/auth/register"
      ) ||
      config.url?.includes(
        "/auth/refresh-token"
      );

    if (isAuthRequest) {
      return config;
    }

    const token =
      authStorage.getAccessToken();

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/*
|--------------------------------------------------------------------------
| Response Interceptor
|--------------------------------------------------------------------------
*/

api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest =
      error.config;

    if (
      error.response?.status !== 401 ||
      originalRequest?._retry
    ) {
      return Promise.reject(error);
    }

    /*
    |--------------------------------------------------------------------------
    | Don't refresh the refresh-token request itself
    |--------------------------------------------------------------------------
    */

    if (
      originalRequest.url?.includes(
        "/auth/refresh-token"
      )
    ) {
      authStorage.clearTokens();

      return Promise.reject(error);
    }

    /*
    |--------------------------------------------------------------------------
    | Another refresh request is already running
    |--------------------------------------------------------------------------
    */

    if (isRefreshing) {
      return new Promise(
        (resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
          });
        }
      ).then((token) => {
        originalRequest.headers.Authorization =
          `Bearer ${token}`;

        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken =
        authStorage.getRefreshToken();

      if (!refreshToken) {
        throw new Error(
          "Refresh token not found"
        );
      }

      /*
      |--------------------------------------------------------------------------
      | Get new tokens
      |--------------------------------------------------------------------------
      */

      const response = await api.post(
        "/auth/refresh-token",
        {
          refreshToken,
        }
      );

      const {
        accessToken,
        refreshToken: newRefreshToken,
      } = response.data.data;

      /*
      |--------------------------------------------------------------------------
      | Save new tokens
      |--------------------------------------------------------------------------
      */

      authStorage.setTokens({
        accessToken,
        refreshToken: newRefreshToken,
      });

      processQueue(
        null,
        accessToken
      );

      /*
      |--------------------------------------------------------------------------
      | Retry original request
      |--------------------------------------------------------------------------
      */

      originalRequest.headers.Authorization =
        `Bearer ${accessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(
        refreshError,
        null
      );

      authStorage.clearTokens();

      return Promise.reject(
        refreshError
      );
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;