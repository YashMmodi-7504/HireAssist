import React from "react";
import { FiAward, FiTarget, FiTrendingUp, FiCheckCircle } from "react-icons/fi";

const AssessmentOverview = ({ assessments = [] }) => {
  try {
    // Safe calculations with fallbacks
    const safeAssessments = assessments ?? [];

    const completedCount = safeAssessments.filter((a) => a?.status === "completed").length ?? 0;

    // Get completed assessments with scores
    const completedWithScores = safeAssessments.filter((a) => a?.status === "completed" && a?.score);
    const hasScores = completedWithScores && completedWithScores.length > 0;

    const averageScore = hasScores
      ? Math.round(
          completedWithScores.reduce((sum, a) => sum + (a?.score ?? 0), 0) / completedWithScores.length
        )
      : 0;

    const highestScore =
      hasScores ? Math.max(...completedWithScores.map((a) => a?.score ?? 0), 0) : 0;

    const skillLevel =
      averageScore >= 90
        ? "Expert"
        : averageScore >= 75
        ? "Advanced"
        : averageScore >= 60
        ? "Intermediate"
        : "Beginner";

    const stats = [
      {
        label: "Completed",
        value: completedCount ?? 0,
        icon: FiCheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50",
      },
      {
        label: "Average Score",
        value: `${averageScore ?? 0}%`,
        icon: FiTarget,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
      },
      {
        label: "Highest Score",
        value: `${highestScore ?? 0}%`,
        icon: FiTrendingUp,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
      },
      {
        label: "Skill Level",
        value: skillLevel ?? "Beginner",
        icon: FiAward,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
      },
    ];

    return (
      <div className="bg-gradient-to-r from-purple-50 via-white to-purple-100 rounded-2xl shadow-md p-8 border border-purple-100">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-purple-600 mb-2">Assessments</h1>
          <p className="text-gray-600">Test your skills and track your performance</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats && stats.length > 0 ? (
            stats.map((stat, idx) => {
              try {
                const Icon = stat?.icon;
                return (
                  <div key={idx} className={`${stat?.bgColor ?? "bg-gray-50"} rounded-xl p-4`}>
                    <div className="flex items-center gap-3 mb-3">
                      {Icon ? <Icon className={`w-5 h-5 ${stat?.color ?? "text-gray-600"}`} /> : null}
                    </div>
                    <p className="text-xs text-gray-600 font-semibold mb-1">{stat?.label ?? "N/A"}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat?.value ?? "0"}</p>
                  </div>
                );
              } catch (error) {
                console.error("Error rendering stat:", error);
                return (
                  <div key={idx} className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-red-600">Error</p>
                  </div>
                );
              }
            })
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">No assessment data available</p>
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("AssessmentOverview Error:", error);
    return (
      <div className="bg-red-50 rounded-2xl shadow-md p-8 border border-red-200">
        <p className="text-red-700 font-semibold">Error loading assessment overview</p>
        <p className="text-red-600 text-sm mt-2">{error?.message}</p>
      </div>
    );
  }
};

export default AssessmentOverview;
