import { apiClient } from "./client";

export const getAllCompanies = async () => {
  const { data } = await apiClient.get("/api/Company/GetAllCompanies");
  return Array.isArray(data) ? data : data?.data ?? data?.items ?? [];
};

export const getCompanyById = async (id) => {
  const { data } = await apiClient.get(`/api/Company/GetCompanyById/${id}`);
  return data?.data ?? data?.result ?? data;
};
