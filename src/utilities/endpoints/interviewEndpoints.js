export const INTERVIEW_ENDPOINTS = {
  submitApplication: (jobId) => `/api/ApplyJob/ApplyJob/${jobId}`,
  startInterview: (applicationId) => `/api/ApplyJob/Start/${applicationId}`,
  nextQuestion: (sessionId) => `/api/ApplyJob/NextQuestion/${sessionId}`,
  submitAnswer: "/api/ApplyJob/SubmitAnswer",
  result: (sessionId) => `/api/ApplyJob/Result/${sessionId}`,
  allApplications: "/api/ApplyJob/AllApplications",
  getInsight: (jobId) => `/api/ApplyJob/GetInsight/${jobId}`,
};