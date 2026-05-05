import React from "react";
import { FiClock, FiHelpCircle, FiPlay, FiRotateCcw, FiEye } from "react-icons/fi";

const AssessmentGrid = ({ assessments = [] }) => {
  try {
    const safeAssessments = assessments ?? [];

    if (!safeAssessments || safeAssessments.length === 0) {
      return (
        <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-200">
          <div className="text-5xl mb-4">📚</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No assessments available</h3>
          <p className="text-gray-600">Try adjusting your filters or check back later</p>
        </div>
      );
    }

    const getDifficultyBadge = (difficulty) => {
      const diffMap = {
        easy: { bg: "bg-green-50", text: "text-green-700", label: "Easy" },
        medium: { bg: "bg-yellow-50", text: "text-yellow-700", label: "Medium" },
        hard: { bg: "bg-red-50", text: "text-red-700", label: "Hard" },
      };
      return diffMap[difficulty] || diffMap.medium;
    };

    const getStatusBadge = (status) => {
      const statusMap = {
        completed: { bg: "bg-green-50", text: "text-green-700", label: "Completed" },
        "in-progress": { bg: "bg-blue-50", text: "text-blue-700", label: "In Progress" },
        "not-started": { bg: "bg-gray-50", text: "text-gray-700", label: "Not Started" },
      };
      return statusMap[status] || statusMap["not-started"];
    };

    const getActionButton = (assessment) => {
      switch (assessment?.status) {
        case "completed":
          return { label: "View Result", icon: FiEye, color: "bg-gray-600" };
        case "in-progress":
          return { label: "Resume", icon: FiRotateCcw, color: "bg-blue-600" };
        default:
          return { label: "Start", icon: FiPlay, color: "bg-purple-600" };
      }
    };

    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Assessments</h2>
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
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-purple-200 transition-all duration-300 flex flex-col"
                >
                  {/* Header */}
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {assessment?.title ?? "Untitled"}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">{assessment?.subject ?? "General"}</p>
                  </div>

                  {/* Badges */}
                  <div className="flex gap-2 mb-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${diffBadge.bg} ${diffBadge.text}`}>
                      {diffBadge.label}
                    </span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusBadge.bg} ${statusBadge.text}`}>
                      {statusBadge.label}
                    </span>
                  </div>

                  {/* Meta Info */}
                  <div className="grid grid-cols-2 gap-3 mb-4 py-4 border-y border-gray-100">
                    <div className="flex items-center gap-2">
                      <FiClock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700 font-medium">{assessment?.duration ?? 0} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiHelpCircle className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700 font-medium">{assessment?.questions ?? 0} Qs</span>
                    </div>
                  </div>

                  {/* Score if completed */}
                  {assessment?.status === "completed" && assessment?.score !== undefined ? (
                    <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-xs text-gray-600 mb-1">Your Score</p>
                      <p className="text-2xl font-bold text-green-700">{assessment?.score}%</p>
                    </div>
                  ) : null}

                  {/* Progress bar if in progress */}
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

                  {/* CTA Button */}
                  <button
                    onClick={() => console.log("Assessment clicked:", assessment?.id)}
                    className={`w-full ${actionBtn.color} text-white py-2.5 rounded-lg font-semibold hover:opacity-90 transition-all mt-auto flex items-center justify-center gap-2`}
                  >
                    {ActionIcon ? <ActionIcon className="w-4 h-4" /> : null}
                    {actionBtn.label}
                  </button>
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
    console.error("AssessmentGrid Error:", error);
    return (
      <div className="bg-red-50 rounded-2xl p-8 border border-red-200">
        <p className="text-red-700 font-semibold">Error loading assessments</p>
        <p className="text-red-600 text-sm mt-2">{error?.message}</p>
      </div>
    );
  }
};

export default AssessmentGrid;
