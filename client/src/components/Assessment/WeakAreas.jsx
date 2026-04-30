import React from "react";
import { FiAlertCircle, FiArrowRight } from "react-icons/fi";

const WeakAreas = ({ items = [], onPractice }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Weak Areas</h3>
          <p className="text-xs text-gray-500 mt-0.5">Subjects scoring below 70%</p>
        </div>
        <FiAlertCircle className="w-5 h-5 text-gray-400" />
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">All subjects above 70%</p>
          <p className="text-xs text-gray-400 mt-1">Great job staying consistent</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((s) => (
            <div
              key={s.subject}
              className="flex items-center justify-between gap-3 p-3 border border-gray-100 rounded-lg hover:border-purple-200 transition-colors duration-200"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {s.subject}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {s.avg}% avg score
                </p>
              </div>
              <button
                type="button"
                onClick={() => onPractice?.(s)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors flex-shrink-0"
              >
                Practice
                <FiArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeakAreas;
