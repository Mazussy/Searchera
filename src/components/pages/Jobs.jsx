import { useEffect, useMemo, useState } from "react";
import JobCard from "../features/JobCard";
import JobDetails from "../features/JobDetails";
import SearchBar from "../features/SearchBar";
import { getAllJobs, getJobDetails } from "../../utilities/api/jobsApi";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({ keyword: "", location: "" });
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [apiMessage, setApiMessage] = useState("");

  useEffect(() => {
    let isActive = true;

    const loadJobs = async () => {
      setIsLoadingJobs(true);
      setApiMessage("");

      try {
        const apiJobs = await getAllJobs();

        if (!isActive) {
          return;
        }

        if (apiJobs.length > 0) {
          setJobs(apiJobs);
          setSelectedJobId(apiJobs[0].id);
        } else {
          setJobs([]);
          setSelectedJobId(null);
          setApiMessage(
            "No jobs available",
          );
        }
      } catch {
        if (!isActive) {
          return;
        }

        setApiMessage(
          "Could not load jobs from API.",
        );
      } finally {
        if (isActive) {
          setIsLoadingJobs(false);
        }
      }
    };

    loadJobs();

    return () => {
      isActive = false;
    };
  }, []);

  const filteredJobs = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase();
    const location = filters.location.trim().toLowerCase();

    return jobs.filter((job) => {
      const matchesKeyword =
        !keyword ||
        job.title.toLowerCase().includes(keyword) ||
        job.company.toLowerCase().includes(keyword);

      const matchesLocation =
        !location || job.location.toLowerCase().includes(location);

      return matchesKeyword && matchesLocation;
    });
  }, [filters, jobs]);

  useEffect(() => {
    if (!filteredJobs.length) {
      setSelectedJobId(null);
      return;
    }

    const stillSelected = filteredJobs.some((job) => job.id === selectedJobId);
    if (!stillSelected) {
      setSelectedJobId(filteredJobs[0].id);
    }
  }, [filteredJobs, selectedJobId]);

  const selectedJob =
    filteredJobs.find((job) => job.id === selectedJobId) ?? filteredJobs[0] ?? null;

  useEffect(() => {
    let isActive = true;

    const loadJobDetails = async () => {
      if (!selectedJobId) {
        return;
      }

      setIsLoadingDetails(true);

      try {
        const details = await getJobDetails(selectedJobId);

        if (!isActive || !details) {
          return;
        }

        setJobs((previousJobs) =>
          previousJobs.map((job) =>
            job.id === selectedJobId
              ? {
                  ...job,
                  ...details,
                  description:
                    details.description?.length > 0
                      ? details.description
                      : job.description,
                }
              : job,
          ),
        );
      } catch {
        // Keep list item data when details endpoint fails.
      } finally {
        if (isActive) {
          setIsLoadingDetails(false);
        }
      }
    };

    loadJobDetails();

    return () => {
      isActive = false;
    };
  }, [selectedJobId]);

  return (
    <main className="w-full border-b border-[#4242425C]/20">
      <section className="mx-auto w-full max-w-340 px-4 pb-8 md:px-8">
        <SearchBar filters={filters} onFiltersChange={setFilters} />

        {apiMessage && (
          <p className="mt-3 rounded-lg border border-[#F4D5C7] bg-[#FFF6F2] px-3 py-2 text-sm text-[#A85A35]">
            {apiMessage}
          </p>
        )}

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="max-h-none overflow-y-visible pr-0 lg:max-h-[calc(100vh-220px)] lg:overflow-y-auto lg:pr-1">
            {isLoadingJobs ? (
              <div className="rounded-xl border border-[#E5E5E5] bg-white p-4 text-sm text-[#6F6F6F]">
                Loading jobs...
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="divide-y divide-[#E5E5E5]">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSelected={job.id === selectedJob?.id}
                    onClick={() => setSelectedJobId(job.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-[#E5E5E5] bg-white p-4 text-sm text-[#6F6F6F]">
                No jobs found. Try a different keyword or location.
              </div>
            )}
          </aside>

          <section>
            {selectedJob ? (
              <>
                {isLoadingDetails && (
                  <p className="mb-2 text-sm text-[#7A7A7A]">Loading job details...</p>
                )}
                <JobDetails job={selectedJob} />
              </>
            ) : (
              <div className="rounded-2xl border border-[#E5E5E5] bg-white p-6 text-[#6F6F6F]">
                Select a job from the list to view details.
              </div>
            )}
          </section>
        </div>
      </section>
    </main>
  );
};

export default Jobs;
