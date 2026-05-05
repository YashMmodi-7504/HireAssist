import React from "react";

const SaaSStreakCard = ({ streak = 7, longestStreak = 14 }) => {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition-shadow duration-200 h-fit sticky top-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-2xl flex-shrink-0">
          🔥
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-gray-900">Daily Streak</h2>
          <p className="text-sm text-gray-600">Keep it going!</p>
        </div>
      </div>

      {/* Streak stats */}
      <div className="space-y-6">
        {/* Current Streak */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">Current Streak</span>
            <span className="text-3xl font-bold text-orange-600 tabular-nums">{streak}</span>
          </div>
          <p className="text-xs text-gray-600">days</p>
        </div>

        {/* Longest Streak */}
        <div className="bg-gray-50 rounded-xl p-4 transition-colors duration-200 hover:bg-gray-100">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-semibold text-gray-700">Longest Streak</span>
            <span className="text-2xl font-bold text-purple-600 tabular-nums">{longestStreak}</span>
          </div>
          <p className="text-xs text-gray-600">Personal Record</p>
        </div>

        {/* Week calendar */}
        <div>
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
            This Week
          </p>
          <div className="grid grid-cols-7 gap-2">
            {daysOfWeek.map((day, idx) => (
              <div key={idx} className="text-center">
                <p className="text-xs text-gray-500 font-medium mb-2">{day}</p>
                <div
                  className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-colors duration-200 ${
                    idx < streak
                      ? "bg-gradient-to-br from-orange-400 to-orange-500 text-white shadow-md"
                      : idx === streak
                      ? "bg-orange-200 text-orange-700 ring-2 ring-orange-400"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {idx + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaaSStreakCard;
