import { apiClient } from "./client";

const extractCollection = (responseBody) => {
  if (Array.isArray(responseBody)) {
    return responseBody;
  }

  if (Array.isArray(responseBody?.data)) {
    return responseBody.data;
  }

  if (Array.isArray(responseBody?.items)) {
    return responseBody.items;
  }

  if (Array.isArray(responseBody?.result)) {
    return responseBody.result;
  }

  if (Array.isArray(responseBody?.value)) {
    return responseBody.value;
  }

  return [];
};

const pickFirst = (obj, keys, fallback = null) => {
  if (!obj || typeof obj !== "object") {
    return fallback;
  }

  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) {
      return obj[key];
    }
  }

  return fallback;
};

const normalizeCategory = (rawCategory = {}) => ({
  id: pickFirst(rawCategory, ["id", "Id", "categoryId", "CategoryId"]),
  categoryName: pickFirst(rawCategory, [
    "categoryName",
    "CategoryName",
    "name",
    "Name",
  ], "Unnamed category"),
});

// ── Companies ──────────────────────────────────────────────────────────────
export const getPendingCompanies = async () => {
  const { data } = await apiClient.get("/api/Admin/GetAllCompaniesArePending");
  return extractCollection(data);
};

export const getPendingCompanyById = async (id) => {
  const { data } = await apiClient.get(`/api/Admin/GetCompanyByIdIsPending/${id}`);
  return data;
};

export const approveCompany = async (id) => {
  const { data } = await apiClient.post(`/api/Admin/ApperoveCompany/${id}`);
  return data;
};

export const rejectCompany = async (id, reason = "") => {
  const { data } = await apiClient.post(`/api/Admin/RejectCompany/${id}`, null, {
    params: { reason },
  });
  return data;
};

// ── Jobs ───────────────────────────────────────────────────────────────────
export const getPendingJobs = async () => {
  const { data } = await apiClient.get("/api/Admin/GetAllJobsArePending");
  return extractCollection(data);
};

export const getPendingJobById = async (id) => {
  const { data } = await apiClient.get(`/api/Admin/GetJobDetailsIsPending/${id}`);
  return data;
};

export const approveJob = async (id) => {
  const { data } = await apiClient.post(`/api/Admin/ApproveJob/${id}`);
  return data;
};

export const rejectJob = async (id, summary = "") => {
  const { data } = await apiClient.post(`/api/Admin/RejectJob/${id}`, null, {
    params: { summary },
  });
  return data;
};

// ── Categories ─────────────────────────────────────────────────────────────
export const getAllCategories = async () => {
  const { data } = await apiClient.get("/api/Category/GetAllCategories");
  return extractCollection(data).map((item) => normalizeCategory(item));
};

export const addCategory = async (categoryName) => {
  const { data } = await apiClient.post("/api/Category/AddCategory", { categoryName });
  return data;
};

export const updateCategory = async (id, categoryName) => {
  const { data } = await apiClient.put(`/api/Category/UpdateCategory/${id}`, { categoryName });
  return data;
};

export const deleteCategory = async (id) => {
  const { data } = await apiClient.delete(`/api/Category/DeleteCategory/${id}`);
  return data;
};

// ── Jobs & Companies (public) ──────────────────────────────────────────────
export const getAllJobs = async () => {
  const { data } = await apiClient.get("/api/Job/GetAllJobs");
  return extractCollection(data);
};

export const getAllCompanies = async () => {
  const { data } = await apiClient.get("/api/Company/GetAllCompanies");
  return extractCollection(data);
};
