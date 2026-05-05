import React, { useMemo, useState } from "react";
import {
  FiUsers,
  FiInbox,
  FiChevronDown,
  FiUploadCloud,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import GradientCard from "../../components/ui/GradientCard";

const SEED = [
  {
    id: "CAP-1042",
    teamName: "ByteBenders",
    members: ["Aarav Mehta", "Diya Patel", "Kabir Singh", "Ishita Rao"],
    project: "AI-powered Resume Screener",
    status: "in-progress",
    mentor: "Praful Bhoyar",
    summary: "Building a transformer-based resume parser that scores candidates against a JD and explains the match.",
  },
  {
    id: "CAP-1041",
    teamName: "Pixel Pioneers",
    members: ["Reyansh Iyer", "Vihaan Joshi", "Anvi Reddy"],
    project: "Real-time Collaborative Whiteboard",
    status: "submitted",
    mentor: "Anand Rao",
    summary: "WebRTC-based whiteboard with shape recognition and live cursors. Submitted to mentor for review.",
  },
  {
    id: "CAP-1040",
    teamName: "Logic Lions",
    members: ["Saanvi Bose", "Mihir Kapoor", "Pari Shah", "Rudra Das"],
    project: "Smart Attendance via Face Recognition",
    status: "approved",
    mentor: "Sneha Iyer",
    summary: "On-device face recognition that marks attendance and flags anomalies. Approved with distinction.",
  },
  {
    id: "CAP-1039",
    teamName: "Data Dragons",
    members: ["Tanvi Khan", "Veer Malhotra", "Diya Patel"],
    project: "Stock Sentiment Tracker",
    status: "in-progress",
    mentor: "Vikram Joshi",
    summary: "Pulls news headlines, scores sentiment, and overlays it on stock charts to spot signals.",
  },
  {
    id: "CAP-1038",
    teamName: "Cloud Catalysts",
    members: ["Arjun Nair", "Aanya Verma"],
    project: "Serverless Cost Visualizer",
    status: "submitted",
    mentor: "Praful Bhoyar",
    summary: "Imports AWS cost reports and visualizes service-by-service spend with optimization suggestions.",
  },
];

const statusConfig = {
  "in-progress": { label: "In Progress", className: "text-blue-700 bg-blue-50 border-blue-100",   dot: "bg-blue-500" },
  submitted:     { label: "Submitted",   className: "text-amber-700 bg-amber-50 border-amber-100", dot: "bg-amber-500" },
  approved:      { label: "Approved",    className: "text-green-700 bg-green-50 border-green-100", dot: "bg-green-500" },
};

const initials = (name) =>
  name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

const STATUS_FILTERS = ["all", "in-progress", "submitted", "approved"];

const TeamRow = ({ team }) => {
  const [open, setOpen] = useState(false);
  const cfg = statusConfig[team.status] || statusConfig["in-progress"];

  return (
    <>
      <tr onClick={() => setOpen((o) => !o)} className="cursor-pointer hover:bg-purple-50/40 transition-colors">
        <td className="px-6 py-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white">
              <FiUsers className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{team.teamName}</p>
              <p className="text-xs text-gray-500">{team.id}</p>
            </div>
          </div>
        </td>
        <td className="px-6 py-3">
          <div className="flex -space-x-2">
            {team.members.slice(0, 3).map((m) => (
              <div
                key={m}
                title={m}
                className="w-7 h-7 rounded-full ring-2 ring-white bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-bold text-[10px]"
              >
                {initials(m)}
              </div>
            ))}
            {team.members.length > 3 && (
              <div className="w-7 h-7 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-[10px]">
                +{team.members.length - 3}
              </div>
            )}
          </div>
        </td>
        <td className="px-6 py-3">
          <p className="text-sm font-semibold text-gray-900 max-w-md truncate">{team.project}</p>
        </td>
        <td className="px-6 py-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${cfg.className}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
        </td>
        <td className="px-6 py-3 text-sm text-gray-700">{team.mentor}</td>
        <td className="px-6 py-3 text-right">
          <FiChevronDown className={`w-4 h-4 text-gray-400 inline-block transition-transform ${open ? "rotate-180" : ""}`} />
        </td>
      </tr>
      {open && (
        <tr className="bg-gray-50/60">
          <td colSpan={6} className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">Project Summary</p>
                <p className="text-sm text-gray-700 mt-1 leading-relaxed">{team.summary}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">Team Members</p>
                <ul className="mt-1 space-y-1">
                  {team.members.map((m) => (
                    <li key={m} className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-bold text-[9px]">
                        {initials(m)}
                      </span>
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const CapstoneProjectPage = () => {
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(
    () => SEED.filter((t) => filter === "all" || t.status === filter),
    [filter]
  );

  const stats = useMemo(() => {
    const total = SEED.length;
    const submitted = SEED.filter((t) => t.status === "submitted" || t.status === "approved").length;
    const approved = SEED.filter((t) => t.status === "approved").length;
    const pendingReview = SEED.filter((t) => t.status === "submitted").length;
    return { total, submitted, approved, pendingReview };
  }, []);

  return (
    <div className="w-full bg-slate-50 min-h-full">
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-semibold text-gray-900">Capstone Projects</h1>
          <p className="text-sm text-gray-600 mt-1">Team status, mentors, and project submissions</p>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-6 space-y-5">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GradientCard icon={FiUsers}       label="Total Teams"        value={stats.total}         color="blue" />
          <GradientCard icon={FiUploadCloud} label="Submitted Projects" value={stats.submitted}     color="purple" />
          <GradientCard icon={FiCheckCircle} label="Approved Projects"  value={stats.approved}      color="green" />
          <GradientCard icon={FiClock}       label="Pending Reviews"    value={stats.pendingReview} color="orange" />
        </section>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map((s) => {
                const active = filter === s;
                const label = s === "all" ? "All" : statusConfig[s]?.label || s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFilter(s)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200 ${
                      active
                        ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:text-purple-700"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-500">{filtered.length} teams</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px]">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Team</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Members</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Project</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Mentor</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12">
                      <div className="text-center">
                        <div className="inline-flex p-3 rounded-2xl bg-gray-100 text-gray-400 mb-3">
                          <FiInbox className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">No teams in this filter</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((t) => <TeamRow key={t.id} team={t} />)
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CapstoneProjectPage;
