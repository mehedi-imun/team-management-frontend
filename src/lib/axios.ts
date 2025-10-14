import config from "../config";
import axios from "axios";

// Create a single Axios instance for the whole app
export const axiosInstance = axios.create({
  baseURL: config.baseUrl, // base URL from config
  withCredentials: true,   // keep if backend uses cookies
});

// Request interceptor (optional for logging or headers)
axiosInstance.interceptors.request.use(
  (config) => {
    // Example: Add custom headers here if needed
    // config.headers["X-Custom-Header"] = "frontend-client";
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (handles all API errors globally)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "[API ERROR]",
      error.response?.status || "",
      error.response?.data || error.message
    );
    return Promise.reject(error);
  }
);
