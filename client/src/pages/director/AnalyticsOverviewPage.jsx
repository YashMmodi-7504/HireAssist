import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const COMPLETION_DISTRIBUTION = [
  { name: "Completed",   value: 62, color: "#10b981" },
  { name: "In Progress", value: 28, color: "#7c3aed" },
  { name: "Not Started", value: 10, color: "#e5e7eb" },
];

const BATCH_COMPARISON = [
  { batch: "AC-2025",  completion: 88, attendance: 94, placement: 88 },
  { batch: "CU4FO-25", completion: 80, attendance: 90, placement: 84 },
  { batch: "AC-2024",  completion: 95, attendance: 92, placement: 91 },
  { batch: "AC-2026",  completion: 56, attendance: 92, placement: 70 },
  { batch: "VAC-25",   completion: 72, attendance: 76, placement: 65 },
];

// Attendance heatmap: 5 batches × 8 weeks
const ATTENDANCE_GRID = [
  { batch: "AC-2025",  weeks: [92, 88, 94, 91, 95, 90, 93, 96] },
  { batch: "CU4FO-25", weeks: [85, 88, 89, 87, 90, 92, 91, 89] },
  { batch: "AC-2024",  weeks: [90, 92, 94, 91, 95, 96, 94, 92] },
  { batch: "AC-2026",  weeks: [88, 86, 90, 89, 91, 93, 92, 91] },
  { batch: "VAC-25",   weeks: [70, 74, 72, 78, 76, 80, 75, 77] },
];

const tooltipStyle = {
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  fontSize: 12,
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
};

const heatColor = (pct) => {
  if (pct >= 92) return "bg-emerald-500/85 text-white";
  if (pct >= 85) return "bg-emerald-400/70 text-white";
  if (pct >= 78) return "bg-amber-300/85 text-amber-900";
  if (pct >= 70) return "bg-orange-300/85 text-orange-900";
  return "bg-red-300/85 text-red-900";
};

const AnalyticsOverviewPage = () => {
  return (
    <div className="w-full bg-slate-50 min-h-full">
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-semibold text-gray-900">Analytics Overview</h1>
          <p className="text-sm text-gray-600 mt-1">
            Cross-batch trends, completion shape, and attendance health
          </p>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-6 space-y-6">
        {/* Course completion + Batch comparison */}
        <section className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-5 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-gray-900">Course Completion</h3>
              <p className="text-xs text-gray-500 mt-0.5">Across all enrolments</p>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={COMPLETION_DISTRIBUTION} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                    {COMPLETION_DISTRIBUTION.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => [`${v}%`, ""]} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-7 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-gray-900">Batch Comparison</h3>
              <p className="text-xs text-gray-500 mt-0.5">Completion · Attendance · Placement (%)</p>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={BATCH_COMPARISON} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="batch" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f5f3ff" }} formatter={(v) => [`${v}%`, ""]} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="completion" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="attendance" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="placement"  fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Attendance heatmap */}
        <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-gray-900">Attendance Heatmap</h3>
            <p className="text-xs text-gray-500 mt-0.5">Weekly attendance % per active batch (last 8 weeks)</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr>
                  <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">Batch</th>
                  {ATTENDANCE_GRID[0].weeks.map((_, i) => (
                    <th key={i} className="text-center text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-2 py-2">
                      W{i + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ATTENDANCE_GRID.map((row) => (
                  <tr key={row.batch}>
                    <td className="px-3 py-2 text-sm font-semibold text-gray-900 whitespace-nowrap">
                      <span className="inline-flex px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-mono">{row.batch}</span>
                    </td>
                    {row.weeks.map((pct, i) => (
                      <td key={i} className="px-1.5 py-1.5 text-center">
                        <span
                          className={`inline-flex w-12 h-9 items-center justify-center rounded-md text-[11px] font-bold ${heatColor(pct)}`}
                          title={`${row.batch} · W${i + 1}: ${pct}%`}
                        >
                          {pct}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-3 mt-5 text-[11px] text-gray-500">
            <span>Cooler</span>
            <span className="inline-flex w-6 h-3 rounded-sm bg-red-300/85" />
            <span className="inline-flex w-6 h-3 rounded-sm bg-orange-300/85" />
            <span className="inline-flex w-6 h-3 rounded-sm bg-amber-300/85" />
            <span className="inline-flex w-6 h-3 rounded-sm bg-emerald-400/70" />
            <span className="inline-flex w-6 h-3 rounded-sm bg-emerald-500/85" />
            <span>Hotter</span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AnalyticsOverviewPage;
