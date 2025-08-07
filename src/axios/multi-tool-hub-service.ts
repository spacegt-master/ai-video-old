import { snackbar } from "@/stores/snackbar";
import axios from "axios";

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_MULTI_TOOL_HUB_SERVICE,
  withCredentials: false,
});

service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (
      error.status === 403 &&
      error.response.headers["content-type"] === "application/problem+json"
    ) {
      snackbar({
        title: error.response.data.detail,
        type: "error",
        text: undefined,
        timeout: undefined,
      });
    }
    return Promise.reject(error);
  }
);

export default service;
