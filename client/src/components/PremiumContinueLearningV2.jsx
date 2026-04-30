import React from "react";
import { FiPlayCircle, FiClock } from "react-icons/fi";

const PremiumContinueLearningV2 = ({ courses = [] }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Continue Learning</h2>
          <p className="text-gray-600">Pick up where you left off</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course, idx) => {
          const colorGradients = [
            "from-purple-500 to-blue-500",
            "from-blue-500 to-cyan-500",
            "from-indigo-500 to-purple-500",
          ];

          return (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            >
              {/* Header with gradient */}
              <div className={`h-32 bg-gradient-to-br ${colorGradients[idx % colorGradients.length]} p-6 flex items-end justify-between relative overflow-hidden`}>
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />

                <div className="relative z-10">
                  <h3 className="text-lg font-bold text-white leading-tight">{course.title}</h3>
                </div>

                <div className="relative z-10 w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                  <FiPlayCircle className="text-white text-xl" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                {/* Next Topic */}
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">Next Topic</p>
                  <p className="text-sm font-semibold text-gray-900">{course.nextTopic}</p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-600 font-medium">Progress</p>
                    <p className="text-xs font-bold text-gray-900">{course.progress}%</p>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${colorGradients[idx % colorGradients.length]} rounded-full transition-all duration-500`}
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                {/* CTA Button */}
                <button className="w-full mt-4 py-3 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-sm group-hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group/btn">
                  <FiPlayCircle className="group-hover/btn:translate-x-1 transition-transform" />
                  Continue
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PremiumContinueLearningV2;
