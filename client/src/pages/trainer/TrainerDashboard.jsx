import React, { useMemo } from "react";
import {
  FiUsers,
  FiLayers,
  FiCalendar,
  FiBookOpen,
  FiBriefcase,
  FiUserX,
} from "react-icons/fi";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import GradientCard from "../../components/ui/GradientCard";

const ATTENDANCE_TREND = [
  { month: "Aug", percentage: 84 },
  { month: "Sep", percentage: 89 },
  { month: "Oct", percentage: 86 },
  { month: "Nov", percentage: 91 },
  { month: "Dec", percentage: 88 },
  { month: "Jan", percentage: 92 },
];

const BATCH_PERFORMANCE = [
  { batch: "AC-2025", score: 78 },
  { batch: "CU4FO-25", score: 86 },
  { batch: "VAC-25", score: 71 },
  { batch: "AC-2026", score: 82 },
  { batch: "CU4FO-26", score: 90 },
];

const COMPLETION_BREAKDOWN = [
  { name: "Completed", value: 62, color: "#10b981" },
  { name: "In Progress", value: 28, color: "#7c3aed" },
  { name: "Not Started", value: 10, color: "#e5e7eb" },
];

const tooltipStyle = {
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  fontSize: 12,
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
};

const TrainerDashboard = () => {
  const metrics = useMemo(
    () => ({
      totalStudents: 248,
      activeBatches: 12,
      avgAttendance: 88,
      courseCompletion: 62,
      placementReady: 71,
      dropout: 4,
    }),
    []
  );

  return (
    <div className="w-full bg-slate-50 min-h-full">
      {/* Header band */}
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8">
          <h1 className="text-2xl md:text-3xl font-semibold leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Trainer Dashboard
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Snapshot across batches, attendance, and placement readiness
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="w-full px-6 py-6 space-y-6">
        {/* KPIs */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <GradientCard
            icon={FiUsers}
            label="Total Students"
            value={metrics.totalStudents}
            color="blue"
            trend="+18"
          />
          <GradientCard
            icon={FiLayers}
            label="Active Batches"
            value={metrics.activeBatches}
            color="purple"
            trend="+2"
          />
          <GradientCard
            icon={FiCalendar}
            label="Avg Attendance"
            value={`${metrics.avgAttendance}%`}
            progress={metrics.avgAttendance}
            color="green"
            trend="+5%"
          />
          <GradientCard
            icon={FiBookOpen}
            label="Course Completion"
            value={`${metrics.courseCompletion}%`}
            progress={metrics.courseCompletion}
            color="indigo"
            trend="+8%"
          />
          <GradientCard
            icon={FiBriefcase}
            label="Placement Ready"
            value={`${metrics.placementReady}%`}
            progress={metrics.placementReady}
            color="orange"
            trend="+3%"
          />
          <GradientCard
            icon={FiUserX}
            label="Dropout"
            value={`${metrics.dropout}%`}
            color="red"
            trend="−1%"
          />
        </section>

        {/* Analytics row 1: line + pie */}
        <section className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Attendance Trend
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Last 6 months across all active batches
                </p>
              </div>
              <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded">
                +4% vs last period
              </span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={ATTENDANCE_TREND}
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
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#7c3aed", strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-gray-900">
                Course Completion
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Distribution across enrolments
              </p>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={COMPLETION_BREAKDOWN}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {COMPLETION_BREAKDOWN.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => [`${value}%`, ""]}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Bar chart full width */}
        <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Batch Performance
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Average assessment score per active batch
              </p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={BATCH_PERFORMANCE}
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid stroke="#f3f4f6" vertical={false} />
                <XAxis
                  dataKey="batch"
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
                  cursor={{ fill: "#f5f3ff" }}
                  formatter={(value) => [`${value}%`, "Avg Score"]}
                />
                <Bar
                  dataKey="score"
                  fill="#7c3aed"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TrainerDashboard;
