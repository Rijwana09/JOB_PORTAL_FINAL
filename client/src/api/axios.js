import axios from "axios";

import { authStorage } from "../utils/authStorage";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
      "http://localhost:5000/api/v1",  //v1 hatyagya

  headers: {
    "Content-Type": "application/json",
  },
});

export default api;