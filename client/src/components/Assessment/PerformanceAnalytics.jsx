import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

const scoreColor = (v) => {
  if (v >= 85) return "#10b981";
  if (v >= 70) return "#7c3aed";
  if (v >= 50) return "#3b82f6";
  return "#f59e0b";
};

const subjectBarColor = (v) => {
  if (v >= 85) return "bg-green-500";
  if (v >= 70) return "bg-purple-500";
  if (v >= 50) return "bg-blue-500";
  return "bg-amber-500";
};

const PerformanceAnalytics = ({ scoreHistory = [], subjectPerformance = [] }) => {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Score History */}
      <div className="col-span-12 lg:col-span-8 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-gray-900">Score History</h3>
          <p className="text-xs text-gray-500 mt-0.5">Your most recent assessment results</p>
        </div>
        <div className="h-64">
          {scoreHistory.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm text-gray-500">Complete a test to see your scores here</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={scoreHistory}
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid stroke="#f3f4f6" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    fontSize: 12,
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                  }}
                  cursor={{ fill: "#f5f3ff" }}
                  formatter={(value) => [`${value}%`, "Score"]}
                />
                <Bar dataKey="score" radius={[6, 6, 0, 0]} maxBarSize={36}>
                  {scoreHistory.map((entry, i) => (
                    <Cell key={i} fill={scoreColor(entry.score)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Subject-wise Performance */}
      <div className="col-span-12 lg:col-span-4 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-gray-900">By Subject</h3>
          <p className="text-xs text-gray-500 mt-0.5">Average score per subject</p>
        </div>
        <div className="space-y-4">
          {subjectPerformance.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">No data yet</p>
          ) : (
            subjectPerformance.map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {s.name}
                  </span>
                  <span className="text-xs font-semibold text-gray-500 flex-shrink-0 ml-2">
                    {s.value}%
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${subjectBarColor(s.value)} rounded-full transition-all duration-500`}
                    style={{ width: `${s.value}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalytics;
