import { Star, ChevronDown } from "lucide-react";
import { useState } from "react";

const JobDetails = ({ job }) => {
  const [showMore, setShowMore] = useState(false);

  const previewParagraphs = job.description.slice(0, 3);
  const hiddenParagraphs = job.description.slice(3);

  return (
    <div className="space-y-4">
      <section className="overflow-hidden rounded-2xl border border-[#DADADA] bg-white">
        <div className="flex items-start justify-between px-5 py-5 md:px-7">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#E0E0E0] bg-white">
              <span className="text-lg font-semibold text-[#292624]">
                {job.company.charAt(0)}
              </span>
            </div>

            <div>
              <div className="mb-1 flex items-center gap-3 text-[#292624]">
                <span className="text-3xl font-avro font-normal leading-none">{job.company}</span>
                <div className="flex items-center gap-1 text-sm font-normal">
                  <span>{job.rating}</span>
                  <Star className="h-3.5 w-3.5 fill-current" />
                </div>
              </div>
              <h2 className="mb-1 text-4xl font-poppins-semibold leading-tight text-[#141414]">
                {job.title}
              </h2>
              <div className="flex flex-wrap gap-2 text-xl text-[#6A6A6A]">
                <span>{job.location}</span>
                <span>·</span>
                <span>{job.salary}</span>
              </div>
            </div>
          </div>

          <button className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1F1F1F]">
            Apply
          </button>
        </div>

        {job.resumeMatch && (
          <div className="border-t border-[#E7D9D0] bg-[#FFF0E8] px-5 py-4 md:px-7">
            <h3 className="text-3xl font-poppins-medium text-[#E26F3A]">
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
        <h3 className="mb-4 text-4xl font-poppins-semibold text-[#1B1B1B]">
          About {job.company}
        </h3>
        <div className="space-y-4 text-base leading-relaxed text-[#2C2C2C]">
          {previewParagraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}

          {!showMore && hiddenParagraphs.length > 0 && (
            <button
              onClick={() => setShowMore(true)}
              className="flex items-center gap-1 text-lg font-medium text-tritary-accent hover:text-[#CC5F2D]"
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
