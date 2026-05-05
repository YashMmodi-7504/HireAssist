import React from "react";
import { FiArrowRight, FiLightbulb } from "react-icons/fi";

const AssessmentRecommendations = ({ assessments = [] }) => {
  try {
    // Get areas for improvement based on low scores
    const safeAssessments = assessments ?? [];

    const weakAreas = safeAssessments
      .filter((a) => a?.score && a.score < 75)
      .map((a) => a?.skills ?? [])
      .flat();

    const uniqueWeakAreas = [...new Set(weakAreas ?? [])];

    // Get not attempted assessments as recommendations
    const recommendations = (safeAssessments ?? [])
      .filter((a) => a?.status === "not-attempted")
      .slice(0, 3);

    return (
      <div className="bg-white rounded-2xl shadow-md p-8">
        <div className="flex items-center gap-3 mb-6">
          <FiLightbulb className="w-6 h-6 text-amber-600" />
          <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
        </div>

        {recommendations && recommendations.length > 0 ? (
          <div>
            {uniqueWeakAreas && uniqueWeakAreas.length > 0 ? (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm font-semibold text-amber-900 mb-2">Based on your weak areas:</p>
                <div className="flex flex-wrap gap-2">
                  {uniqueWeakAreas.map((skill, idx) => {
                    try {
                      return (
                        <span key={idx} className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full">
                          Improve {skill ?? "Unknown"}
                        </span>
                      );
                    } catch (error) {
                      console.warn("Error rendering weak area:", error);
                      return null;
                    }
                  })}
                </div>
              </div>
            ) : null}

            <div className="space-y-4">
              {recommendations.map((rec, idx) => {
                try {
                  return (
                    <div
                      key={idx}
                      className="p-5 border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all"
                    >
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {rec?.title ?? "Untitled"}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {rec?.description ?? "No description available"}
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            {(rec?.skills ?? []).map((skill, i) => {
                              try {
                                return (
                                  <span key={i} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded">
                                    {skill ?? "Unknown"}
                                  </span>
                                );
                              } catch (error) {
                                console.warn("Error rendering recommendation skill:", error);
                                return null;
                              }
                            })}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                            {rec?.difficulty ?? "Unknown"}
                          </div>
                        </div>
                      </div>

                      <button className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mt-4 transition-colors">
                        Start Practicing
                        <FiArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  );
                } catch (error) {
                  console.error("Error rendering recommendation:", error);
                  return (
                    <div key={idx} className="p-5 border border-red-200 rounded-xl bg-red-50">
                      <p className="text-red-700">Error loading recommendation</p>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Great job! You've completed all recommended assessments.</p>
            <button className="px-6 py-2.5 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all">
              Explore More Assessments
            </button>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("AssessmentRecommendations Error:", error);
    return (
      <div className="bg-red-50 rounded-2xl shadow-md p-8 border border-red-200">
        <p className="text-red-700 font-semibold">Error loading recommendations</p>
        <p className="text-red-600 text-sm mt-2">{error?.message}</p>
      </div>
    );
  }
};

export default AssessmentRecommendations;
