import React from "react";
import { FiClock, FiHelpCircle, FiPlay, FiRotateCcw, FiEye } from "react-icons/fi";

const AssessmentCardGrid = ({ assessments = [] }) => {
  try {
    const safeAssessments = assessments ?? [];

    if (!safeAssessments || safeAssessments.length === 0) {
      return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-5xl mb-4">📚</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No assessments found</h3>
          <p className="text-gray-600">Try adjusting your filters or check back later</p>
        </div>
      );
    }

    const getDifficultyBadge = (difficulty) => {
      const diffMap = {
        easy: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", label: "Easy" },
        medium: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", label: "Medium" },
        hard: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", label: "Hard" },
      };
      return diffMap[difficulty] || diffMap.medium;
    };

    const getStatusBadge = (status) => {
      const statusMap = {
        completed: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200", label: "Completed" },
        "in-progress": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", label: "In Progress" },
        "not-started": { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200", label: "Not Started" },
      };
      return statusMap[status] || statusMap["not-started"];
    };

    const getActionButton = (assessment) => {
      switch (assessment?.status) {
        case "completed":
          return { label: "View Result", icon: FiEye, color: "bg-gray-600 hover:bg-gray-700" };
        case "in-progress":
          return { label: "Resume", icon: FiRotateCcw, color: "bg-blue-600 hover:bg-blue-700" };
        default:
          return { label: "Start", icon: FiPlay, color: "bg-purple-600 hover:bg-purple-700" };
      }
    };

    return (
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Available Assessments</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeAssessments.map((assessment) => {
            try {
              const diffBadge = getDifficultyBadge(assessment?.difficulty);
              const statusBadge = getStatusBadge(assessment?.status);
              const actionBtn = getActionButton(assessment);
              const ActionIcon = actionBtn.icon;

              return (
                <div
                  key={assessment?.id ?? Math.random()}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-purple-300 transition-all duration-300 flex flex-col overflow-hidden group"
                >
                  <div className="h-1 bg-gradient-to-r from-purple-400 to-indigo-400"></div>

                  <div className="p-6 flex flex-col h-full">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {assessment?.title ?? "Untitled"}
                      </h3>
                      <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">
                        {assessment?.subject ?? "General"}
                      </p>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 flex-grow">
                      {assessment?.description ?? "No description available"}
                    </p>

                    <div className="flex gap-2 mb-4 flex-wrap">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${diffBadge.bg} ${diffBadge.text} ${diffBadge.border}`}>
                        {diffBadge.label}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}>
                        {statusBadge.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 py-4 border-t border-b border-gray-100 mb-4">
                      <div className="flex items-center gap-2">
                        <FiClock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">{assessment?.duration ?? 0} min</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiHelpCircle className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">{assessment?.questions ?? 0} Q</span>
                      </div>
                    </div>

                    {assessment?.status === "completed" && assessment?.score !== undefined ? (
                      <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-xs text-gray-600 font-semibold mb-1">Your Score</p>
                        <p className="text-2xl font-bold text-green-700">{assessment?.score}%</p>
                      </div>
                    ) : null}

                    {assessment?.status === "in-progress" && assessment?.progress !== undefined ? (
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-xs text-gray-600 font-semibold">Progress</p>
                          <p className="text-xs font-bold text-blue-600">{assessment?.progress}%</p>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 transition-all duration-500"
                            style={{ width: `${Math.max(0, Math.min(100, assessment?.progress))}%` }}
                          />
                        </div>
                      </div>
                    ) : null}

                    <button
                      className={`w-full ${actionBtn.color} text-white py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 mt-auto group-hover:scale-105`}
                    >
                      {ActionIcon ? <ActionIcon className="w-4 h-4" /> : null}
                      {actionBtn.label}
                    </button>
                  </div>
                </div>
              );
            } catch (error) {
              console.error("Error rendering assessment card:", error);
              return (
                <div
                  key={assessment?.id ?? Math.random()}
                  className="bg-red-50 rounded-xl p-6 border border-red-200"
                >
                  <p className="text-red-700 font-semibold">Error loading assessment</p>
                </div>
              );
            }
          })}
        </div>
      </div>
    );
  } catch (error) {
    console.error("AssessmentCardGrid Error:", error);
    return (
      <div className="bg-red-50 rounded-xl p-8 border border-red-200">
        <p className="text-red-700 font-semibold">Error loading assessments</p>
        <p className="text-red-600 text-sm mt-2">{error?.message}</p>
      </div>
    );
  }
};

export default AssessmentCardGrid;
