import React from "react";
import { FiCompass, FiArrowRight } from "react-icons/fi";

const difficultyDot = {
  easy: "bg-green-500",
  medium: "bg-amber-500",
  hard: "bg-red-500",
};

const RecommendedTests = ({ items = [], onStart }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Recommended</h3>
          <p className="text-xs text-gray-500 mt-0.5">Tests we suggest next</p>
        </div>
        <FiCompass className="w-5 h-5 text-gray-400" />
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">
          No recommendations right now
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between gap-3 p-3 border border-gray-100 rounded-lg hover:border-purple-200 transition-colors duration-200"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {t.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      difficultyDot[t.difficulty] || "bg-gray-400"
                    }`}
                  />
                  <p className="text-xs text-gray-500 truncate">
                    {t.subject} · {t.duration}m
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onStart?.(t)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-700 transition-colors flex-shrink-0"
              >
                Start
                <FiArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendedTests;
