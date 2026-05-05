import React from "react";
import {
  FiActivity,
  FiAlertTriangle,
  FiTrendingUp,
  FiCheckCircle,
} from "react-icons/fi";

const stripStyle = {
  present: "bg-green-400",
  absent: "bg-red-400",
  holiday: "bg-gray-200",
};

const StreakCard = ({ streak = 0, last7 = [] }) => (
  <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-6 h-full">
    <div className="flex items-center justify-between mb-4">
      <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
        Current Streak
      </p>
      <div className="p-1.5 rounded-md bg-purple-50 text-purple-600">
        <FiActivity className="w-4 h-4" />
      </div>
    </div>
    <p className="text-3xl font-semibold text-gray-900 leading-none">
      {streak} <span className="text-sm font-medium text-gray-500">days</span>
    </p>
    <p className="text-xs text-gray-500 mt-2">Consecutive days present</p>

    <div className="mt-5 flex items-center gap-1.5">
      {last7.map((status, i) => (
        <span
          key={i}
          className={`flex-1 h-1.5 rounded-full ${
            stripStyle[status] || "bg-gray-100"
          }`}
        />
      ))}
    </div>
    <p className="text-[11px] text-gray-500 mt-2">Last 7 days</p>
  </div>
);

const RiskCard = ({ percentage = 0, classesNeeded = 0 }) => {
  let level, label, badgeClass, message, Icon, iconClass;
  if (percentage < 75) {
    level = "critical";
    label = "Critical Risk";
    badgeClass = "text-red-700 bg-red-50 border-red-100";
    message =
      classesNeeded > 0
        ? `Attend next ${classesNeeded} classes to reach 80%`
        : "Take action to recover attendance";
    Icon = FiAlertTriangle;
    iconClass = "text-red-600 bg-red-50";
  } else if (percentage < 85) {
    level = "warning";
    label = "At Risk";
    badgeClass = "text-amber-700 bg-amber-50 border-amber-100";
    message =
      classesNeeded > 0
        ? `Attend next ${classesNeeded} classes to reach 85%+`
        : "Stay consistent to maintain";
    Icon = FiAlertTriangle;
    iconClass = "text-amber-600 bg-amber-50";
  } else {
    level = "good";
    label = "On Track";
    badgeClass = "text-green-700 bg-green-50 border-green-100";
    message = "Great job staying consistent — keep it up";
    Icon = FiCheckCircle;
    iconClass = "text-green-600 bg-green-50";
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
          Risk Indicator
        </p>
        <div className={`p-1.5 rounded-md ${iconClass}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <span
        className={`inline-flex px-2.5 py-1 rounded text-xs font-semibold border ${badgeClass}`}
      >
        {label}
      </span>
      <div className="mt-3">
        <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
          Recommended Action
        </p>
        <p className="text-sm text-gray-800 mt-1 leading-relaxed">{message}</p>
      </div>
    </div>
  );
};

const TrendCard = ({ delta = 0, prevPercentage = 0 }) => {
  const isUp = delta >= 0;
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
          Improvement Trend
        </p>
        <div
          className={`p-1.5 rounded-md ${
            isUp ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
          }`}
        >
          <FiTrendingUp className={`w-4 h-4 ${isUp ? "" : "rotate-180"}`} />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-semibold text-gray-900 leading-none">
          {isUp ? "+" : "−"}
          {Math.abs(delta)}%
        </p>
        <span
          className={`text-xs font-semibold ${
            isUp ? "text-green-600" : "text-red-600"
          }`}
        >
          {isUp ? "improved" : "dropped"}
        </span>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        vs last month ({prevPercentage}%)
      </p>
    </div>
  );
};

const AttendanceInsights = ({
  streak,
  last7,
  percentage,
  classesNeeded,
  trendDelta,
  prevPercentage,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StreakCard streak={streak} last7={last7} />
      <RiskCard percentage={percentage} classesNeeded={classesNeeded} />
      <TrendCard delta={trendDelta} prevPercentage={prevPercentage} />
    </div>
  );
};

export default AttendanceInsights;
