import React from "react";
import { getProgressToNextLevel } from "../utils/helpers";
import { FiPlay, FiBarChart2 } from "react-icons/fi";

const PremiumHeroSectionV2 = ({ user, progress = 48, streak = 7 }) => {
  const progressToNextLevel = getProgressToNextLevel(user.totalXP);

  return (
    <div className="rounded-2xl bg-gradient-to-r from-purple-50 via-white to-purple-100 shadow-md p-8 border border-purple-100 hover:shadow-lg transition-all duration-200">
      <div className="flex justify-between items-start gap-6">
        {/* LEFT SECTION */}
        <div className="flex-1">
          {/* Main Heading */}
          <h1 className="text-4xl font-bold text-purple-600 mt-1 mb-2 leading-tight">
            Welcome back, {user.name} 👋
          </h1>

          {/* Professional Subtext */}
          <p className="text-gray-500 text-sm mb-6">
            Track your progress, complete modules, and stay consistent.
          </p>

          {/* Stats Cards */}
          <div className="flex gap-4 mt-5 mb-6">
            {/* Level Card */}
            <div className="flex-1 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
              <p className="text-xs text-gray-500 mb-1">Level</p>
              <p className="text-lg font-semibold text-gray-900">{user.level || 1}</p>
            </div>

            {/* XP Card */}
            <div className="flex-1 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
              <p className="text-xs text-gray-500 mb-1">Total XP</p>
              <p className="text-lg font-semibold text-gray-900">{(user.totalXP || 0).toLocaleString()}</p>
            </div>

            {/* Streak Card */}
            <div className="flex-1 bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
              <p className="text-xs text-gray-500 mb-1">Streak</p>
              <p className="text-lg font-semibold text-gray-900">{streak} days</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-6 flex gap-3">
            <button className="bg-purple-600 text-white px-5 py-2.5 rounded-lg shadow-sm hover:bg-purple-700 hover:scale-105 transition-all duration-200 flex items-center gap-2 font-semibold">
              <FiPlay className="w-4 h-4" />
              Resume Learning
            </button>
            <button className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-all duration-200 flex items-center gap-2 font-semibold">
              <FiBarChart2 className="w-4 h-4" />
              View Stats
            </button>
          </div>
        </div>

        {/* RIGHT SECTION - Progress */}
        <div className="flex flex-col items-center justify-start">
          {/* Circular Progress */}
          <div className="relative w-20 h-20 mb-3">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle cx="60" cy="60" r="50" fill="none" stroke="#e5e7eb" strokeWidth="5" />
              {/* Progress circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#9333ea"
                strokeWidth="5"
                strokeDasharray={`${(progress / 100) * 314.16} 314.16`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-gray-900">{progress}%</span>
            </div>
          </div>

          {/* Progress Label */}
          <p className="text-sm text-gray-500 mb-3">Overall Progress</p>

          {/* Progress Bar */}
          <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-purple-500 transition-all duration-700"
              style={{ width: `${progressToNextLevel}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumHeroSectionV2;
