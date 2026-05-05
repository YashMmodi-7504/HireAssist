import React from "react";
import {
  FiUsers,
  FiLayers,
  FiUserCheck,
  FiBriefcase,
  FiTrendingUp,
} from "react-icons/fi";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import GradientCard from "../../components/ui/GradientCard";

const STUDENT_GROWTH = [
  { month: "Aug", students: 180 },
  { month: "Sep", students: 198 },
  { month: "Oct", students: 220 },
  { month: "Nov", students: 235 },
  { month: "Dec", students: 244 },
  { month: "Jan", students: 268 },
];

const PLACEMENT_TREND = [
  { phase: "P1", placed: 24 },
  { phase: "P2", placed: 38 },
  { phase: "P3", placed: 55 },
  { phase: "P4", placed: 71 },
  { phase: "P5", placed: 84 },
];

const ATTENDANCE_OVERVIEW = [
  { week: "W1", attendance: 88 },
  { week: "W2", attendance: 91 },
  { week: "W3", attendance: 89 },
  { week: "W4", attendance: 93 },
  { week: "W5", attendance: 90 },
  { week: "W6", attendance: 92 },
  { week: "W7", attendance: 94 },
  { week: "W8", attendance: 91 },
];

const TOP_BATCHES = [
  { code: "AC-2025",  college: "VIT",   students: 24, attendance: 94, placement: 88, score: 92 },
  { code: "CU4FO-25", college: "BITS",  students: 28, attendance: 90, placement: 84, score: 89 },
  { code: "AC-2024",  college: "BITS",  students: 22, attendance: 92, placement: 91, score: 88 },
  { code: "AC-2026",  college: "NIT-T", students: 30, attendance: 92, placement: 70, score: 86 },
  { code: "VAC-25",   college: "IIT-D", students: 18, attendance: 76, placement: 65, score: 81 },
];

const tooltipStyle = {
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  fontSize: 12,
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
};

const DirectorDashboard = () => {
  return (
    <div className="w-full bg-slate-50 min-h-full">
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8">
          <h1 className="text-2xl md:text-3xl font-semibold leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Director Overview
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            High-level snapshot across batches, trainers, attendance, and placement
          </p>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-6 space-y-6">
        {/* KPIs */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <GradientCard icon={FiUsers}     label="Total Students"  value="268" color="blue"   trend="+24" />
          <GradientCard icon={FiLayers}    label="Active Batches"  value="14"  color="purple" trend="+2" />
          <GradientCard icon={FiUserCheck} label="Avg Completion"  value="62%" progress={62} color="green" trend="+8%" />
          <GradientCard icon={FiBriefcase} label="Placement"       value="84%" progress={84} color="orange" trend="+6%" />
        </section>

        {/* Charts row 1: Student Growth (line) + Placement Trend (bar) */}
        <section className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-7 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Student Growth</h3>
                <p className="text-xs text-gray-500 mt-0.5">Total enrolled, last 6 months</p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded">
                <FiTrendingUp className="w-3 h-3" />
                +49% YoY
              </span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={STUDENT_GROWTH} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "#e9d5ff", strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="students" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 4, fill: "#7c3aed", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-gray-900">Placement Trend</h3>
              <p className="text-xs text-gray-500 mt-0.5">Students placed by phase</p>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={PLACEMENT_TREND} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="phase" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f5f3ff" }} formatter={(v) => [v, "Placed"]} />
                  <Bar dataKey="placed" fill="#7c3aed" radius={[6, 6, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Attendance overview (area) */}
        <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-gray-900">Attendance Overview</h3>
            <p className="text-xs text-gray-500 mt-0.5">8-week rolling weighted average across all batches</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ATTENDANCE_OVERVIEW} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="attFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, "Attendance"]} />
                <Area type="monotone" dataKey="attendance" stroke="#7c3aed" strokeWidth={2.5} fill="url(#attFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Top performing batches table */}
        <section className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Batches</h3>
            <p className="text-xs text-gray-500 mt-0.5">Ranked by composite score (attendance + placement + assessment)</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Batch</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">College</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Students</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Attendance</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Placement</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {TOP_BATCHES.map((b, i) => (
                  <tr key={b.code} className="hover:bg-purple-50/40 transition-colors">
                    <td className="px-6 py-3">
                      <span className={`inline-flex w-6 h-6 rounded-full items-center justify-center text-xs font-bold ${
                        i === 0 ? "bg-amber-100 text-amber-700" :
                        i === 1 ? "bg-gray-200 text-gray-700" :
                        i === 2 ? "bg-orange-100 text-orange-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-flex px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-mono font-semibold">{b.code}</span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">{b.college}</td>
                    <td className="px-6 py-3 text-sm font-semibold text-gray-900">{b.students}</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{b.attendance}%</td>
                    <td className="px-6 py-3 text-sm text-gray-700">{b.placement}%</td>
                    <td className="px-6 py-3"><span className="text-sm font-bold text-purple-700">{b.score}</span></td>
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

export default DirectorDashboard;
