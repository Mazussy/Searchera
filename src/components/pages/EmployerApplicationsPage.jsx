import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Users, ArrowRight } from "lucide-react";
import { getAllApplications } from "../../utilities/api/interviewApi";

const EmployerApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadApplications = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getAllApplications();

        if (!mounted) {
          return;
        }

        setApplications(data);
      } catch (err) {
        if (!mounted) {
          return;
        }

        setError(
          err?.response?.data?.message ||
            err?.response?.data?.title ||
            err?.message ||
            "Unable to load employer application reviews.",
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadApplications();

    return () => {
      mounted = false;
    };
  }, []);

  const sortedApplications = useMemo(
    () =>
      [...applications].sort((left, right) => {
        const leftDate = left.appliedAt ? new Date(left.appliedAt).getTime() : 0;
        const rightDate = right.appliedAt ? new Date(right.appliedAt).getTime() : 0;
        return rightDate - leftDate;
      }),
    [applications],
  );

  return (
    <main className="min-h-[calc(100vh-8rem)] bg-[radial-gradient(circle_at_top_left,rgba(255,214,195,0.42),transparent_35%),linear-gradient(180deg,#FFF9F5_0%,#FFFFFF_42%)] px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <p className="text-xs font-poppins-semibold uppercase tracking-[0.22em] text-[#C26A42]">
          Employer dashboard
        </p>
        <h1 className="mt-2 text-4xl font-poppins-semibold text-[#1B1B1B] sm:text-5xl">
          Candidate Screening Reviews
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-gray-600">
          Review submitted applications and open candidate screening outcomes. This page is wired to
          the available application listing endpoint and can be refined when employer-specific filters
          are exposed by the backend.
        </p>

        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Note: current backend responses may include all accessible applications. Employer-specific
          filtering can be tightened as soon as dedicated endpoints are available.
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="flex items-center gap-3 rounded-3xl border border-[#EFD7C9] bg-white px-5 py-8 text-sm text-gray-700 shadow-sm">
              <Loader2 className="h-5 w-5 animate-spin text-[#C26A42]" />
              Loading candidate applications...
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {error}
            </div>
          ) : sortedApplications.length === 0 ? (
            <div className="rounded-3xl border border-[#EFD7C9] bg-white px-5 py-8 text-sm text-gray-600 shadow-sm">
              No applications available for review yet.
            </div>
          ) : (
            <div className="grid gap-4">
              {sortedApplications.map((application) => {
                const id = application.applicationId || application.id;

                return (
                  <article
                    key={String(id || `${application.jobTitle}-${application.companyName}`)}
                    className="rounded-3xl border border-[#F1DED3] bg-white p-5 shadow-[0_10px_30px_rgba(122,62,29,0.05)]"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF2EA] text-[#C26A42]">
                          <Users className="h-5 w-5" />
                        </div>
                        <div>
                          <h2 className="text-lg font-poppins-semibold text-[#1B1B1B]">
                            {application.jobTitle || "Untitled role"}
                          </h2>
                          <p className="text-sm text-gray-600">
                            {application.companyName || "Company unavailable"}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            Status: {application.status || "Submitted"}
                          </p>
                        </div>
                      </div>

                      <Link
                        to={id ? `/employer/applications/${id}` : "/employer/applications"}
                        state={{ application }}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#7A3E1D] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
                      >
                        Review candidate
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default EmployerApplicationsPage;
