import React from "react";
import { FaPlay } from "react-icons/fa";

const SaaSContinueLearning = ({ courses = [] }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Continue Learning</h2>
      <div className="grid grid-cols-3 gap-6">
        {courses.map((course, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition-shadow duration-200 overflow-hidden"
          >
            {/* Background gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 to-blue-50/0 group-hover:from-purple-50 group-hover:to-blue-50 transition-colors duration-200 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-gray-900 mb-1 truncate">{course.title}</h3>
                  <p className="text-xs text-gray-600 truncate">Next: {course.nextTopic}</p>
                </div>
                <button className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white transition-shadow duration-200 hover:shadow-md">
                  <FaPlay className="text-xs ml-0.5" />
                </button>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
              <p className="text-xs text-purple-600 font-semibold mt-2 tabular-nums">
                {course.progress}% Complete
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SaaSContinueLearning;
