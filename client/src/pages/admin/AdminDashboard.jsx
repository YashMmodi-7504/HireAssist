import React, { useMemo } from "react";
import {
  FiUsers,
  FiBriefcase,
  FiBookOpen,
  FiLayers,
  FiCheckCircle,
  FiTrendingUp,
  FiUserPlus,
  FiSend,
  FiAward,
  FiClipboard,
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

const USER_GROWTH = [
  { month: "Aug", users: 168 },
  { month: "Sep", users: 184 },
  { month: "Oct", users: 205 },
  { month: "Nov", users: 218 },
  { month: "Dec", users: 232 },
  { month: "Jan", users: 248 },
];

const BATCH_PERFORMANCE = [
  { batch: "AC-2025",  score: 92 },
  { batch: "CU4FO-25", score: 89 },
  { batch: "AC-2024",  score: 88 },
  { batch: "AC-2026",  score: 86 },
  { batch: "VAC-25",   score: 81 },
  { batch: "CU4FO-26", score: 78 },
];

const PLACEMENT_DISTRIBUTION = [
  { name: "Placed",       value: 168, color: "#10b981" },
  { name: "In Process",   value: 42,  color: "#7c3aed" },
  { name: "Not Started",  value: 30,  color: "#e5e7eb" },
];

const ACTIVITIES = [
  { id: "A-1042", icon: FiUserPlus,   user: "Aarav Mehta",     action: "registered as a Student",       target: "VIT", time: "2m ago",  variant: "blue" },
  { id: "A-1041", icon: FiSend,       user: "Praful Bhoyar",   action: "assigned course",                target: "Python Fundamentals → AC-2025", time: "12m ago", variant: "purple" },
  { id: "A-1040", icon: FiCheckCircle,user: "Diya Patel",      action: "completed assessment",           target: "OOP Patterns Test (88%)",        time: "32m ago", variant: "green" },
  { id: "A-1039", icon: FiAward,      user: "Kabir Singh",     action: "earned certificate",             target: "Web Development Basics",         time: "1h ago",  variant: "orange" },
  { id: "A-1038", icon: FiClipboard,  user: "Ishita Rao",      action: "submitted feedback",             target: "5★ — DSA Track",                 time: "2h ago",  variant: "blue" },
  { id: "A-1037", icon: FiUserPlus,   user: "Reyansh Iyer",    action: "registered as a Student",       target: "BITS",                            time: "3h ago",  variant: "blue" },
];

const activityAccent = {
  blue:   "text-blue-700 bg-blue-50",
  purple: "text-purple-700 bg-purple-50",
  green:  "text-green-700 bg-green-50",
  orange: "text-orange-700 bg-orange-50",
};

const tooltipStyle = {
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  fontSize: 12,
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
};

const AdminDashboard = () => {
  const metrics = useMemo(
    () => ({
      totalUsers: 248,
      totalTrainers: 9,
      totalStudents: 220,
      activeBatches: 14,
      courseCompletion: 62,
      placementRate: 84,
    }),
    []
  );

  return (
    <div className="w-full bg-slate-50 min-h-full">
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8">
          <h1 className="text-2xl md:text-3xl font-semibold leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Admin Overview
            </span>
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Cross-organisation health: users, batches, placements, and recent activity
          </p>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-6 space-y-6">
        {/* KPIs */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <GradientCard icon={FiUsers}       label="Total Users"       value={metrics.totalUsers}    color="blue"   trend="+18" />
          <GradientCard icon={FiBriefcase}   label="Trainers"          value={metrics.totalTrainers} color="purple" />
          <GradientCard icon={FiBookOpen}    label="Students"          value={metrics.totalStudents} color="indigo" trend="+15" />
          <GradientCard icon={FiLayers}      label="Active Batches"    value={metrics.activeBatches} color="orange" trend="+2" />
          <GradientCard icon={FiCheckCircle} label="Course Completion" value={`${metrics.courseCompletion}%`} progress={metrics.courseCompletion} color="green" />
          <GradientCard icon={FiTrendingUp}  label="Placement Rate"    value={`${metrics.placementRate}%`}    progress={metrics.placementRate}    color="pink" trend="+6%" />
        </section>

        {/* Charts row 1: User Growth + Placement Pie */}
        <section className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
                <p className="text-xs text-gray-500 mt-0.5">Total platform users, last 6 months</p>
              </div>
              <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded">
                +48% YoY
              </span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={USER_GROWTH} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "#e9d5ff", strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="users" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 4, fill: "#7c3aed", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-gray-900">Placement Distribution</h3>
              <p className="text-xs text-gray-500 mt-0.5">Across all current students</p>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={PLACEMENT_DISTRIBUTION} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                    {PLACEMENT_DISTRIBUTION.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Batch performance bar */}
        <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-gray-900">Batch Performance</h3>
            <p className="text-xs text-gray-500 mt-0.5">Composite score per active batch</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={BATCH_PERFORMANCE} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="#f3f4f6" vertical={false} />
                <XAxis dataKey="batch" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f5f3ff" }} formatter={(v) => [v, "Score"]} />
                <Bar dataKey="score" fill="#7c3aed" radius={[6, 6, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Recent activity */}
        <section className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <p className="text-xs text-gray-500 mt-0.5">Latest events across the platform</p>
            </div>
            <button type="button" className="text-xs font-semibold text-purple-600 hover:text-purple-700">
              View all
            </button>
          </div>
          <ul className="divide-y divide-gray-100">
            {ACTIVITIES.map((a) => {
              const Icon = a.icon;
              const accent = activityAccent[a.variant] || activityAccent.purple;
              return (
                <li key={a.id} className="px-6 py-3 flex items-center gap-3 hover:bg-purple-50/30 transition-colors">
                  <span className={`p-2 rounded-lg ${accent} flex-shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800">
                      <span className="font-semibold text-gray-900">{a.user}</span>{" "}
                      <span className="text-gray-600">{a.action}</span>{" "}
                      <span className="font-semibold text-gray-900">{a.target}</span>
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">{a.time}</span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
