import React from "react";
import { FiActivity, FiZap } from "react-icons/fi";

// Backwards-compatible day shape: accepts either a boolean
// (legacy `last14: [true, false, ...]`) or `{ active, hours }`.
const normalize = (d) => {
  if (typeof d === "boolean") return { active: d, hours: d ? 1 : 0 };
  if (d && typeof d === "object")
    return { active: !!d.active, hours: Number(d.hours) || 0 };
  return { active: false, hours: 0 };
};

// 4-tier GitHub-style intensity buckets, keyed by hours studied.
const tierClass = (hours) => {
  if (hours <= 0) return "bg-gray-100";
  if (hours < 1.5) return "bg-purple-200";
  if (hours < 3) return "bg-purple-400";
  if (hours < 4.5) return "bg-purple-600";
  return "bg-purple-700";
};

const StreakIndicator = ({ currentStreak = 0, longestStreak = 0, last14 = [] }) => {
  const days = last14.map(normalize);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative p-3 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-600">
            <FiActivity className="w-5 h-5" />
            {currentStreak > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-400 text-white shadow-sm animate-pulse">
                <FiZap className="w-2.5 h-2.5" />
              </span>
            )}
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
              Current Streak
            </p>
            <p className="text-2xl font-semibold text-gray-900 leading-none mt-1">
              {currentStreak}{" "}
              <span className="text-sm font-medium text-gray-500">days</span>
            </p>
          </div>
          <div className="hidden sm:block border-l border-gray-100 pl-4 ml-2">
            <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
              Longest
            </p>
            <p className="text-2xl font-semibold text-gray-900 leading-none mt-1">
              {longestStreak}{" "}
              <span className="text-sm font-medium text-gray-500">days</span>
            </p>
          </div>
        </div>

        {/* GitHub-style heatmap */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-1">
            {days.map((d, i) => (
              <span
                key={i}
                className={`w-3.5 h-3.5 rounded-sm transition-all duration-300 hover:scale-125 hover:ring-2 hover:ring-purple-300 ${tierClass(
                  d.hours
                )}`}
                title={`Day ${i + 1}: ${
                  d.active ? `${d.hours.toFixed(1)} hrs studied` : "Inactive"
                }`}
              />
            ))}
          </div>
          {/* Legend */}
          <div className="flex items-center gap-1 text-[10px] text-gray-400">
            <span className="mr-1">Less</span>
            <span className="w-2.5 h-2.5 rounded-sm bg-gray-100" />
            <span className="w-2.5 h-2.5 rounded-sm bg-purple-200" />
            <span className="w-2.5 h-2.5 rounded-sm bg-purple-400" />
            <span className="w-2.5 h-2.5 rounded-sm bg-purple-600" />
            <span className="w-2.5 h-2.5 rounded-sm bg-purple-700" />
            <span className="ml-1">More</span>
            <span className="ml-2 text-gray-500 hidden sm:inline">· Last 14 days</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakIndicator;
