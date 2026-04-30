import React, { useMemo, useState } from "react";
import {
  FiUsers,
  FiCheckCircle,
  FiTrendingDown,
  FiAward,
} from "react-icons/fi";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import GradientCard from "../../components/ui/GradientCard";

const PROGRESS_DISTRIBUTION = [
  { name: "Completed",   value: 154, color: "#10b981" },
  { name: "In Progress", value: 78,  color: "#7c3aed" },
  { name: "Not Started", value: 36,  color: "#e5e7eb" },
];

const MONTHLY_PROGRESS = [
  { month: "Aug", completion: 42 },
  { month: "Sep", completion: 48 },
  { month: "Oct", completion: 54 },
  { month: "Nov", completion: 59 },
  { month: "Dec", completion: 64 },
  { month: "Jan", completion: 71 },
];

const DROPOUT_BY_BATCH = [
  { batch: "AC-2025",  dropouts: 1 },
  { batch: "CU4FO-25", dropouts: 2 },
  { batch: "VAC-25",   dropouts: 4 },
  { batch: "AC-2026",  dropouts: 1 },
  { batch: "CU4FO-26", dropouts: 3 },
];

const TOP_PERFORMERS = [
  { id: "S-1042", name: "Aarav Mehta",   batch: "AC-2025",   completion: 96, score: 94, course: "Code Unnati" },
  { id: "S-1041", name: "Diya Patel",    batch: "AC-2025",   completion: 94, score: 92, course: "Code Unnati" },
  { id: "S-1038", name: "Reyansh Iyer",  batch: "CU4FO-26",  completion: 92, score: 91, course: "Web Development" },
  { id: "S-1035", name: "Anvi Reddy",    batch: "CU4FO-25",  completion: 90, score: 89, course: "Web Development" },
  { id: "S-1029", name: "Rudra Das",     batch: "AC-2025",   completion: 88, score: 90, course: "Code Unnati" },
  { id: "S-1033", name: "Saanvi Bose",   batch: "VAC-25",    completion: 86, score: 87, course: "Aptitude" },
  { id: "S-1039", name: "Ishita Rao",    batch: "AC-2026",   completion: 84, score: 88, course: "Code Unnati" },
];

const ALL_BATCHES = ["AC-2025", "CU4FO-25", "VAC-25", "AC-2026", "CU4FO-26"];
const ALL_COURSES = ["Code Unnati", "Web Development", "Aptitude", "Machine Learning", "DSA"];

const tooltipStyle = {
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  fontSize: 12,
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
};

const initials = (name) =>
  name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();

const selectClass =
  "px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200 cursor-pointer";

const StudentInsightsPage = () => {
  const [batch, setBatch] = useState("all");
  const [course, setCourse] = useState("all");
  const [range, setRange] = useState("last6");

  const filteredPerformers = useMemo(() => {
    return TOP_PERFORMERS.filter(
      (p) =>
        (batch === "all" || p.batch === batch) &&
        (course === "all" || p.course === course)
    );
  }, [batch, course]);

  // KPIs
  const totalStudents = PROGRESS_DISTRIBUTION.reduce((acc, p) => acc + p.value, 0);
  const completed = PROGRESS_DISTRIBUTION.find((p) => p.name === "Completed")?.value || 0;
  const avgCompletion = Math.round((completed / totalStudents) * 100);
  const totalDropouts = DROPOUT_BY_BATCH.reduce((acc, b) => acc + b.dropouts, 0);
  const dropoutRate = Math.round((totalDropouts / totalStudents) * 100);
  const topPerformersPct = Math.round((TOP_PERFORMERS.length / totalStudents) * 100);

  return (
    <div className="w-full bg-slate-50 min-h-full">
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-semibold text-gray-900">Student Insights</h1>
          <p className="text-sm text-gray-600 mt-1">
            Progress shape, dropout patterns, and the top performers across the platform
          </p>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-6 space-y-6">
        {/* KPIs */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GradientCard icon={FiUsers}         label="Total Students"  value={totalStudents}        color="blue" />
          <GradientCard icon={FiCheckCircle}   label="Avg Completion"  value={`${avgCompletion}%`}  progress={avgCompletion} color="green" />
          <GradientCard icon={FiTrendingDown}  label="Dropout Rate"    value={`${dropoutRate}%`}    color="red" />
          <GradientCard icon={FiAward}         label="Top Performers"  value={`${topPerformersPct}%`} sublabel="≥ 85% complete" color="orange" />
        </section>

        {/* Filters */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Batch</label>
              <select value={batch} onChange={(e) => setBatch(e.target.value)} className={selectClass}>
                <option value="all">All Batches</option>
                {ALL_BATCHES.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Course</label>
              <select value={course} onChange={(e) => setCourse(e.target.value)} className={selectClass}>
                <option value="all">All Courses</option>
                {ALL_COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">Date Range</label>
              <select value={range} onChange={(e) => setRange(e.target.value)} className={selectClass}>
                <option value="last3">Last 3 months</option>
                <option value="last6">Last 6 months</option>
                <option value="last12">Last 12 months</option>
                <option value="all">All time</option>
              </select>
            </div>
            <div className="flex-1" />
            <button
              type="button"
              onClick={() => { setBatch("all"); setCourse("all"); setRange("last6"); }}
              className="px-3 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Charts row */}
        <section className="grid grid-cols-12 gap-6">
          {/* Progress Distribution pie */}
          <div className="col-span-12 lg:col-span-4 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-gray-900">Progress Distribution</h3>
              <p className="text-xs text-gray-500 mt-0.5">Across all students</p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={PROGRESS_DISTRIBUTION} cx="50%" cy="50%" innerRadius={50} outerRadius={88} paddingAngle={2} dataKey="value">
                    {PROGRESS_DISTRIBUTION.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Progress Trend line */}
          <div className="col-span-12 lg:col-span-8 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Monthly Progress Trend</h3>
                <p className="text-xs text-gray-500 mt-0.5">Avg completion % across all enrolments</p>
              </div>
              <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded">
                +29% vs last 6m
              </span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MONTHLY_PROGRESS} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, "Completion"]} />
                  <Line type="monotone" dataKey="completion" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 4, fill: "#7c3aed", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Dropout by batch bar */}
        <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-gray-900">Dropout Analysis</h3>
            <p className="text-xs text-gray-500 mt-0.5">Number of dropouts per active batch</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DROPOUT_BY_BATCH} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="batch" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#fef2f2" }} formatter={(v) => [v, "Dropouts"]} />
                <Bar dataKey="dropouts" fill="#ef4444" radius={[6, 6, 0, 0]} maxBarSize={56} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Top performers table */}
        <section className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Top Performers</h3>
              <p className="text-xs text-gray-500 mt-0.5">Students with highest completion + score</p>
            </div>
            <span className="text-xs text-gray-500">{filteredPerformers.length} shown</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Batch</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider w-[260px]">Completion</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Avg Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPerformers.map((p) => (
                  <tr key={p.id} className="hover:bg-purple-50/40 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          {initials(p.name)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                          <p className="text-xs text-gray-500 font-mono">{p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-flex px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-mono font-semibold">{p.batch}</span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${p.completion}%` }} />
                        </div>
                        <span className="text-xs font-bold text-gray-700 min-w-[36px] text-right">{p.completion}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm font-bold text-gray-900">{p.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StudentInsightsPage;
