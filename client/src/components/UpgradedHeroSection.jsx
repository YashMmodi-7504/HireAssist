import React, { useEffect, useState } from "react";
import { getDynamicGreeting, getMotivationalQuote } from "../utils/helpers";

const UpgradedHeroSection = ({ user, progress = 48, streak = 7 }) => {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setQuote(getMotivationalQuote());
  }, []);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-500 via-purple-600 to-blue-500 p-12 shadow-xl">
      {/* Decorative background elements */}
      <div className="absolute -right-32 -top-32 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -left-32 -bottom-32 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10">
        <div className="mb-8 flex items-start justify-between">
          {/* Left: Greeting and info */}
          <div className="flex-1">
            <p className="text-purple-100 text-sm font-semibold mb-1">{getDynamicGreeting()}, {user.name}! 👋</p>
            <h1 className="text-4xl font-bold text-white mb-6">Welcome back to your learning journey</h1>

            {/* Stats row */}
            <div className="flex gap-8 mb-6">
              {/* Level badge */}
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center font-bold text-white text-lg">
                  {user.level || 1}
                </div>
                <div>
                  <p className="text-xs text-purple-100">Level</p>
                  <p className="text-sm font-bold text-white">{user.totalXP || 0} XP</p>
                </div>
              </div>

              {/* Streak badge */}
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-orange-400/30 flex items-center justify-center font-bold text-orange-200 text-lg">
                  🔥
                </div>
                <div>
                  <p className="text-xs text-purple-100">Streak</p>
                  <p className="text-sm font-bold text-white">{streak} days</p>
                </div>
              </div>
            </div>

            {/* Motivational quote */}
            <p className="text-purple-100 italic text-sm mb-6">"{quote}"</p>

            {/* CTA Buttons */}
            <div className="flex gap-4">
              <button className="px-8 py-3 bg-white text-purple-600 font-bold rounded-xl hover:shadow-md transition-shadow duration-200">
                Resume Learning
              </button>
              <button className="px-8 py-3 bg-white/20 text-white font-bold rounded-xl border border-white/30 hover:bg-white/30 transition-colors duration-200">
                View Stats
              </button>
            </div>
          </div>

          {/* Right: Circular progress */}
          <div className="ml-12 flex-shrink-0">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full" viewBox="0 0 160 160">
                {/* Background circle */}
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="white"
                  strokeWidth="8"
                  opacity="0.2"
                />
                {/* Progress circle */}
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  fill="none"
                  stroke="white"
                  strokeWidth="8"
                  strokeDasharray={`${(progress / 100) * 440} 440`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                  style={{ transform: "rotate(-90deg)", transformOrigin: "80px 80px" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-white">{progress}%</span>
                <span className="text-xs text-purple-100">Overall Progress</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradedHeroSection;
