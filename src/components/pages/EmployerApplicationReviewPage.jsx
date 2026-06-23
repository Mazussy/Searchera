import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, UserCheck, ClipboardList, Sparkles } from "lucide-react";
import RejectModal from "../../components/common/RejectModal";
import {
  getApplicationById,
  getInterviewResult,
  normalizeApplication,
  normalizeInterviewResult,
  acceptApplication,
  rejectApplication,
} from "../../utilities/api/interviewApi";
import { useNavigate } from "react-router-dom";

const EmployerApplicationReviewPage = () => {
  const { applicationId } = useParams();
  const location = useLocation();

  const [application, setApplication] = useState(
    location.state?.application ? normalizeApplication(location.state.application.raw ?? location.state.application) : null,
  );
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rejectOpen, setRejectOpen] = useState(false);
  const navigate = useNavigate();

  const sessionId = useMemo(
    () => application?.sessionId || location.state?.application?.sessionId || null,
    [application, location.state?.application?.sessionId],
  );

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        let resolvedApplication = application;

        if (!resolvedApplication && applicationId) {
          const found = await getApplicationById(applicationId);
          resolvedApplication = found ? normalizeApplication(found.raw ?? found) : null;
        }

        if (!mounted) {
          return;
        }

        if (!resolvedApplication) {
          setError("Application not found.");
          setLoading(false);
          return;
        }

        setApplication(resolvedApplication);

        const sid = resolvedApplication.sessionId;
        if (sid) {
          try {
            const resultPayload = await getInterviewResult(sid);

            if (!mounted) {
              return;
            }

            setResult(normalizeInterviewResult(resultPayload));
          } catch (resultErr) {
            // Result endpoint may not be available; continue without it
            if (mounted) {
              setResult(null);
            }
          }
        }
      } catch (err) {
        if (!mounted) {
          return;
        }

        setError(
          err?.response?.data?.message ||
            err?.response?.data?.title ||
            err?.message ||
            "Unable to load candidate review details.",
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [application, applicationId]);

  const handleAccept = async () => {
    try {
      setLoading(true);
      await acceptApplication(application.applicationId || application.id);
      // navigate back with optimistic update
      navigate("/employer/applications", { state: { updatedApplication: { ...(application.raw ?? application), status: "Accepted" } } });
    } catch (err) {
      window.alert("Failed to accept application.");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectConfirm = async (reason) => {
    try {
      setLoading(true);
      await rejectApplication(application.applicationId || application.id, reason || "");
      navigate("/employer/applications", { state: { updatedApplication: { ...(application.raw ?? application), status: "Rejected" } } });
    } catch (err) {
      window.alert("Failed to reject application.");
    } finally {
      setLoading(false);
      setRejectOpen(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-[radial-gradient(circle_at_top_left,rgba(255,214,195,0.42),transparent_35%),linear-gradient(180deg,#FFF9F5_0%,#FFFFFF_42%)] px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-5xl rounded-3xl border border-[#F1DED3] bg-white p-6 shadow-[0_20px_70px_rgba(122,62,29,0.08)] sm:p-8">
        <Link
          to="/employer/applications"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#7A3E1D] transition hover:text-[#5E2F15]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to employer reviews
        </Link>

        {loading ? (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[#EFD7C9] bg-[#FFF8F4] px-5 py-8 text-sm text-gray-700">
            <Loader2 className="h-5 w-5 animate-spin text-[#C26A42]" />
            Loading candidate review...
          </div>
        ) : error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        ) : application ? (
          <div className="mt-6 space-y-5">
            <header>
              <p className="text-xs font-poppins-semibold uppercase tracking-[0.22em] text-[#C26A42]">
                Candidate review
              </p>
              <h1 className="mt-2 text-3xl font-poppins-semibold text-[#1B1B1B] sm:text-4xl">
                {application.jobTitle || "Untitled role"}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Company: {application.companyName || "Unknown"} · Status: {application.status || "Submitted"}
              </p>
            </header>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-[#EFD7C9] bg-[#FFF8F4] p-4">
                <div className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-[#7A3E1D]">
                  <UserCheck className="h-4 w-4" />
                  Application id
                </div>
                <p className="text-sm text-gray-700">{application.applicationId || application.id || "N/A"}</p>
              </div>
              <div className="rounded-2xl border border-[#EFD7C9] bg-[#FFF8F4] p-4">
                <div className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-[#7A3E1D]">
                  <ClipboardList className="h-4 w-4" />
                  Session id
                </div>
                <p className="text-sm text-gray-700">{sessionId || "Not started"}</p>
              </div>
            </div>

            {result ? (
              <div className="rounded-2xl border border-[#EFD7C9] bg-[#FFF8F4] p-5">
                <div className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-[#7A3E1D]">
                  <Sparkles className="h-4 w-4" />
                  Screening result summary
                </div>
                <p className="text-sm text-gray-700">Status: {result.status || "Completed"}</p>
                <p className="mt-2 text-sm text-gray-700">Score: {result.score ?? "N/A"}</p>
                <p className="mt-2 text-sm text-gray-700">Summary: {result.summary || "No summary provided."}</p>
                <p className="mt-2 text-sm text-gray-700">Feedback: {result.feedback || "No feedback provided."}</p>
                <p className="mt-2 text-sm text-gray-700">Recommendation: {result.recommendation || "No recommendation provided."}</p>
              </div>
            ) : (
              <div className="rounded-2xl border border-[#EFD7C9] bg-[#FFF8F4] p-5 text-sm text-gray-700">
                This candidate has no interview result yet.
              </div>
            )}

            <div className="pt-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAccept}
                  className="rounded-xl bg-[#7A3E1D] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Accept
                </button>

                <button
                  onClick={() => setRejectOpen(true)}
                  className="rounded-xl border border-[#E6B8B8] bg-white px-5 py-3 text-sm font-medium text-[#C23A2B] transition hover:bg-[#FFF6F1]"
                >
                  Reject
                </button>

                <Link
                  to="/employer/applications"
                  className="ml-auto rounded-xl px-5 py-3 text-sm font-medium text-[#7A3E1D] transition hover:opacity-90"
                >
                  Back to review queue
                </Link>
              </div>
            </div>
            <RejectModal
              open={rejectOpen}
              title="Reject Application"
              itemName={application.jobTitle || application.companyName}
              onConfirm={handleRejectConfirm}
              onClose={() => setRejectOpen(false)}
            />
          </div>
        ) : null}
      </section>
    </main>
  );
};

export default EmployerApplicationReviewPage;
