import axios from "axios";

const NEW_API_BASE_URL = "https://searchera26-001-site1.gtempurl.com";

const normalizeBaseUrl = (value) => {
  if (!value) {
    return "";
  }

  return String(value).replace(/\/$/, "");
};

// Prefer an explicit `VITE_API_BASE_URL` when provided. During local development
// use a relative base (`''`) so the Vite dev server can proxy `/api` requests
// and avoid CORS issues. Otherwise fall back to the new hosted API URL.
const envApiBaseUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);
export const API_BASE_URL = envApiBaseUrl || (import.meta.env.DEV ? "" : NEW_API_BASE_URL);

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
