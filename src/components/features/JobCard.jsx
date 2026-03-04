import { Star } from "lucide-react";

const JobCard = ({ job, isSelected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-4 transition-all ${
        isSelected
          ? "rounded-2xl border border-[#E5E5E5] bg-[#FAFAFA] shadow-sm"
          : "hover:bg-gray-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#E3E3E3] bg-white">
          <span className="text-sm font-semibold text-[#292624]">
            {job.company.charAt(0)}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-1 flex items-center gap-2 text-sm text-[#292624]">
            <span className="truncate font-normal">{job.company}</span>
            <div className="flex items-center gap-1 text-[13px] font-normal">
              <span>{job.rating}</span>
              <Star className="h-3.5 w-3.5 fill-current" />
            </div>
          </div>

          <h3 className="mb-1 line-clamp-2 font-poppins-semibold text-[17px] leading-snug text-[#292624]">
            {job.title}
          </h3>

          <div className="space-y-1 text-sm text-[#646464]">
            <p>{job.location}</p>
            <p>{job.salary}</p>
          </div>

          <div className="mt-2 text-right text-xs text-[#9A9A9A]">{job.postedTime}</div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
