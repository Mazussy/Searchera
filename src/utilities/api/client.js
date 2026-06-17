import axios from "axios";

// Prefer an explicit `VITE_API_BASE_URL` when provided. Default to a relative
// base so both Vite dev and deployed rewrites can proxy `/api` requests and
// keep browser traffic same-origin.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

const tokenKeys = ["token", "accessToken", "authToken", "jwt"];

const getStoredToken = () => {
  for (const key of tokenKeys) {
    const value = localStorage.getItem(key);
    if (value) {
      return value;
    }
  }

  return null;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
