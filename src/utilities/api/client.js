import axios from "axios";

const normalizeBaseUrl = (value) => {
  if (!value) {
    return "";
  }

  return String(value).replace(/\/$/, "");
};

// Prefer an explicit `VITE_API_BASE_URL` when provided. During local development
// use a relative base (`''`) so the Vite dev server can proxy `/api` requests
// and avoid CORS issues. In production also use the same-origin `/api` path so
// the deployment proxy can forward requests without exposing the browser to CORS.
const envApiBaseUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);
export const API_BASE_URL = envApiBaseUrl || "";

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
