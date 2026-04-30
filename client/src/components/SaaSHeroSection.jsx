import React from "react";

const SaaSHeroSection = ({ userName = "Yash", progress = 48 }) => {
  return (
    <div className="w-full bg-gradient-to-r from-purple-500 via-purple-600 to-blue-500 rounded-3xl px-12 py-10 shadow-lg mb-8 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-32" />
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-32" />

      <div className="relative z-10 flex items-center justify-between">
        {/* Left content */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-white mb-3">Welcome back, {userName}! 👋</h1>
          <p className="text-purple-100 text-lg mb-6">Continue your learning journey and master new skills</p>

          <div className="flex gap-4">
            <button className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-xl hover:shadow-md transition-shadow duration-200">
              Resume Learning
            </button>
            <button className="px-8 py-3 bg-white/20 text-white font-semibold rounded-xl border border-white/30 hover:bg-white/30 transition-all duration-300 backdrop-blur-sm">
              View All Courses
            </button>
          </div>
        </div>

        {/* Right circular progress */}
        <div className="flex-shrink-0 ml-12">
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
              <span className="text-sm text-purple-100">Overall Progress</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaaSHeroSection;
