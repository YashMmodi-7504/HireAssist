import React from "react";
import { FiArrowRight } from "react-icons/fi";

const ContinueLearning = ({ courses = [], onContinue, onViewAll }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Continue Learning</h2>
          <p className="text-xs text-gray-500 mt-0.5">Pick up where you left off</p>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors"
        >
          View all
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.length === 0 && (
          <p className="col-span-full text-sm text-gray-500 text-center py-8">
            No courses in progress
          </p>
        )}
        {courses.map((c) => (
          <div
            key={c.title}
            className="border border-gray-100 rounded-xl p-5 hover:border-purple-200 hover:shadow-[0_8px_24px_-8px_rgba(124,58,237,0.18)] hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <p className="text-sm font-semibold text-gray-900 truncate">{c.title}</p>
              <span className="text-xs font-semibold text-gray-500 flex-shrink-0">
                {c.progress}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mb-4">Next: {c.nextTopic}</p>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${c.progress}%` }}
              />
            </div>
            <button
              type="button"
              onClick={() => onContinue?.(c)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors"
            >
              Continue
              <FiArrowRight className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContinueLearning;
