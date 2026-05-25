import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, ShieldAlert } from "lucide-react";

const InterviewDisclaimerPage = () => {
  const { applicationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);

  const metadata = useMemo(
    () => ({
      applicationId: location.state?.applicationId || applicationId,
      jobTitle: location.state?.jobTitle || "Selected role",
      companyName: location.state?.companyName || "Searchera employer",
      jobLocation: location.state?.jobLocation || "Location unavailable",
      jobSalary: location.state?.jobSalary || "Salary not provided",
    }),
    [applicationId, location.state],
  );

  const startInterview = () => {
    if (!metadata.applicationId || !accepted) {
      return;
    }

    sessionStorage.setItem(
      `interview_disclaimer_${metadata.applicationId}`,
      "accepted",
    );

    navigate(`/interview/${metadata.applicationId}`, {
      replace: true,
      state: {
        ...metadata,
        acknowledged: true,
      },
    });
  };

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-[radial-gradient(circle_at_top_left,rgba(255,214,195,0.42),transparent_35%),linear-gradient(180deg,#FFF9F5_0%,#FFFFFF_42%)] px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-4xl rounded-3xl border border-[#EFD7C9] bg-white p-7 shadow-[0_24px_70px_rgba(122,62,29,0.08)] sm:p-9">
        <p className="text-xs font-poppins-semibold uppercase tracking-[0.24em] text-[#C26A42]">
          Mandatory pre-interview notice
        </p>
        <h1 className="mt-3 text-3xl font-poppins-semibold text-[#1B1B1B] sm:text-4xl">
          Interview Integrity Disclaimer
        </h1>

        <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-4 text-sm text-amber-800">
          <div className="mb-1 inline-flex items-center gap-2 font-semibold">
            <ShieldAlert className="h-4 w-4" />
            Zero cheating policy
          </div>
          <p>
            You are prohibited from cheating during this interview. Any detected cheating behavior
            will lead to immediate termination of the interview session.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-[#EFD7C9] bg-[#FFF8F4] p-5 text-sm leading-6 text-gray-700">
          <h2 className="mb-2 text-base font-poppins-semibold text-[#1B1B1B]">Rules</h2>
          <ul className="space-y-2">
            <li>1. Do not switch tabs or move away from the interview window once it starts.</li>
            <li>2. Pasting and drag-and-drop input are disabled.</li>
            <li>3. Each question has a strict 5-minute timer.</li>
            <li>4. If time expires, that question is terminated and the session moves forward.</li>
          </ul>
        </div>

        <div className="mt-6 rounded-2xl border border-[#EFD7C9] bg-white p-5">
          <div className="flex items-start gap-3">
            <input
              id="acknowledgement"
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-[#D5BDAF] text-[#7A3E1D] focus:ring-[#D5BDAF]"
            />
            <label htmlFor="acknowledgement" className="text-sm text-gray-700">
              I acknowledge and accept this anti-cheating policy and understand that any violation
              terminates my interview.
            </label>
          </div>
        </div>

        {!metadata.applicationId && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Missing application id. Please return to your applications and restart.
          </div>
        )}

        <div className="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={startInterview}
            disabled={!accepted || !metadata.applicationId}
            className="inline-flex items-center gap-2 rounded-xl bg-[#7A3E1D] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <AlertTriangle className="h-4 w-4" />
            Start interview
          </button>
          <Link
            to="/applications"
            className="rounded-xl border border-[#E7D9D0] bg-white px-5 py-3 text-sm font-medium text-[#7A3E1D] transition hover:bg-[#FFF6F1]"
          >
            Back to applications
          </Link>
        </div>

        <p className="mt-5 text-xs text-gray-500">
          Role: {metadata.jobTitle} at {metadata.companyName}
        </p>
      </section>
    </main>
  );
};

export default InterviewDisclaimerPage;
