import React from "react";
import { FiAward, FiTrendingDown, FiZap } from "react-icons/fi";
import ProgressBar from "../ui/ProgressBar";

const TIPS = {
  Python: "Practice list comprehensions and decorators for cleaner code",
  "Web Development": "Build a small project end-to-end to lock in fundamentals",
  "Machine Learning": "Revise bias-variance tradeoff and cross-validation",
  "Deep Learning": "Walk through backpropagation by hand on a small network",
  DSA: "Solve 5 graph problems on whiteboard, no IDE",
  Aptitude: "Time-box yourself: 60 seconds per question on logic puzzles",
};

const fallbackTip = "Spend 30 focused minutes daily on this subject to see steady gains";

const PerformanceInsights = ({ subjectPerformance = [] }) => {
  if (subjectPerformance.length === 0) return null;

  const sorted = [...subjectPerformance].sort((a, b) => b.value - a.value);
  const strengths = sorted.filter((s) => s.value >= 80).slice(0, 3);
  const weak = sorted.filter((s) => s.value < 80).reverse().slice(0, 3);

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Strengths */}
      <div className="col-span-12 lg:col-span-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Strengths</h3>
            <p className="text-xs text-gray-500 mt-0.5">Subjects you're acing</p>
          </div>
          <div className="p-2 rounded-lg bg-green-50 text-green-600">
            <FiAward className="w-4 h-4" />
          </div>
        </div>

        {strengths.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            Keep going — your first strength is on the way
          </p>
        ) : (
          <div className="space-y-4">
            {strengths.map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-gray-700">{s.name}</span>
                  <span className="text-xs font-semibold text-green-700">{s.value}%</span>
                </div>
                <ProgressBar value={s.value} color="green" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Improvement Tips */}
      <div className="col-span-12 lg:col-span-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Improvement Tips</h3>
            <p className="text-xs text-gray-500 mt-0.5">Where to focus next</p>
          </div>
          <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
            <FiTrendingDown className="w-4 h-4" />
          </div>
        </div>

        {weak.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">
            Every subject is above 80% — fantastic work
          </p>
        ) : (
          <div className="space-y-4">
            {weak.map((s) => (
              <div
                key={s.name}
                className="p-3 rounded-xl border border-gray-100 hover:border-purple-200 transition-colors duration-200"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-gray-900">{s.name}</span>
                  <span
                    className={`text-xs font-semibold ${
                      s.value < 70 ? "text-red-700" : "text-amber-700"
                    }`}
                  >
                    {s.value}%
                  </span>
                </div>
                <ProgressBar value={s.value} />
                <div className="mt-3 flex items-start gap-2">
                  <FiZap className="w-3.5 h-3.5 text-purple-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {TIPS[s.name] || fallbackTip}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceInsights;
