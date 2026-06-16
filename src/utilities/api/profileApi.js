import { apiClient } from "./client";

export const getProfile = async () => {
  const { data } = await apiClient.get("/api/Profile/GetProfile");
  return data;
};

export const completeProfile = async (formData) => {
  const { data } = await apiClient.post(
    "/api/Profile/CompleteProfile",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return data;
};

export const updateProfile = async (formData) => {
  const { data } = await apiClient.put("/api/Profile/UpdateProfile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

export const uploadCV = async (file) => {
  const formData = new FormData();
  formData.append("CVFile", file);

  const { data } = await apiClient.post("/api/Profile/UploadCV", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
};

export const getCVData = async () => {
  const { data } = await apiClient.get("/api/Profile/GetCVData");
  return data;
};

export const deleteProfile = async () => {
  const { data } = await apiClient.delete("/api/Profile/DeleteProfile");
  return data;
};
