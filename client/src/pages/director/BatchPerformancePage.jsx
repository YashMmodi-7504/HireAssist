import React, { useMemo, useState } from "react";
import { FiSearch, FiInbox } from "react-icons/fi";

const SEED = [
  { id: "B-1042", name: "Code Unnati - Cohort 7",  course: "Code Unnati",          trainer: "Praful Bhoyar",  startDate: "2025-08-15", students: 28, completion: 72, avgScore: 82, attendance: 91 },
  { id: "B-1041", name: "Web Dev Sprint 25",       course: "Web Development",      trainer: "Sneha Iyer",     startDate: "2025-08-01", students: 24, completion: 65, avgScore: 78, attendance: 88 },
  { id: "B-1040", name: "DSA Fundamentals 2025",   course: "Data Structures",      trainer: "Vikram Joshi",   startDate: "2025-07-10", students: 22, completion: 88, avgScore: 84, attendance: 92 },
  { id: "B-1039", name: "ML Foundations Batch 3",  course: "Machine Learning",     trainer: "Praful Bhoyar",  startDate: "2025-09-10", students: 18, completion: 45, avgScore: 76, attendance: 84 },
  { id: "B-1038", name: "Deep Learning Pilot",     course: "Deep Learning",        trainer: "Sneha Iyer",     startDate: "2026-01-15", students: 14, completion: 22, avgScore: 71, attendance: 86 },
  { id: "B-1037", name: "Aptitude Sprint Spring",  course: "Aptitude & Reasoning", trainer: "Vikram Joshi",   startDate: "2024-08-01", students: 32, completion: 100, avgScore: 81, attendance: 89 },
  { id: "B-1036", name: "Capstone Cohort B",       course: "Web Development",      trainer: "Praful Bhoyar",  startDate: "2024-09-05", students: 12, completion: 100, avgScore: 88, attendance: 94 },
  { id: "B-1035", name: "Python Bootcamp 2026",    course: "Python Fundamentals",  trainer: "Sneha Iyer",     startDate: "2026-02-01", students: 30, completion: 14, avgScore: 70, attendance: 90 },
];

const selectClass =
  "px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 cursor-pointer";

const barColor = (pct) => {
  if (pct >= 85) return "bg-emerald-500";
  if (pct >= 70) return "bg-purple-500";
  if (pct >= 50) return "bg-blue-500";
  return "bg-amber-500";
};

const dateRangeFilter = (dateString, range) => {
  if (range === "all") return true;
  const date = new Date(dateString);
  const now = new Date();
  const monthsAgo = (now - date) / (1000 * 60 * 60 * 24 * 30);
  if (range === "last3") return monthsAgo <= 3;
  if (range === "last6") return monthsAgo <= 6;
  if (range === "last12") return monthsAgo <= 12;
  return true;
};

const BatchPerformancePage = () => {
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("all");
  const [range, setRange] = useState("all");

  const courses = useMemo(() => Array.from(new Set(SEED.map((b) => b.course))).sort(), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return SEED.filter((b) => {
      const matchesSearch =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.trainer.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q);
      const matchesCourse = course === "all" || b.course === course;
      const matchesDate = dateRangeFilter(b.startDate, range);
      return matchesSearch && matchesCourse && matchesDate;
    });
  }, [search, course, range]);

  const handleReset = () => {
    setSearch("");
    setCourse("all");
    setRange("all");
  };

  return (
    <div className="w-full bg-slate-50 min-h-full">
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-semibold text-gray-900">Batch Performance</h1>
          <p className="text-sm text-gray-600 mt-1">Per-batch completion, scores, and attendance</p>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-6 space-y-5">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by batch, trainer, or id…"
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-transparent rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white focus:border-gray-200 transition-all duration-200"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <select value={course} onChange={(e) => setCourse(e.target.value)} className={selectClass}>
                <option value="all">All Courses</option>
                {courses.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={range} onChange={(e) => setRange(e.target.value)} className={selectClass}>
                <option value="all">All Time</option>
                <option value="last3">Last 3 months</option>
                <option value="last6">Last 6 months</option>
                <option value="last12">Last 12 months</option>
              </select>
              <button type="button" onClick={handleReset}
                className="px-3 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors">
                Reset
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">{filtered.length} of {SEED.length} batches</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px]">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Batch</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Course</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Trainer</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[200px]">Completion</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Avg Score</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Attendance</th>
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
                        <p className="text-sm font-medium text-gray-900">No batches match your filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((b) => (
                    <tr key={b.id} className="hover:bg-purple-50/40 transition-colors">
                      <td className="px-6 py-3">
                        <p className="text-sm font-semibold text-gray-900">{b.name}</p>
                        <p className="text-xs text-gray-500">{b.id} · {b.students} students</p>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-700">{b.course}</td>
                      <td className="px-6 py-3 text-sm text-gray-700">{b.trainer}</td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full ${barColor(b.completion)} rounded-full`} style={{ width: `${b.completion}%` }} />
                          </div>
                          <span className="text-xs font-bold text-gray-700 min-w-[36px] text-right">{b.completion}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-3"><span className="text-sm font-bold text-gray-900">{b.avgScore}</span></td>
                      <td className="px-6 py-3"><span className="text-sm font-bold text-gray-700">{b.attendance}%</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchPerformancePage;
