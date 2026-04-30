import React, { useMemo, useState } from "react";
import {
  FiBookOpen,
  FiInbox,
  FiCheckCircle,
  FiPercent,
  FiPlayCircle,
} from "react-icons/fi";
import GradientCard from "../../components/ui/GradientCard";

const SEED = [
  { id: "M-01", batch: "AC-2025",  module: "Python Fundamentals",     topics: 12, completedTopics: 12, completion: 100, status: "completed" },
  { id: "M-02", batch: "AC-2025",  module: "Object-Oriented Python",  topics: 10, completedTopics: 8,  completion: 80,  status: "ongoing" },
  { id: "M-03", batch: "AC-2025",  module: "Data Structures",         topics: 14, completedTopics: 9,  completion: 64,  status: "ongoing" },
  { id: "M-04", batch: "CU4FO-25", module: "Web Development Basics",  topics: 8,  completedTopics: 8,  completion: 100, status: "completed" },
  { id: "M-05", batch: "CU4FO-25", module: "React + TypeScript",      topics: 12, completedTopics: 7,  completion: 58,  status: "ongoing" },
  { id: "M-06", batch: "VAC-25",   module: "Aptitude & Reasoning",    topics: 10, completedTopics: 4,  completion: 40,  status: "ongoing" },
  { id: "M-07", batch: "AC-2026",  module: "Python Fundamentals",     topics: 12, completedTopics: 3,  completion: 25,  status: "ongoing" },
  { id: "M-08", batch: "AC-2024",  module: "Capstone Wrap-up",        topics: 6,  completedTopics: 6,  completion: 100, status: "completed" },
];

const statusConfig = {
  completed: { label: "Completed", className: "text-green-700 bg-green-50 border-green-100", dot: "bg-green-500" },
  ongoing:   { label: "Ongoing",   className: "text-blue-700 bg-blue-50 border-blue-100",    dot: "bg-blue-500" },
};

const barColor = (pct) => {
  if (pct >= 100) return "bg-green-500";
  if (pct >= 50) return "bg-blue-500";
  return "bg-amber-500";
};

const selectClass =
  "px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 cursor-pointer";

const ModuleTrackerPage = () => {
  const [batch, setBatch] = useState("all");
  const [status, setStatus] = useState("all");

  const batches = useMemo(() => Array.from(new Set(SEED.map((m) => m.batch))).sort(), []);

  const filtered = useMemo(
    () =>
      SEED.filter(
        (m) =>
          (batch === "all" || m.batch === batch) &&
          (status === "all" || m.status === status)
      ),
    [batch, status]
  );

  const stats = useMemo(() => {
    const total = SEED.length;
    const completed = SEED.filter((m) => m.status === "completed").length;
    const ongoing = SEED.filter((m) => m.status === "ongoing").length;
    const avgCompletion = total
      ? Math.round(SEED.reduce((acc, m) => acc + m.completion, 0) / total)
      : 0;
    return { total, completed, ongoing, avgCompletion };
  }, []);

  return (
    <div className="w-full bg-slate-50 min-h-full">
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-semibold text-gray-900">Module Tracker</h1>
          <p className="text-sm text-gray-600 mt-1">Per-batch module completion and progress</p>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-6 space-y-5">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GradientCard icon={FiBookOpen}    label="Total Modules"    value={stats.total}     color="blue" />
          <GradientCard icon={FiCheckCircle} label="Completed"        value={stats.completed} color="green" />
          <GradientCard icon={FiPercent}     label="Avg Completion"   value={`${stats.avgCompletion}%`} progress={stats.avgCompletion} color="purple" />
          <GradientCard icon={FiPlayCircle}  label="Active Modules"   value={stats.ongoing}   color="orange" />
        </section>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Batch</label>
              <select value={batch} onChange={(e) => setBatch(e.target.value)} className={selectClass}>
                <option value="all">All Batches</option>
                {batches.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
                <option value="all">All</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="flex-1" />
            <p className="text-xs text-gray-500">{filtered.length} modules</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Module</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Batch</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Topics</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[280px]">Progress</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12">
                      <div className="text-center">
                        <div className="inline-flex p-3 rounded-2xl bg-gray-100 text-gray-400 mb-3">
                          <FiInbox className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">No modules in this filter</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((m) => {
                    const cfg = statusConfig[m.status] || statusConfig.ongoing;
                    return (
                      <tr key={m.id} className="hover:bg-purple-50/40 transition-colors">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                              <FiBookOpen className="w-4 h-4" />
                            </div>
                            <p className="text-sm font-semibold text-gray-900">{m.module}</p>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <span className="inline-flex px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-mono font-semibold">{m.batch}</span>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-700">{m.completedTopics} / {m.topics}</td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className={`h-full ${barColor(m.completion)} rounded-full transition-all duration-500`} style={{ width: `${m.completion}%` }} />
                            </div>
                            <span className="text-sm font-bold text-gray-900 min-w-[44px] text-right">{m.completion}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${cfg.className}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleTrackerPage;
