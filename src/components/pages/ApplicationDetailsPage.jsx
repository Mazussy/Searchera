import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, CalendarClock, Building2, Briefcase } from "lucide-react";
import { getApplicationById, normalizeApplication } from "../../utilities/api/interviewApi";

const formatDate = (value) => {
  if (!value) {
    return "Recently";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Recently";
  }

  return parsed.toLocaleString();
};

const ApplicationDetailsPage = () => {
  const { applicationId } = useParams();
  const location = useLocation();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const applicationFromState = useMemo(() => {
    if (!location.state?.applicationId) {
      return null;
    }

    return normalizeApplication({
      applicationId: location.state.applicationId,
      jobTitle: location.state.jobTitle,
      companyName: location.state.companyName,
      status: location.state.status,
      appliedAt: location.state.appliedAt,
      sessionId: location.state.sessionId,
    });
  }, [location.state]);

  useEffect(() => {
    let mounted = true;

    const loadDetails = async () => {
      if (!applicationId) {
        setError("Missing application id.");
        setLoading(false);
        return;
      }

      if (applicationFromState) {
        setApplication(applicationFromState);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const found = await getApplicationById(applicationId);

        if (!mounted) {
          return;
        }

        if (!found) {
          setError("Application not found.");
          setApplication(null);
        } else {
          setApplication(normalizeApplication(found.raw ?? found));
        }
      } catch (err) {
        if (!mounted) {
          return;
        }

        setError(
          err?.response?.data?.message ||
            err?.response?.data?.title ||
            err?.message ||
            "Unable to load application details.",
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDetails();

    return () => {
      mounted = false;
    };
  }, [applicationFromState, applicationId]);

  const interviewRoute = application?.applicationId
    ? `/interview/${application.applicationId}/disclaimer`
    : "/applications";

  const resultRoute = application?.sessionId
    ? `/interview-results/${application.sessionId}`
    : null;

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-[radial-gradient(circle_at_top_left,rgba(255,214,195,0.42),transparent_35%),linear-gradient(180deg,#FFF9F5_0%,#FFFFFF_42%)] px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-5xl rounded-3xl border border-[#F1DED3] bg-white p-6 shadow-[0_20px_70px_rgba(122,62,29,0.08)] sm:p-8">
        <Link
          to="/applications"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#7A3E1D] transition hover:text-[#5E2F15]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to applications
        </Link>

        {loading ? (
          <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[#EFD7C9] bg-[#FFF8F4] px-5 py-8 text-sm text-gray-700">
            <Loader2 className="h-5 w-5 animate-spin text-[#C26A42]" />
            Loading application details...
          </div>
        ) : error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        ) : application ? (
          <div className="mt-6 space-y-5">
            <header>
              <p className="text-xs font-poppins-semibold uppercase tracking-[0.22em] text-[#C26A42]">
                Application details
              </p>
              <h1 className="mt-2 text-3xl font-poppins-semibold text-[#1B1B1B] sm:text-4xl">
                {application.jobTitle || "Untitled role"}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Application #{String(application.applicationId || application.id || "N/A").slice(0, 8)}
              </p>
            </header>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-[#EFD7C9] bg-[#FFF8F4] p-4">
                <div className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-[#7A3E1D]">
                  <Building2 className="h-4 w-4" />
                  Company
                </div>
                <p className="text-sm text-gray-700">{application.companyName || "Unknown company"}</p>
              </div>

              <div className="rounded-2xl border border-[#EFD7C9] bg-[#FFF8F4] p-4">
                <div className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-[#7A3E1D]">
                  <Briefcase className="h-4 w-4" />
                  Status
                </div>
                <p className="text-sm text-gray-700">{application.status || "Submitted"}</p>
              </div>

              <div className="rounded-2xl border border-[#EFD7C9] bg-[#FFF8F4] p-4 md:col-span-2">
                <div className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-[#7A3E1D]">
                  <CalendarClock className="h-4 w-4" />
                  Applied at
                </div>
                <p className="text-sm text-gray-700">{formatDate(application.appliedAt)}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              {resultRoute ? (
                <Link
                  to={resultRoute}
                  state={{
                    applicationId: application.applicationId,
                    jobTitle: application.jobTitle,
                    companyName: application.companyName,
                    sessionId: application.sessionId,
                  }}
                  className="rounded-xl bg-[#7A3E1D] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                >
                  View interview result
                </Link>
              ) : (
                <Link
                  to={interviewRoute}
                  state={{
                    applicationId: application.applicationId,
                    jobTitle: application.jobTitle,
                    companyName: application.companyName,
                    sessionId: application.sessionId,
                  }}
                  className="rounded-xl bg-[#7A3E1D] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Continue interview
                </Link>
              )}

              <Link
                to="/jobs"
                className="rounded-xl border border-[#E7D9D0] bg-white px-5 py-3 text-sm font-medium text-[#7A3E1D] transition hover:bg-[#FFF6F1]"
              >
                Browse jobs
              </Link>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
};

export default ApplicationDetailsPage;
