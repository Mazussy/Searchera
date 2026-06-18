import axios from "axios";

const LEGACY_API_BASE_URLS = new Set([
  "https://searchera-001-site1.rtempurl.com",
]);

const normalizeBaseUrl = (value) => {
  if (!value) {
    return "";
  }

  return String(value).replace(/\/$/, "");
};

// Prefer an explicit `VITE_API_BASE_URL` when provided. During local development
// use a relative base (`''`) so the Vite dev server can proxy `/api` requests
// and avoid CORS issues. In production fall back to the hosted API URL.
const envApiBaseUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);
const fallbackApiBaseUrl = import.meta.env.DEV
  ? ""
  : "https://searchera26-001-site1.gtempurl.com";

export const API_BASE_URL = LEGACY_API_BASE_URLS.has(envApiBaseUrl)
  ? fallbackApiBaseUrl
  : envApiBaseUrl || fallbackApiBaseUrl;

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
