import React from "react";

const StreakHeatmap = ({ activityData = [], currentStreak = 7, longestStreak = 14 }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Learning Consistency</h2>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Current Streak</p>
            <p className="text-3xl font-bold text-orange-600">{currentStreak} 🔥</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Longest Streak</p>
            <p className="text-3xl font-bold text-purple-600">{longestStreak}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Total Days</p>
            <p className="text-3xl font-bold text-blue-600">
              {longestStreak * 2}
            </p>
          </div>
        </div>
      </div>

      {/* Motivational message */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-6">
        <p className="text-lg font-semibold text-gray-900 mb-2">🎯 You're on a roll!</p>
        <p className="text-gray-700">
          {currentStreak >= 7
            ? `You have an amazing ${currentStreak}-day streak! Keep the momentum going!`
            : "Start a learning streak by studying every day to unlock rewards!"}
        </p>
      </div>
    </div>
  );
};

export default StreakHeatmap;

