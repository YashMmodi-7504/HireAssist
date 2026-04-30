import React from "react";
import { FiTarget, FiTrendingUp } from "react-icons/fi";

const AssessmentHeader = ({ assessments = [] }) => {
  try {
    const safeAssessments = assessments ?? [];
    const completedCount = safeAssessments.filter((a) => a?.status === "completed").length;
    const completedWithScores = safeAssessments.filter((a) => a?.score);
    const avgScore = completedWithScores.length > 0
      ? Math.round(completedWithScores.reduce((sum, a) => sum + (a?.score ?? 0), 0) / completedWithScores.length)
      : 0;

    // Circular progress ring
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (avgScore / 100) * circumference;

    return (
      <div className="flex items-start justify-between gap-8">
        {/* Left: Title & Description */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Assessments</h1>
          <p className="text-gray-600 text-lg">Track your progress and evaluate your skills</p>
          
          {/* Quick Stats */}
          <div className="flex items-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <FiTarget className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-700">
                <span className="font-bold text-gray-900">{completedCount}</span> completed
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FiTrendingUp className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-700">
                <span className="font-bold text-gray-900">{avgScore}%</span> avg score
              </span>
            </div>
          </div>
        </div>

        {/* Right: Circular Progress */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#7c3aed"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">{avgScore}%</span>
              <span className="text-xs text-gray-500 font-medium">Overall</span>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("AssessmentHeader Error:", error);
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <p className="text-red-700 font-semibold">Error loading header</p>
      </div>
    );
  }
};

export default AssessmentHeader;
