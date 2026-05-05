import React from "react";
import { FiTrendingUp, FiTarget, FiBarChart2 } from "react-icons/fi";

const AssessmentAnalytics = ({ assessments = [] }) => {
  try {
    const safeAssessments = assessments ?? [];
    const completedAssessments = safeAssessments.filter((a) => a?.score !== undefined && a?.score !== null);

    if (!completedAssessments || completedAssessments.length === 0) {
      return null;
    }

    // Subject performance
    const subjectStats = {};
    completedAssessments.forEach((a) => {
      const subject = a?.subject ?? "General";
      if (!subjectStats[subject]) {
        subjectStats[subject] = { scores: [], count: 0 };
      }
      subjectStats[subject].scores.push(a?.score ?? 0);
      subjectStats[subject].count++;
    });

    const subjectData = Object.entries(subjectStats)
      .map(([subject, data]) => ({
        subject,
        average: Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length),
      }))
      .sort((a, b) => (b?.average ?? 0) - (a?.average ?? 0));

    // Overall stats
    const overallAvg = Math.round(
      completedAssessments.reduce((sum, a) => sum + (a?.score ?? 0), 0) / completedAssessments.length
    );
    const highestScore = Math.max(...completedAssessments.map((a) => a?.score ?? 0));
    const lowestScore = Math.min(...completedAssessments.map((a) => a?.score ?? 0));

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900">Performance Analytics</h2>

        {/* Analytics Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Score History */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-lg bg-purple-50">
                <FiTrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Score History</h3>
            </div>

            <div className="space-y-4">
              {completedAssessments.map((a, idx) => {
                try {
                  const score = a?.score ?? 0;
                  return (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-semibold text-gray-700 truncate">
                          {a?.title ?? "Unknown"}
                        </p>
                        <span className="text-sm font-bold text-purple-600">{score}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-500"
                          style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
                        />
                      </div>
                    </div>
                  );
                } catch (error) {
                  console.warn("Score history error:", error);
                  return null;
                }
              })}
            </div>
          </div>

          {/* Subject Performance */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-lg bg-blue-50">
                <FiTarget className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Subject Performance</h3>
            </div>

            <div className="space-y-4">
              {subjectData.map((subject, idx) => {
                try {
                  const avg = subject?.average ?? 0;
                  const color = avg >= 80 ? "bg-green-500" : avg >= 60 ? "bg-amber-500" : "bg-red-500";
                  return (
                    <div key={idx}>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-semibold text-gray-700">{subject?.subject ?? "Unknown"}</p>
                        <span className="text-sm font-bold text-gray-900">{avg}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${color}`}
                          style={{ width: `${Math.max(0, Math.min(100, avg))}%` }}
                        />
                      </div>
                    </div>
                  );
                } catch (error) {
                  console.warn("Subject performance error:", error);
                  return null;
                }
              })}
            </div>
          </div>
        </div>

        {/* Overall Statistics */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-lg bg-white border border-purple-200">
              <FiBarChart2 className="w-5 h-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Overall Statistics</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-2">Tests Completed</p>
              <p className="text-3xl font-bold text-gray-900">{completedAssessments?.length ?? 0}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-2">Average Score</p>
              <p className="text-3xl font-bold text-purple-600">{overallAvg ?? 0}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-2">Highest Score</p>
              <p className="text-3xl font-bold text-green-600">{highestScore ?? 0}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-2">Lowest Score</p>
              <p className="text-3xl font-bold text-red-600">{lowestScore ?? 0}%</p>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("AssessmentAnalytics Error:", error);
    return (
      <div className="bg-red-50 rounded-xl p-8 border border-red-200">
        <p className="text-red-700 font-semibold">Error loading analytics</p>
        <p className="text-red-600 text-sm mt-2">{error?.message}</p>
      </div>
    );
  }
};

export default AssessmentAnalytics;
