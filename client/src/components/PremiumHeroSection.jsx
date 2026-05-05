import React from "react";
import { FaPlay, FaFire, FaArrowRight } from "react-icons/fa";

const PremiumHeroSection = ({ userName, totalProgress = 62, nextCourse = "Advanced Python" }) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (totalProgress / 100) * circumference;

  return (
    <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl shadow-2xl overflow-hidden">
      <div className="relative px-8 py-12 flex items-center justify-between">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-200 rounded-full blur-3xl" />
        </div>

        {/* Left Content */}
        <div className="relative z-10 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <FaFire className="text-orange-300 text-lg" />
            <span className="text-orange-200 font-medium text-sm">7-Day Streak Active</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {userName}! 👋
          </h1>
          <p className="text-blue-100 text-lg mb-6 max-w-md">
            You're making great progress. Let's continue your learning journey and unlock new opportunities.
          </p>

          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 group">
              <FaPlay className="text-sm group-hover:translate-x-1 transition-transform" />
              Resume Learning: {nextCourse}
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl font-semibold hover:bg-white/30 transition-all duration-300">
              View All Courses
              <FaArrowRight className="text-sm" />
            </button>
          </div>
        </div>

        {/* Right: Circular Progress */}
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.5s ease" }}
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60A5FA" />
                  <stop offset="100%" stopColor="#A78BFA" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-white">{totalProgress}%</span>
              <span className="text-blue-100 text-xs mt-1">Overall Progress</span>
            </div>
          </div>
          <p className="text-blue-100 text-sm text-center">
            <span className="font-semibold">{3}</span> courses in progress
          </p>
        </div>
      </div>
    </div>
  );
};

export default PremiumHeroSection;
