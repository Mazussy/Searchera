import { useEffect, useMemo, useState } from "react";
import JobCard from "../features/JobCard";
import JobDetails from "../features/JobDetails";
import SearchBar from "../features/SearchBar";
import { getAllJobs, getJobDetails } from "../../utilities/api/jobsApi";

const jobsSeed = [
  {
    id: 1,
    company: "Avalere Health",
    title: "Associate Project Manager (Pharma Agency)",
    rating: "3.0",
    location: "Remote",
    salary: "$55K - $70K (Employer provided)",
    postedTime: "23d+",
    resumeMatch: true,
    description: [
      "United by one profound purpose: to reach EVERY PATIENT POSSIBLE. At Avalere Health, we ensure every patient is identified, treated, supported, and cared for. Equally. Our Advisory, Medical, and Marketing teams come together — powerfully and intentionally — to forge unconditional connections, building a future where healthcare is not a barrier and no patient is left behind.",
      "Achieving our mission starts with providing enriching, purpose-driven careers for our team that empower them to make a tangible impact on patient lives. We are committed to creating a culture where our employees are empowered to bring their whole selves to work and tap into the power of diverse backgrounds and skillsets to play a part in making a difference for every patient, everywhere.",
      "Our flexible approach to working allows our global teams to decide where they want to work, whether in-office or at home based on team and client need. Major city hubs in London, Manchester, Washington, D.C., and New York, and smaller offices globally, serve as collaboration hubs allowing our teams to come together when it matters.",
      "Homeworkers are equally supported, with dedicated social opportunities and resources.",
    ],
    fullDescription: [
      "Our inclusive culture is at the heart of everything we do. We proudly support our employees in making career decisions that help them grow while maintaining balance and wellbeing.",
    ],
  },
  {
    id: 2,
    company: "Nova Labs",
    title: "Frontend Engineer (React)",
    rating: "4.2",
    location: "Cairo, Egypt",
    salary: "$35K - $48K",
    postedTime: "2d",
    resumeMatch: true,
    description: [
      "Nova Labs is building AI-first products for the healthcare and education sectors. We're looking for a frontend engineer who can turn complex workflows into elegant interfaces.",
      "You will work closely with product designers and backend engineers to build reusable components, improve accessibility, and optimize performance across our React applications.",
      "The ideal candidate is comfortable with design systems, has experience with API integrations, and enjoys shipping polished features quickly.",
    ],
    fullDescription: [],
  },
  {
    id: 3,
    company: "BluePeak",
    title: "Product Designer",
    rating: "4.0",
    location: "Remote",
    salary: "$40K - $60K",
    postedTime: "5d",
    resumeMatch: false,
    description: [
      "BluePeak partners with startups to design and launch meaningful digital products. We are seeking a product designer with a strong systems-thinking mindset.",
      "You'll own user journeys from discovery to polished UI, collaborating with product and engineering to define practical and delightful experiences.",
      "A portfolio that demonstrates problem solving, interaction design, and visual craft is required.",
    ],
    fullDescription: [],
  },
  {
    id: 4,
    company: "Horizons Group",
    title: "Operations Specialist",
    rating: "3.8",
    location: "Dubai, UAE",
    salary: "$28K - $38K",
    postedTime: "1w",
    resumeMatch: false,
    description: [
      "Horizons Group supports scaling companies with operational excellence and distributed teams. This role is ideal for detail-oriented professionals.",
      "You will coordinate workflows, maintain team documentation, and support cross-functional communication to keep delivery smooth and predictable.",
      "Prior experience in operations, project coordination, or agency environments is a plus.",
    ],
    fullDescription: [],
  },
  {
    id: 5,
    company: "Wave Commerce",
    title: "Growth Marketing Manager",
    rating: "4.1",
    location: "Riyadh, Saudi Arabia",
    salary: "$42K - $58K",
    postedTime: "3d",
    resumeMatch: true,
    description: [
      "Wave Commerce helps D2C brands scale through data-backed growth and performance campaigns.",
      "In this role, you will plan channel strategy, own campaign execution, and collaborate with content and design teams to drive measurable impact.",
      "Strong analytical thinking and hands-on experience in paid media platforms are important.",
    ],
    fullDescription: [],
  },
  {
    id: 6,
    company: "Astra Ventures",
    title: "Business Development Associate",
    rating: "3.9",
    location: "Amman, Jordan",
    salary: "$25K - $34K",
    postedTime: "4d",
    resumeMatch: false,
    description: [
      "Astra Ventures supports early-stage companies in MENA with strategic partnerships and market expansion.",
      "You will research potential partners, prepare outreach materials, and support deal pipeline management.",
      "Excellent communication skills in English and Arabic are preferred.",
    ],
    fullDescription: [],
  },
];

const Jobs = () => {
  const [jobs, setJobs] = useState(jobsSeed);
  const [filters, setFilters] = useState({ keyword: "", location: "" });
  const [selectedJobId, setSelectedJobId] = useState(jobsSeed[0]?.id ?? null);
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
        }
      } catch {
        if (!isActive) {
          return;
        }

        setApiMessage(
          "Could not load jobs from API, showing local sample data for now.",
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
          <aside className="max-h-[calc(100vh-220px)] overflow-y-auto pr-1">
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
