import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const WeeklyActivityChart = ({ data = [] }) => {
  const total = data.reduce((acc, d) => acc + (d?.hours || 0), 0);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 h-full">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Weekly Activity</h3>
          <p className="text-xs text-gray-500 mt-0.5">Hours spent learning this week</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
            Total
          </p>
          <p className="text-lg font-semibold text-gray-900">{total.toFixed(1)}h</p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="#f3f4f6" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: "#6b7280" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
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
              formatter={(value) => [`${value}h`, "Hours"]}
            />
            <Bar dataKey="hours" fill="#7c3aed" radius={[6, 6, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyActivityChart;
