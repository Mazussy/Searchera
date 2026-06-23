import { apiClient } from "./client";
import { INTERVIEW_ENDPOINTS } from "../endpoints/interviewEndpoints";

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

const extractItem = (responseBody) => {
  if (!responseBody || typeof responseBody !== "object") {
    return responseBody ?? null;
  }

  if (responseBody.data && typeof responseBody.data === "object") {
    return responseBody.data;
  }

  if (responseBody.result && typeof responseBody.result === "object") {
    return responseBody.result;
  }

  return responseBody;
};

export const normalizeApplication = (rawApplication = {}) => ({
  id: pickFirst(rawApplication, ["id", "Id", "applicationId", "ApplicationId"]),
  applicationId: pickFirst(rawApplication, ["applicationId", "ApplicationId", "id", "Id"]),
  jobId: pickFirst(rawApplication, ["jobId", "JobId"]),
  jobTitle: pickFirst(rawApplication, ["jobTitle", "JobTitle", "title", "Title"]),
  companyName: pickFirst(rawApplication, ["companyName", "CompanyName", "employerName", "EmployerName"]),
  status: String(pickFirst(rawApplication, ["status", "Status", "applicationStatus", "ApplicationStatus"], "Submitted")),
  appliedAt: pickFirst(rawApplication, ["appliedAt", "AppliedAt", "createdAt", "CreatedAt", "submittedAt", "SubmittedAt"]),
  sessionId: pickFirst(rawApplication, ["sessionId", "SessionId", "interviewSessionId", "InterviewSessionId"]),
  raw: rawApplication,
});

export const normalizeInterviewQuestion = (rawQuestion) => {
  if (!rawQuestion || typeof rawQuestion !== "object") {
    return null;
  }

  const options = pickFirst(rawQuestion, ["options", "Options", "choices", "Choices"], []);

  return {
    questionId: pickFirst(rawQuestion, ["questionId", "QuestionId", "id", "Id"]),
    prompt: String(
      pickFirst(rawQuestion, [
        "questionText",
        "QuestionText",
        "question",
        "Question",
        "prompt",
        "Prompt",
        "text",
        "Text",
        "message",
        "Message",
        "content",
        "Content",
      ], "") || "",
    ),
    options: Array.isArray(options) ? options : [],
    isCompleted: Boolean(
      pickFirst(rawQuestion, ["isCompleted", "IsCompleted", "completed", "Completed", "done", "Done"], false),
    ),
    raw: rawQuestion,
  };
};

export const normalizeInterviewResult = (rawResult = {}) => ({
  sessionId: pickFirst(rawResult, ["sessionId", "SessionId"]),
  status: pickFirst(rawResult, ["status", "Status"], "Completed"),
  score: pickFirst(rawResult, ["score", "Score", "percentage", "Percentage", "matchPercentage", "MatchPercentage"]),
  passed: Boolean(pickFirst(rawResult, ["passed", "Passed", "isPassed", "IsPassed"], false)),
  summary: pickFirst(rawResult, ["summary", "Summary", "resultSummary", "ResultSummary", "message", "Message"], ""),
  feedback: pickFirst(rawResult, ["feedback", "Feedback", "notes", "Notes"], ""),
  recommendation: pickFirst(rawResult, ["recommendation", "Recommendation", "nextSteps", "NextSteps"], ""),
  raw: rawResult,
});

export const submitApplication = async (jobId) => {
  const { data } = await apiClient.post(INTERVIEW_ENDPOINTS.submitApplication(jobId));
  return extractItem(data);
};

export const startInterview = async (applicationId) => {
  const { data } = await apiClient.post(INTERVIEW_ENDPOINTS.startInterview(applicationId));
  return extractItem(data);
};

export const getNextInterviewQuestion = async (sessionId) => {
  const { data } = await apiClient.get(INTERVIEW_ENDPOINTS.nextQuestion(sessionId));
  return extractItem(data);
};

export const submitInterviewAnswer = async (payload) => {
  const { data } = await apiClient.post(INTERVIEW_ENDPOINTS.submitAnswer, payload);
  return extractItem(data);
};

export const getInterviewResult = async (sessionId) => {
  const { data } = await apiClient.get(INTERVIEW_ENDPOINTS.result(sessionId));
  return extractItem(data);
};

export const acceptApplication = async (applicationId) => {
  if (!applicationId) {
    throw new Error("applicationId is required");
  }

  const { data } = await apiClient.post(INTERVIEW_ENDPOINTS.acceptApplication(applicationId));
  return data;
};

export const rejectApplication = async (applicationId, reason = "") => {
  if (!applicationId) {
    throw new Error("applicationId is required");
  }

  const { data } = await apiClient.post(INTERVIEW_ENDPOINTS.rejectApplication(applicationId), null, {
    params: { reason },
  });

  return data;
};

export const getAllApplications = async () => {
  const { data } = await apiClient.get(INTERVIEW_ENDPOINTS.allApplications);

  return extractCollection(data).map((item) => normalizeApplication(item));
};

export const getApplicationById = async (applicationId) => {
  if (!applicationId) {
    return null;
  }

  const applications = await getAllApplications();
  const targetId = String(applicationId).toLowerCase();

  return (
    applications.find((item) => String(item.applicationId || item.id || "").toLowerCase() === targetId) ||
    null
  );
};

export const getInsight = async (jobId) => {
  const { data } = await apiClient.post(INTERVIEW_ENDPOINTS.getInsight(jobId));
  return extractItem(data);
};