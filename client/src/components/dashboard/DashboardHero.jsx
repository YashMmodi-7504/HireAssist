import React from "react";
import { FiPlay, FiBarChart2 } from "react-icons/fi";

const CircleProgress = ({ value = 0, size = 128, stroke = 10 }) => {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke="#ede9fe"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="transparent"
        stroke="url(#heroGradient)"
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-700"
      />
      <defs>
        <linearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const DashboardHero = ({ user, progress = 0, onResume, onAnalytics }) => {
  const circleSize = 128;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-indigo-50 border border-purple-100 rounded-2xl shadow-sm p-6 lg:p-8">
      {/* Soft accent blobs */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-purple-300/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-indigo-300/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left: Welcome + CTAs */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl md:text-3xl font-semibold leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
              Welcome back, {user?.name || "Student"}
            </span>{" "}
            <span className="inline-block">👋</span>
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Stay consistent — small daily progress beats occasional sprints
          </p>

          <div className="flex flex-wrap gap-3 mt-7">
            <button
              type="button"
              onClick={onResume}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:scale-[0.98] text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(124,58,237,0.45)] transition-all duration-200"
            >
              <FiPlay className="w-4 h-4" />
              Resume Learning
            </button>
            <button
              type="button"
              onClick={onAnalytics}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white hover:border-gray-300 text-gray-700 text-sm font-semibold rounded-lg transition-all duration-200"
            >
              <FiBarChart2 className="w-4 h-4" />
              View Analytics
            </button>
          </div>
        </div>

        {/* Right: Progress + Level/XP */}
        <div className="flex items-center gap-6 flex-shrink-0">
          <div
            className="relative flex items-center justify-center"
            style={{ width: circleSize, height: circleSize }}
          >
            <CircleProgress value={progress} size={circleSize} stroke={10} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-gray-900 leading-none tracking-tight">
                {progress}%
              </span>
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold mt-1.5">
                Progress
              </span>
            </div>
          </div>

          <div className="border-l border-gray-200/70 pl-6 space-y-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                Level
              </p>
              <p className="text-2xl font-bold text-gray-900 leading-none mt-1 tracking-tight">
                L{user?.level ?? 1}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
                Total XP
              </p>
              <p className="text-2xl font-bold text-gray-900 leading-none mt-1 tracking-tight">
                {(user?.totalXP ?? 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;
