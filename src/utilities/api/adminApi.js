import { apiClient } from "./client";

// ── Companies ──────────────────────────────────────────────────────────────
export const getPendingCompanies = async () => {
  const { data } = await apiClient.get("/api/Admin/GetAllCompaniesArePending");
  return data;
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
  return data;
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
  return data;
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
  return data;
};

export const getAllCompanies = async () => {
  const { data } = await apiClient.get("/api/Company/GetAllCompanies");
  return data;
};
