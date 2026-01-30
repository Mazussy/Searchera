import { Star, ChevronDown } from "lucide-react";
import { useState } from "react";

const JobDetails = ({ job }) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="border rounded-lg p-6 bg-white">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center shrink-0">
            <span className="font-bold text-xl">{job.company.charAt(0)}</span>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">{job.company}</span>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm">{job.rating}</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
            <div className="flex gap-4 text-sm">
              <span>{job.location}</span>
              <span>{job.salary}</span>
            </div>
          </div>
        </div>

        <button className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
          Apply
        </button>
      </div>

      {/* Resume Match Banner */}
      {job.resumeMatch && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-1">Is your resume a good match?</h3>
          <p className="text-sm mb-3">
            Use AI to find out how well the skills on your resume fit this job
            description.
          </p>
          <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition-colors">
            Get insights
          </button>
        </div>
      )}

      {/* About Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">About {job.company}</h3>
        <div className="space-y-4 text-sm leading-relaxed">
          {job.description.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}

          {!showMore && job.fullDescription && (
            <button
              onClick={() => setShowMore(true)}
              className="flex items-center gap-1 text-orange-500 hover:text-orange-600 font-medium"
            >
              Show more <ChevronDown className="w-4 h-4" />
            </button>
          )}

          {showMore && job.fullDescription && (
            <>
              {job.fullDescription.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Additional sections can be added here */}
    </div>
  );
};

export default JobDetails;
