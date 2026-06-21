import { Star, ChevronDown, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitApplication, getInsight } from "../../utilities/api/interviewApi";
import { useApplications } from "../../contexts/ApplicationContext";

const JobDetails = ({ job }) => {
  const [showMore, setShowMore] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isLoadingApplicationState, setIsLoadingApplicationState] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [existingApplication, setExistingApplication] = useState(null);
  const navigate = useNavigate();

  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [insightResult, setInsightResult] = useState(null);
  const [insightError, setInsightError] = useState("");

  useEffect(() => {
    setInsightResult(null);
    setInsightError("");
  }, [job?.id]);

  const previewParagraphs = job.description.slice(0, 3);
  const hiddenParagraphs = job.description.slice(3);

  const normalizedStatus = useMemo(
    () => String(existingApplication?.status || "").toLowerCase(),
    [existingApplication?.status],
  );

  const applicationId =
    existingApplication?.applicationId ||
    existingApplication?.id ||
    existingApplication?.ApplicationId ||
    existingApplication?.Id;

  const isBlocked =
    normalizedStatus.includes("cheat") ||
    normalizedStatus.includes("block") ||
    normalizedStatus.includes("terminat");

  const isApplied =
    normalizedStatus.includes("complete") ||
    normalizedStatus.includes("pass") ||
    normalizedStatus.includes("accept") ||
    normalizedStatus.includes("hire");

  const isInProgress =
    normalizedStatus.includes("interview") ||
    normalizedStatus.includes("progress") ||
    normalizedStatus.includes("screen");

  const hasExistingApplication = Boolean(applicationId);

  const applyButtonLabel = useMemo(() => {
    if (isApplying) {
      return "Creating application...";
    }

    if (isLoadingApplicationState) {
      return "Checking status...";
    }

    if (isBlocked) {
      return "Blocked";
    }

    if (isApplied) {
      return "Applied";
    }

    if (hasExistingApplication) {
      return "Applied";
    }

    return "Apply";
  }, [hasExistingApplication, isApplied, isApplying, isBlocked, isLoadingApplicationState]);

  const { applicationsMap, loading: appsLoading } = useApplications();

  useEffect(() => {
    if (!job?.id) return;

    const entry = applicationsMap[String(job.id)] || null;
    setExistingApplication(entry);
    setIsLoadingApplicationState(Boolean(appsLoading));
  }, [applicationsMap, appsLoading, job?.id]);

  const goToDisclaimer = (resolvedApplicationId) => {
    if (!resolvedApplicationId) {
      return;
    }

    navigate(`/interview/${resolvedApplicationId}/disclaimer`, {
      state: {
        applicationId: resolvedApplicationId,
        jobId: job.id,
        jobTitle: job.title,
        companyName: job.company,
        jobLocation: job.location,
        jobSalary: job.salary,
      },
    });
  };

  const handleApply = async () => {
    if (!job?.id) {
      setApplyError("This job cannot be applied to right now.");
      return;
    }

    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    if (isBlocked || isApplied) {
      return;
    }

    if (hasExistingApplication) {
      return;
    }

    setApplyError("");
    setIsApplying(true);

    try {
      const application = await submitApplication(job.id);
      const createdApplicationId =
        application?.applicationId ||
        application?.id ||
        application?.ApplicationId ||
        application?.Id;

      if (!createdApplicationId) {
        throw new Error("Application was created, but no application id was returned.");
      }

      setExistingApplication({
        ...application,
        applicationId: createdApplicationId,
        id: createdApplicationId,
        jobId: application?.jobId || job.id,
        status: application?.status || "submitted",
      });
    } catch (error) {
      setApplyError(
        error?.response?.data?.message ||
          error?.response?.data?.title ||
          error?.message ||
          "Unable to start the application.",
      );
    } finally {
      setIsApplying(false);
    }
  };

  const handleGetInsight = async () => {
    if (!job?.id) {
      setInsightError("Invalid job reference.");
      return;
    }

    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    setIsLoadingInsight(true);
    setInsightError("");
    setInsightResult(null);

    try {
      const res = await getInsight(job.id);
      let text = "";
      if (typeof res === "string") {
        text = res;
      } else if (res && typeof res === "object") {
        text = res.insight ?? res.insights ?? res.result ?? res.matchingResult ?? res.description ?? res.message ?? JSON.stringify(res);
      } else {
        text = "No match insights were returned from the server.";
      }
      setInsightResult(text);
    } catch (err) {
      setInsightError(
        err.response?.data?.message ||
        err.response?.data?.title ||
        err.message ||
        "Failed to load insights."
      );
    } finally {
      setIsLoadingInsight(false);
    }
  };

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-2xl border border-[#DADADA] bg-white">
        <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-start sm:justify-between md:px-7">
          <div className="flex flex-1 min-w-0 items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#E0E0E0] bg-white">
              <span className="text-lg font-semibold text-[#292624]">
                {job.company.charAt(0)}
              </span>
            </div>

            <div className="min-w-0">
              <div className="mb-1 flex items-center gap-3 text-[#292624]">
                <span className="text-lg font-avro font-normal leading-none sm:text-xl md:text-2xl">
                  {job.company}
                </span>
                <div className="flex items-center gap-1 text-xs font-normal sm:text-sm">
                  <span>{job.rating}</span>
                  <Star className="h-3.5 w-3.5 fill-current" />
                </div>
              </div>
              <h2 className="mb-1 text-xl font-poppins-semibold leading-tight text-[#141414] sm:text-2xl md:text-3xl">
                {job.title}
              </h2>
              <div className="flex flex-wrap gap-2 text-sm text-[#6A6A6A] sm:text-base md:text-lg">
                <span>{job.location}</span>
                <span>·</span>
                <span>{job.salary}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleApply}
            disabled={isApplying || isLoadingApplicationState || isBlocked || isApplied || hasExistingApplication}
            className="w-full rounded-lg bg-black px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1F1F1F] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {isApplying || isLoadingApplicationState ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {applyButtonLabel}
              </span>
            ) : (
              applyButtonLabel
            )}
          </button>
        </div>

        {hasExistingApplication && !isBlocked && !isApplied && (
          <div className="px-5 pb-4 md:px-7">
            <div className="rounded-xl border border-[#E7D9D0] bg-[#FFF8F4] px-4 py-4">
              <p className="text-sm text-[#7A3E1D]">
                Your application has been received. To complete your application, you must take the virtual interview.
              </p>
              <button
                type="button"
                onClick={() => goToDisclaimer(applicationId)}
                className="mt-3 rounded-lg bg-[#7A3E1D] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
              >
                Start interview
              </button>
            </div>
          </div>
        )}

        {isBlocked && (
          <div className="px-5 pb-4 md:px-7">
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              This application is blocked due to interview integrity violations. You cannot re-apply for this role.
            </p>
          </div>
        )}

        {isApplied && (
          <div className="px-5 pb-4 md:px-7">
            <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              You already applied for this role.
            </p>
          </div>
        )}

        {applyError && (
          <div className="px-5 pb-4 md:px-7">
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {applyError}
            </p>
          </div>
        )}

        {job.resumeMatch && (
          <div className="border-t border-[#E7D9D0] bg-[#FFF0E8] px-5 py-4 md:px-7">
            <h3 className="text-lg font-poppins-medium text-[#E26F3A] sm:text-xl md:text-2xl">
              Is your resume a good match?
            </h3>
            <p className="mt-1 text-[14px] text-[#EE8B5B]">
              Use AI to find out how well the skills on your resume fit this job
              description.
            </p>
            {insightError && (
              <p className="mt-2 text-xs text-red-500">{insightError}</p>
            )}
            {insightResult ? (
              <div className="mt-4 rounded-xl bg-white border border-[#E7D9D0] p-4 text-sm font-poppins text-gray-700 leading-relaxed whitespace-pre-line shadow-sm">
                <h4 className="font-poppins-semibold text-[#E26F3A] mb-2 text-xs uppercase tracking-wide">AI Match Insights</h4>
                {insightResult}
              </div>
            ) : (
              <button
                onClick={handleGetInsight}
                disabled={isLoadingInsight}
                className="mt-3 rounded-md bg-[#E06E39] px-3 py-1.5 text-xs text-white transition-colors hover:bg-[#CC5F2D] disabled:opacity-50 flex items-center gap-2"
              >
                {isLoadingInsight && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {isLoadingInsight ? "Analyzing resume..." : "Get insights"}
              </button>
            )}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-[#DADADA] bg-white px-5 py-5 md:px-7">
        <h3 className="mb-4 text-lg font-poppins-semibold text-[#1B1B1B] sm:text-xl md:text-2xl">
          About {job.company}
        </h3>
        <div className="space-y-4 text-sm leading-relaxed text-[#2C2C2C] sm:text-[15px]">
          {previewParagraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}

          {!showMore && hiddenParagraphs.length > 0 && (
            <button
              onClick={() => setShowMore(true)}
              className="flex items-center gap-1 text-sm font-medium text-tritary-accent hover:text-[#CC5F2D] sm:text-base md:text-lg"
            >
              Show more <ChevronDown className="h-4 w-4" />
            </button>
          )}

          {showMore &&
            hiddenParagraphs.map((paragraph, index) => (
              <p key={`${paragraph.slice(0, 20)}-${index}`}>{paragraph}</p>
            ))}

          {showMore &&
            job.fullDescription?.length > 0 &&
            job.fullDescription.map((paragraph, index) => (
              <p key={`${paragraph.slice(0, 20)}-full-${index}`}>{paragraph}</p>
            ))}
        </div>
      </section>
    </div>
  );
};

export default JobDetails;
