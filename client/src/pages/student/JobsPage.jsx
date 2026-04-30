import React, { useEffect, useMemo, useState } from "react";
import { FiInbox } from "react-icons/fi";

import JobCard from "../../components/Jobs/JobCard";
import JobCardSkeleton from "../../components/Jobs/JobCardSkeleton";
import JobFilters from "../../components/Jobs/JobFilters";

const JOBS = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "Ishan Tech",
    location: "Ahmedabad",
    type: "Internship",
    eligibility: "BTech / CSE",
    stipend: "₹10K – ₹18K stipend",
    skills: ["React", "JavaScript", "Tailwind", "HTML", "CSS"],
    status: "open",
    postedAgo: "2 days ago",
    description:
      "Work alongside a fast-moving product team on real customer-facing UI features. 6-month engagement with a return offer for top performers.",
  },
  {
    id: 2,
    title: "Support Executive Technical",
    company: "Ishan Tech",
    location: "Ahmedabad",
    type: "Full-time",
    eligibility: "BTech / Any",
    stipend: "₹3.6L – ₹4.8L per year",
    skills: ["Communication", "Problem Solving", "SQL"],
    status: "open",
    postedAgo: "5 days ago",
    description:
      "Be the first line of technical support for enterprise customers. Triage issues, reproduce bugs, and partner with engineering on resolutions.",
  },
  {
    id: 3,
    title: "Data Analyst Intern",
    company: "Brightline Analytics",
    location: "Bengaluru",
    type: "Internship",
    eligibility: "BTech / B.Sc",
    stipend: "₹15K – ₹25K stipend",
    skills: ["Python", "SQL", "Pandas", "Power BI"],
    status: "open",
    postedAgo: "1 week ago",
    description:
      "Build dashboards and self-serve reports for the growth team. Collaborate with PMs on funnel and retention deep dives.",
  },
  {
    id: 4,
    title: "ML Engineer (Junior)",
    company: "NeuroStack AI",
    location: "Remote",
    type: "Full-time",
    eligibility: "BTech / MCA",
    stipend: "₹8L – ₹12L per year",
    skills: ["Python", "PyTorch", "Scikit-learn", "MLOps"],
    status: "open",
    postedAgo: "3 days ago",
    description:
      "Join the model training group working on production CV pipelines. Strong fundamentals in deep learning and clean Python expected.",
  },
  {
    id: 5,
    title: "Backend Engineer Intern",
    company: "Foliyo Labs",
    location: "Pune",
    type: "Internship",
    eligibility: "BTech / CSE / IT",
    stipend: "₹12K – ₹20K stipend",
    skills: ["Node.js", "Express", "MongoDB", "REST"],
    status: "closed",
    postedAgo: "2 weeks ago",
    description:
      "Hands-on work on a multi-tenant SaaS API. Position closed for this cycle — keep an eye out for the next intake.",
  },
  {
    id: 6,
    title: "UI/UX Design Intern",
    company: "Pixel & Co",
    location: "Remote",
    type: "Contract",
    eligibility: "Any UG with portfolio",
    stipend: "₹20K – ₹30K stipend",
    skills: ["Figma", "Prototyping", "User Research"],
    status: "open",
    postedAgo: "today",
    description:
      "Own the redesign of a product workflow end-to-end. Tight collaboration with one PM and one engineer.",
  },
];

const JobsPage = () => {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const locations = useMemo(
    () => Array.from(new Set(JOBS.map((j) => j.location))).sort(),
    []
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return JOBS.filter((j) => {
      const matchesSearch =
        !q ||
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        (j.skills || []).some((s) => s.toLowerCase().includes(q));
      const matchesLocation =
        selectedLocation === "all" || j.location === selectedLocation;
      const matchesType = selectedType === "all" || j.type === selectedType;
      return matchesSearch && matchesLocation && matchesType;
    });
  }, [search, selectedLocation, selectedType]);

  const handleReset = () => {
    setSearch("");
    setSelectedLocation("all");
    setSelectedType("all");
  };

  const handleApply = (job) => {
    console.log("[jobs] apply ->", job.title);
  };

  const handleDownload = (job) => {
    console.log("[jobs] download JD ->", job.title);
  };

  const countLabel = loading
    ? "Loading opportunities…"
    : `${filtered.length} ${filtered.length === 1 ? "opportunity" : "opportunities"}`;

  return (
    <div className="w-full bg-slate-50 min-h-full">
      {/* Header band */}
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Apply Jobs / Internships
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Explore and apply to curated opportunities
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="w-full px-6 lg:px-8 py-8 space-y-6">
        <JobFilters
          search={search}
          onSearch={setSearch}
          locations={locations}
          selectedLocation={selectedLocation}
          onLocationChange={setSelectedLocation}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          onReset={handleReset}
        />

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{countLabel}</h2>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center">
            <div className="inline-flex p-3 rounded-2xl bg-purple-50 text-purple-600 mb-3">
              <FiInbox className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-gray-900">
              No opportunities available right now
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Try adjusting your filters or check back later
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="mt-4 inline-flex px-4 py-2 text-sm font-semibold text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApply={handleApply}
                onDownload={handleDownload}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
