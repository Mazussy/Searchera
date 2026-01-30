import { Star } from "lucide-react";

const JobCard = ({ job, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
          <span className="font-bold text-lg">{job.company.charAt(0)}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">{job.company}</span>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm">{job.rating}</span>
            </div>
          </div>

          <h3 className="font-semibold mb-1">{job.title}</h3>

          <div className="text-sm space-y-1">
            <p>{job.location}</p>
            <p>{job.salary}</p>
          </div>

          <div className="text-xs text-gray-500 mt-2">{job.postedTime}</div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
