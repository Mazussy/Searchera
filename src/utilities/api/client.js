import axios from "axios";

const NEW_API_BASE_URL = "https://searchera435345-001-site1.htempurl.com/";

// During local development use a relative base (`''`) so the Vite dev server
// can proxy `/api` requests and avoid CORS issues. In production always use
// the new hosted API URL.
export const API_BASE_URL = import.meta.env.DEV ? "" : NEW_API_BASE_URL;

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
