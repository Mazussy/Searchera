import { useState, useEffect } from "react";
import SearchBar from "../features/SearchBar";
import JobCard from "../features/JobCard";
import JobDetails from "../features/JobDetails";

const Jobs = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch("YOUR_BACKEND_ENDPOINT_HERE");

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data = await response.json();
        setJobs(data); // or data.jobs depending on your API response structure
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Sample data for reference - remove when using real API
  const sampleJobs = [
    {
      id: 1,
      company: "Avalere Health",
      rating: "3.0",
      title: "Associate Project Manager (Pharma Agency)",
      location: "Remote",
      salary: "$55K - $70K (Employer provided)",
      postedTime: "23d+",
      resumeMatch: true,
      description: [
        "United by one profound purpose: to reach EVERY PATIENT POSSIBLE. At Avalere Health, we ensure every patient is identified, treated, supported, and cared for. Equally. Our Advisory, Medical, and Marketing teams come together – powerfully and intentionally – to forge unconventional connections, building a future where healthcare is not a barrier and no patient is left behind.",
        "Achieving our mission starts with providing enriching, purpose-driven careers for our team that empower them to make a tangible impact on patient lives. We are committed to creating a culture where our employees are empowered to bring their whole selves to work and tap into the power of diverse backgrounds and skillsets to play a part in making a difference for every patient, everywhere.",
        "Our flexible approach to working allows our global teams to decide where they want to work, either at home based on team need. Major city hubs in London, Manchester, Washington, D.C., and New York, and smaller offices globally, serve as collaboration hubs allowing our teams to come together when it matters. Homeworkers are equally supported, with dedicated social opportunities and resources.",
      ],
      fullDescription: [
        "Our inclusive culture is at the heart of everything we do. We proudly support our employees in being their authentic selves and celebrate the diversity of thought, background, and experience that makes our team stronger.",
      ],
    },
    {
      id: 2,
      company: "Avalere Health",
      rating: "3.0",
      title: "Associate Project Manager (Pharma Agency)",
      location: "Remote",
      salary: "$55K - $70K (Employer provided)",
      postedTime: "23d+",
      resumeMatch: false,
      description: [
        "United by one profound purpose: to reach EVERY PATIENT POSSIBLE. At Avalere Health, we ensure every patient is identified, treated, supported, and cared for.",
      ],
    },
    {
      id: 3,
      company: "Avalere Health",
      rating: "3.0",
      title: "Associate Project Manager (Pharma Agency)",
      location: "Remote",
      salary: "$55K - $70K (Employer provided)",
      postedTime: "23d+",
      resumeMatch: false,
      description: [
        "United by one profound purpose: to reach EVERY PATIENT POSSIBLE. At Avalere Health, we ensure every patient is identified, treated, supported, and cared for.",
      ],
    },
    {
      id: 4,
      company: "Avalere Health",
      rating: "3.0",
      title: "Associate Project Manager (Pharma Agency)",
      location: "Remote",
      salary: "$55K - $70K (Employer provided)",
      postedTime: "23d+",
      resumeMatch: false,
      description: [
        "United by one profound purpose: to reach EVERY PATIENT POSSIBLE. At Avalere Health, we ensure every patient is identified, treated, supported, and cared for.",
      ],
    },
    {
      id: 5,
      company: "Avalere Health",
      rating: "3.0",
      title: "Associate Project Manager (Pharma Agency)",
      location: "Remote",
      salary: "$55K - $70K (Employer provided)",
      postedTime: "23d+",
      resumeMatch: false,
      description: [
        "United by one profound purpose: to reach EVERY PATIENT POSSIBLE. At Avalere Health, we ensure every patient is identified, treated, supported, and cared for.",
      ],
    },
  ];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        Loading jobs...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <SearchBar />

      <div className="grid grid-cols-5 gap-6 py-6">
        {/* Job List */}
        <div className="col-span-2 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
          {jobs.length === 0 ? (
            <div className="text-center text-gray-400 py-10">No jobs found</div>
          ) : (
            jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSelected={selectedJob?.id === job.id}
                onClick={() => setSelectedJob(job)}
              />
            ))
          )}
        </div>

        {/* Job Details */}
        <div className="col-span-3">
          {selectedJob ? (
            <JobDetails job={selectedJob} />
          ) : (
            <div className="border rounded-lg p-6 text-center text-gray-400">
              Select a job to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
