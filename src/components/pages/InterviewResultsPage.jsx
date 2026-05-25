import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, Award, CheckCircle2, Loader2, Sparkles, BarChart3 } from "lucide-react";
import { getInterviewResult, normalizeInterviewResult } from "../../utilities/api/interviewApi";

const safeNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const InterviewResultsPage = () => {
  const { sessionId } = useParams();
  const location = useLocation();

  const initialResult = useMemo(() => {
    if (location.state?.result) {
      return normalizeInterviewResult(location.state.result);
    }

    return null;
  }, [location.state?.result]);

  const [result, setResult] = useState(initialResult);
  const [loading, setLoading] = useState(!initialResult);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialResult || !sessionId) {
      return;
    }

    let mounted = true;

    const loadResult = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getInterviewResult(sessionId);
        if (!mounted) {
          return;
        }

        setResult(normalizeInterviewResult(data));
      } catch (err) {
        if (!mounted) {
          return;
        }

        setError(
          err?.response?.data?.message ||
            err?.response?.data?.title ||
            err?.message ||
            "Unable to load the interview result.",
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadResult();

    return () => {
      mounted = false;
    };
  }, [initialResult, sessionId]);

  const scoreValue = safeNumber(result?.score);
  const scoreLabel = scoreValue === null ? "Pending" : `${Math.round(scoreValue)}%`;
  const isPassed = Boolean(result?.passed || (scoreValue !== null && scoreValue >= 70));

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(255,213,188,0.45),transparent_30%),linear-gradient(180deg,#FFF9F5_0%,#FFFFFF_35%,#FFFDFC_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-5xl">
        <Link
          to="/applications"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#7A3E1D] transition hover:text-[#5E2F15]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to applications
        </Link>

        <div className="mt-5 rounded-4xl border border-[#F1DED3] bg-white p-6 shadow-[0_22px_70px_rgba(122,62,29,0.08)] sm:p-8">
          <div className="flex flex-col gap-4 border-b border-[#F2E4DA] pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-poppins-semibold uppercase tracking-[0.22em] text-[#C26A42]">
                Interview results
              </p>
              <h1 className="mt-2 text-3xl font-poppins-semibold text-[#1B1B1B] sm:text-4xl">
                Your screening summary
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Session {sessionId ? `#${String(sessionId).slice(0, 8)}` : "unavailable"}
              </p>
            </div>

            <div className={`rounded-2xl px-4 py-3 text-sm font-medium ${isPassed ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
              {isPassed ? "Recommended for next steps" : "Needs review"}
            </div>
          </div>

          {loading ? (
            <div className="mt-6 flex items-center gap-3 rounded-3xl border border-dashed border-[#F1DED3] bg-[#FFF8F4] px-5 py-8 text-sm text-gray-600">
              <Loader2 className="h-5 w-5 animate-spin text-[#C26A42]" />
              Loading your interview summary...
            </div>
          ) : error ? (
            <div className="mt-6 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {error}
            </div>
          ) : result ? (
            <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              <section className="rounded-3xl bg-[linear-gradient(180deg,#FFF7F1_0%,#FFFDFB_100%)] p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#C26A42] shadow-sm">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-poppins-semibold text-[#1B1B1B]">
                      Performance score
                    </h2>
                    <p className="text-sm text-gray-600">
                      Based on the interview answers returned by the backend.
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex items-end gap-4">
                  <div className="text-6xl font-poppins-semibold tracking-tight text-[#1B1B1B]">
                    {scoreLabel}
                  </div>
                  <div className="pb-2 text-sm text-gray-600">
                    {scoreValue === null ? "Waiting for the backend to return a score." : "overall interview match"}
                  </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-full bg-white/80">
                  <div
                    className="h-3 rounded-full bg-[linear-gradient(90deg,#C26A42_0%,#E89B6B_100%)] transition-all"
                    style={{ width: `${Math.min(Math.max(scoreValue ?? 0, 0), 100)}%` }}
                  />
                </div>

                <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm text-gray-700 shadow-sm">
                  <Sparkles className="h-4 w-4 text-[#C26A42]" />
                  {result.summary || "The backend did not return a summary message yet."}
                </div>
              </section>

              <section className="space-y-4">
                <div className="rounded-3xl border border-[#F1DED3] bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF2EA] text-[#C26A42]">
                      <BarChart3 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-poppins-semibold text-[#1B1B1B]">
                        Feedback
                      </h3>
                      <p className="text-sm text-gray-600">
                        Review the notes captured from your interview.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3 text-sm leading-6 text-gray-700">
                    <p className="rounded-2xl bg-[#FFF8F4] px-4 py-3">
                      <span className="font-medium text-[#7A3E1D]">Status:</span> {result.status || "Completed"}
                    </p>
                    <p className="rounded-2xl bg-[#FFF8F4] px-4 py-3">
                      <span className="font-medium text-[#7A3E1D]">Feedback:</span> {result.feedback || "No feedback returned yet."}
                    </p>
                    <p className="rounded-2xl bg-[#FFF8F4] px-4 py-3">
                      <span className="font-medium text-[#7A3E1D]">Next steps:</span> {result.recommendation || "No next steps were returned yet."}
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl border border-[#F1DED3] bg-[#FFF8F4] p-5 shadow-sm">
                  <h3 className="text-lg font-poppins-semibold text-[#1B1B1B]">
                    Continue from here
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Use this result to decide whether to keep applying, review your profile, or move to other roles.
                  </p>
                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <Link
                      to="/applications"
                      className="inline-flex items-center justify-center rounded-xl bg-[#7A3E1D] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                    >
                      My applications
                    </Link>
                    <Link
                      to="/jobs"
                      className="inline-flex items-center justify-center rounded-xl border border-[#E7D9D0] bg-white px-4 py-2.5 text-sm font-medium text-[#7A3E1D] transition hover:bg-[#FFF6F1]"
                    >
                      Browse jobs
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <div className="mt-6 rounded-3xl border border-[#F1DED3] bg-[#FFF8F4] px-5 py-8 text-sm text-gray-600">
              No interview result was returned for this session yet.
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default InterviewResultsPage;