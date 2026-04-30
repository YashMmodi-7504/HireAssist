import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

const subjectBarColor = (v) => {
  if (v >= 85) return "#10b981";
  if (v >= 75) return "#f59e0b";
  return "#ef4444";
};

const tooltipStyle = {
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  fontSize: 12,
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
};

const AttendanceCharts = ({ monthlyData = [], subjectData = [] }) => {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Monthly trend */}
      <div className="col-span-12 lg:col-span-8 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-gray-900">
            Monthly Attendance Trend
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Last 6 months overall percentage
          </p>
        </div>
        <div className="h-64">
          {monthlyData.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm text-gray-500">No trend data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyData}
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid stroke="#f3f4f6" vertical={false} />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ stroke: "#e9d5ff", strokeWidth: 2 }}
                  formatter={(value) => [`${value}%`, "Attendance"]}
                />
                <Line
                  type="monotone"
                  dataKey="percentage"
                  stroke="#7c3aed"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#7c3aed", strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Subject comparison */}
      <div className="col-span-12 lg:col-span-4 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-gray-900">
            Subject Comparison
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">Attendance by subject</p>
        </div>
        <div className="h-64">
          {subjectData.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-sm text-gray-500">No subject data available</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={subjectData}
                layout="vertical"
                margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
              >
                <CartesianGrid stroke="#f3f4f6" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 11, fill: "#6b7280" }}
                  axisLine={false}
                  tickLine={false}
                  width={90}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  cursor={{ fill: "#f5f3ff" }}
                  formatter={(value) => [`${value}%`, "Attendance"]}
                />
                <Bar dataKey="percentage" radius={[0, 6, 6, 0]} maxBarSize={20}>
                  {subjectData.map((entry, i) => (
                    <Cell key={i} fill={subjectBarColor(entry.percentage)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceCharts;
