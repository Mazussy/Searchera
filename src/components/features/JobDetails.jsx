import { Star, ChevronDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { submitApplication } from "../../utilities/api/interviewApi";

const JobDetails = ({ job }) => {
  const [showMore, setShowMore] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [applyError, setApplyError] = useState("");
  const navigate = useNavigate();

  const previewParagraphs = job.description.slice(0, 3);
  const hiddenParagraphs = job.description.slice(3);

  const handleApply = async () => {
    if (!job?.id) {
      setApplyError("This job cannot be applied to right now.");
      return;
    }

    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    setApplyError("");
    setIsApplying(true);

    try {
      const application = await submitApplication(job.id);
      const applicationId =
        application?.applicationId ||
        application?.id ||
        application?.ApplicationId ||
        application?.Id;

      if (!applicationId) {
        throw new Error("Application was created, but no application id was returned.");
      }

      navigate(`/interview/${applicationId}/disclaimer`, {
        state: {
          applicationId,
          jobId: job.id,
          jobTitle: job.title,
          companyName: job.company,
          jobLocation: job.location,
          jobSalary: job.salary,
        },
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
                <span className="text-xl font-avro font-normal leading-none sm:text-2xl md:text-3xl">{job.company}</span>
                <div className="flex items-center gap-1 text-xs font-normal sm:text-sm">
                  <span>{job.rating}</span>
                  <Star className="h-3.5 w-3.5 fill-current" />
                </div>
              </div>
              <h2 className="mb-1 text-2xl font-poppins-semibold leading-tight text-[#141414] sm:text-3xl md:text-4xl">
                {job.title}
              </h2>
              <div className="flex flex-wrap gap-2 text-sm text-[#6A6A6A] sm:text-base md:text-xl">
                <span>{job.location}</span>
                <span>·</span>
                <span>{job.salary}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleApply}
            disabled={isApplying}
            className="w-full rounded-lg bg-black px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1F1F1F] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
          >
            {isApplying ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Starting application...
              </span>
            ) : (
              "Apply"
            )}
          </button>
        </div>

        {applyError && (
          <div className="px-5 pb-4 md:px-7">
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {applyError}
            </p>
          </div>
        )}

        {job.resumeMatch && (
          <div className="border-t border-[#E7D9D0] bg-[#FFF0E8] px-5 py-4 md:px-7">
            <h3 className="text-xl font-poppins-medium text-[#E26F3A] sm:text-2xl md:text-3xl">
              Is your resume a good match?
            </h3>
            <p className="mt-1 text-[14px] text-[#EE8B5B]">
              Use AI to find out how well the skills on your resume fit this job
              description.
            </p>
            <button className="mt-3 rounded-md bg-[#E06E39] px-3 py-1.5 text-xs text-white transition-colors hover:bg-[#CC5F2D]">
              Get insights
            </button>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-[#DADADA] bg-white px-5 py-5 md:px-7">
        <h3 className="mb-4 text-2xl font-poppins-semibold text-[#1B1B1B] sm:text-3xl md:text-4xl">
          About {job.company}
        </h3>
        <div className="space-y-4 text-base leading-relaxed text-[#2C2C2C]">
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

          {showMore && job.fullDescription?.length > 0 && (
            job.fullDescription.map((paragraph, index) => (
              <p key={`${paragraph.slice(0, 20)}-full-${index}`}>{paragraph}</p>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default JobDetails;
