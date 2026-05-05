import React from "react";
import { FiTarget, FiCheckCircle, FiClock, FiTrendingUp } from "react-icons/fi";

const AssessmentStats = ({ assessments = [] }) => {
  try {
    const safeAssessments = assessments ?? [];
    
    const stats = {
      total: safeAssessments.length,
      completed: safeAssessments.filter((a) => a?.status === "completed").length,
      pending: safeAssessments.filter((a) => a?.status === "not-started" || a?.status === "in-progress").length,
      avgScore: safeAssessments.filter((a) => a?.score).length > 0
        ? Math.round(safeAssessments.filter((a) => a?.score).reduce((sum, a) => sum + (a?.score ?? 0), 0) / safeAssessments.filter((a) => a?.score).length)
        : 0,
    };

    const statCards = [
      {
        icon: FiTarget,
        label: "Total Assessments",
        value: stats.total,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-100",
        trend: null,
      },
      {
        icon: FiCheckCircle,
        label: "Completed",
        value: stats.completed,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-100",
        trend: "+2",
      },
      {
        icon: FiClock,
        label: "Pending",
        value: stats.pending,
        color: "text-amber-600",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-100",
        trend: "-1",
      },
      {
        icon: FiTrendingUp,
        label: "Average Score",
        value: `${stats.avgScore}%`,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-100",
        trend: "+5%",
      },
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          try {
            const Icon = card?.icon;
            return (
              <div
                key={idx}
                className={`${card?.bgColor} border ${card?.borderColor} rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-default`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  {Icon ? (
                    <div className={`p-2.5 rounded-lg ${card?.bgColor}`}>
                      <Icon className={`w-6 h-6 ${card?.color}`} />
                    </div>
                  ) : null}
                  {card?.trend ? (
                    <span className={`text-xs font-bold ${card?.color} bg-white/40 px-2 py-1 rounded`}>
                      {card.trend}
                    </span>
                  ) : null}
                </div>

                {/* Label */}
                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-2">
                  {card?.label}
                </p>

                {/* Value */}
                <p className="text-3xl font-bold text-gray-900">{card?.value}</p>
              </div>
            );
          } catch (error) {
            console.error("Stat card error:", error);
            return null;
          }
        })}
      </div>
    );
  } catch (error) {
    console.error("AssessmentStats Error:", error);
    return (
      <div className="bg-red-50 rounded-xl p-6 border border-red-200">
        <p className="text-red-700 font-semibold">Error loading statistics</p>
      </div>
    );
  }
};

export default AssessmentStats;
