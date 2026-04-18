import { apiClient } from "./client";

export const getAllCompanies = async () => {
  const { data } = await apiClient.get("/api/Company/GetAllCompanies");
  return Array.isArray(data) ? data : data?.data ?? data?.items ?? [];
};

export const getCompanyById = async (id) => {
  const { data } = await apiClient.get(`/api/Company/GetCompanyById/${id}`);
  return data?.data ?? data?.result ?? data;
};

export const createCompany = async (payload) => {
  const formData = new FormData();

  formData.append("EmployerId", String(payload.employerId).trim());
  formData.append("CompanyName", String(payload.companyName).trim());

  if (payload.description && String(payload.description).trim()) {
    formData.append("Description", String(payload.description).trim());
  }

  if (payload.industry && String(payload.industry).trim()) {
    formData.append("Industry", String(payload.industry).trim());
  }

  if (payload.website && String(payload.website).trim()) {
    formData.append("Website", String(payload.website).trim());
  }

  if (payload.logoFile instanceof File) {
    formData.append("LogoFile", payload.logoFile);
  }

  const { data } = await apiClient.post("/api/Company/AddCompany", formData);
  return data;
};
