import React from "react";
import { FiActivity } from "react-icons/fi";

const StreakIndicator = ({ currentStreak = 0, longestStreak = 0, last14 = [] }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
            <FiActivity className="w-5 h-5" />
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

        <div className="flex items-center gap-1.5">
          {last14.map((active, i) => (
            <span
              key={i}
              className={`w-3 h-3 rounded-sm transition-colors ${
                active ? "bg-purple-500" : "bg-gray-100"
              }`}
              title={`Day ${i + 1}: ${active ? "Active" : "Inactive"}`}
            />
          ))}
          <span className="ml-3 text-xs text-gray-500 whitespace-nowrap">
            Last 14 days
          </span>
        </div>
      </div>
    </div>
  );
};

export default StreakIndicator;
