import React from "react";
import { FiTrendingUp } from "react-icons/fi";

const AnalyticsSection = ({ assessments = [] }) => {
  try {
    // Get completed assessments with scores
    const safeAssessments = assessments ?? [];
    const completedAssessments = safeAssessments
      .filter((a) => a?.score !== undefined && a?.score !== null)
      .sort((a, b) => (a?.id ?? 0) - (b?.id ?? 0));

    // Skill-wise performance
    const skillPerformance = {};
    (completedAssessments ?? []).forEach((a) => {
      (a?.skills ?? []).forEach((skill) => {
        if (!skillPerformance[skill]) {
          skillPerformance[skill] = { scores: [], count: 0 };
        }
        skillPerformance[skill].scores.push(a?.score ?? 0);
        skillPerformance[skill].count++;
      });
    });

    const skillData = Object.entries(skillPerformance)
      .map(([skill, data]) => ({
        skill,
        average:
          data?.scores && data.scores.length > 0
            ? Math.round(data.scores.reduce((a, b) => a + b, 0) / data.scores.length)
            : 0,
      }))
      .sort((a, b) => (b?.average ?? 0) - (a?.average ?? 0));

    const maxScore = Math.max(...(skillData?.map((d) => d?.average ?? 0) ?? [0]), 100);

    // Calculate statistics
    const totalTests = safeAssessments?.length ?? 0;
    const completedTests = completedAssessments?.length ?? 0;
    const avgScore =
      completedTests > 0
        ? Math.round(
            (completedAssessments?.reduce((sum, a) => sum + (a?.score ?? 0), 0) ?? 0) / completedTests
          )
        : 0;
    const bestScore =
      completedTests > 0 ? Math.max(...(completedAssessments?.map((a) => a?.score ?? 0) ?? [0])) : 0;

    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Performance Analytics</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Score Trend */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <FiTrendingUp className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-bold text-gray-900">Score Trend</h3>
            </div>

            <div className="space-y-4">
              {completedAssessments && completedAssessments.length > 0 ? (
                completedAssessments.map((assessment, idx) => {
                  try {
                    const score = assessment?.score ?? 0;
                    return (
                      <div key={idx}>
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm font-semibold text-gray-700">
                            {assessment?.title ?? "Unknown"}
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
                    console.error("Error rendering score trend:", error);
                    return null;
                  }
                })
              ) : (
                <p className="text-gray-500 text-center py-8">No completed assessments yet</p>
              )}
            </div>
          </div>

          {/* Skill Performance */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Skill Performance</h3>

            <div className="space-y-4">
              {skillData && skillData.length > 0 ? (
                skillData.map((skill, idx) => {
                  try {
                    const average = skill?.average ?? 0;
                    return (
                      <div key={idx}>
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm font-semibold text-gray-700">{skill?.skill ?? "Unknown"}</p>
                          <span className="text-sm font-bold text-purple-600">{average}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              average >= 80
                                ? "bg-green-500"
                                : average >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${Math.max(0, Math.min(100, average))}%` }}
                          />
                        </div>
                      </div>
                    );
                  } catch (error) {
                    console.error("Error rendering skill performance:", error);
                    return null;
                  }
                })
              ) : (
                <p className="text-gray-500 text-center py-8">No skill data yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Statistics Summary */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl shadow-md p-6 mt-6 border border-purple-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-600 mb-1">Total Tests</p>
              <p className="text-3xl font-bold text-gray-900">{totalTests ?? 0}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-600">{completedTests ?? 0}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Avg Score</p>
              <p className="text-3xl font-bold text-purple-600">{avgScore ?? 0}%</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Best Score</p>
              <p className="text-3xl font-bold text-blue-600">{bestScore ?? 0}%</p>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("AnalyticsSection Error:", error);
    return (
      <div className="bg-red-50 rounded-2xl shadow-md p-8 border border-red-200">
        <p className="text-red-700 font-semibold">Error loading analytics</p>
        <p className="text-red-600 text-sm mt-2">{error?.message}</p>
      </div>
    );
  }
};

export default AnalyticsSection;
