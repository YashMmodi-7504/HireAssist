import React from "react";
import { FaPlay, FaFire, FaArrowUp, FaLightbulb } from "react-icons/fa";

const ContinueLearningStrip = ({ courses }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <FaPlay className="text-purple-600" />
        Continue Learning
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {courses.map((course, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-64 p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200 hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-900 text-sm">{course.title}</h3>
              <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                {course.progress}%
              </span>
            </div>
            <p className="text-xs text-gray-600 mb-3">{course.nextTopic}</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
              <button className="p-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-all group-hover:scale-110">
                <FaPlay className="text-xs" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DailyStreakTracker = ({ streak = 7, longestStreak = 14 }) => {
  const days = [
    { day: "Mon", active: true },
    { day: "Tue", active: true },
    { day: "Wed", active: true },
    { day: "Thu", active: false },
    { day: "Fri", active: true },
    { day: "Sat", active: true },
    { day: "Sun", active: true },
  ];

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <FaFire className="text-orange-500" />
          Your Streak
        </h2>
        <div className="text-right">
          <p className="text-3xl font-bold text-orange-600">{streak}</p>
          <p className="text-xs text-gray-600">days active</p>
        </div>
      </div>

      {/* Weekly Activity */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-3">This Week</p>
        <div className="grid grid-cols-7 gap-2">
          {days.map((d, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                d.active
                  ? "bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-lg"
                  : "bg-white border border-gray-200 text-gray-400"
              }`}
            >
              <span className="text-xs font-bold">{d.day}</span>
              {d.active && <FaFire className="text-xs mt-1" />}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 p-4 bg-white rounded-xl">
        <div>
          <p className="text-xs text-gray-600 font-medium">Current Streak</p>
          <p className="text-2xl font-bold text-orange-600">{streak} days</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 font-medium">Longest Streak</p>
          <p className="text-2xl font-bold text-purple-600">{longestStreak} days</p>
        </div>
      </div>
    </div>
  );
};

const SmartInsightsPanel = ({ insights }) => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <FaLightbulb className="text-blue-600" />
        Smart Insights
      </h2>

      <div className="space-y-3">
        {insights.map((insight, idx) => (
          <div
            key={idx}
            className="p-4 bg-white rounded-xl border border-blue-100 hover:shadow-lg transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white flex-shrink-0">
                <FaArrowUp className="text-sm" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-sm">{insight.title}</p>
                <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                {insight.action && (
                  <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 mt-2">
                    {insight.action} →
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { ContinueLearningStrip, DailyStreakTracker, SmartInsightsPanel };
