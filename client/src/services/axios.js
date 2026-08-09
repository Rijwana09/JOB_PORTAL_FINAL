import axios from "axios";
import appConfig from "../config/appConfig";

const API = axios.create({
  baseURL: appConfig.apiBaseUrl,

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(error);

    return Promise.reject(error);
  }
);

export default API;