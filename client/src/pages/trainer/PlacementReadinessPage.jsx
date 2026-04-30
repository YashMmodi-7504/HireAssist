import React from "react";
import {
  FiCheckCircle,
  FiVideo,
  FiTrendingUp,
  FiCode,
  FiClipboard,
  FiArrowRight,
} from "react-icons/fi";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import GradientCard from "../../components/ui/GradientCard";

const READINESS_TREND = [
  { week: "W1", readiness: 42 },
  { week: "W2", readiness: 48 },
  { week: "W3", readiness: 55 },
  { week: "W4", readiness: 61 },
  { week: "W5", readiness: 65 },
  { week: "W6", readiness: 71 },
  { week: "W7", readiness: 74 },
  { week: "W8", readiness: 79 },
];

const SECTIONS = [
  {
    id: "mcq",
    title: "MCQs",
    description: "Aptitude, technical, and reasoning quizzes",
    completed: 240,
    total: 320,
    icon: FiClipboard,
    color: "blue",
  },
  {
    id: "coding",
    title: "Coding",
    description: "Live coding challenges across DSA and DBMS",
    completed: 156,
    total: 260,
    icon: FiCode,
    color: "purple",
  },
  {
    id: "interview",
    title: "Interviews",
    description: "Mock interviews — technical, HR, and group discussion",
    completed: 88,
    total: 180,
    icon: FiVideo,
    color: "orange",
  },
];

const sectionAccent = {
  blue: { bg: "from-blue-500 to-blue-400", text: "text-blue-700", chip: "bg-blue-50 text-blue-700 border-blue-100" },
  purple: { bg: "from-purple-500 to-purple-400", text: "text-purple-700", chip: "bg-purple-50 text-purple-700 border-purple-100" },
  orange: { bg: "from-orange-500 to-orange-400", text: "text-orange-700", chip: "bg-orange-50 text-orange-700 border-orange-100" },
};

const tooltipStyle = {
  borderRadius: 8,
  border: "1px solid #e5e7eb",
  fontSize: 12,
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
};

const SectionCard = ({ section }) => {
  const Icon = section.icon;
  const accent = sectionAccent[section.color];
  const pct = Math.round((section.completed / section.total) * 100);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
      <div className={`h-1 bg-gradient-to-r ${accent.bg}`} />
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-2.5 rounded-xl ${accent.chip} border`}>
            <Icon className="w-5 h-5" />
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${accent.chip}`}>
            {pct}% complete
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">
          {section.description}
        </p>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-500">
              {section.completed} of {section.total} completed
            </span>
            <span className={`text-xs font-bold ${accent.text}`}>
              {pct}%
            </span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${accent.bg} rounded-full transition-all duration-700`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="flex-1" />

        <button
          type="button"
          className="mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 rounded-lg shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(124,58,237,0.45)] active:scale-[0.98] transition-all duration-200"
        >
          View {section.title} Reports
          <FiArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

const PlacementReadinessPage = () => {
  return (
    <div className="w-full bg-slate-50 min-h-full">
      <div className="bg-gradient-to-r from-purple-50 via-white to-indigo-50 border-b border-purple-100">
        <div className="px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Placement Readiness
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Track student preparation across MCQs, coding, and interview rounds
          </p>
        </div>
      </div>

      <div className="w-full px-6 lg:px-8 py-6 space-y-6">
        {/* Top KPIs */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <GradientCard
            icon={FiCheckCircle}
            label="Students Ready"
            value="142"
            sublabel="of 240 enrolled"
            color="green"
            trend="+12"
          />
          <GradientCard
            icon={FiVideo}
            label="Mock Interviews Done"
            value="88"
            sublabel="this phase"
            color="purple"
            trend="+9"
          />
          <GradientCard
            icon={FiTrendingUp}
            label="Avg Score"
            value="74%"
            progress={74}
            color="blue"
            trend="+5%"
          />
        </section>

        {/* Section cards */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Preparation Tracks
            </h2>
            <span className="text-xs text-gray-500">3 active modules</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SECTIONS.map((s) => (
              <SectionCard key={s.id} section={s} />
            ))}
          </div>
        </section>

        {/* Readiness trend chart */}
        <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Readiness Growth
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Average readiness score across all students, week over week
              </p>
            </div>
            <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded">
              +37% over 8 weeks
            </span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={READINESS_TREND}
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid stroke="#f3f4f6" vertical={false} />
                <XAxis
                  dataKey="week"
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
                  formatter={(value) => [`${value}%`, "Readiness"]}
                />
                <Line
                  type="monotone"
                  dataKey="readiness"
                  stroke="#7c3aed"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#7c3aed", strokeWidth: 0 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PlacementReadinessPage;
