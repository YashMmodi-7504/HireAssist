import React from "react";
import { FiEye, FiCalendar, FiAward } from "react-icons/fi";

const AttemptHistory = ({ assessments = [] }) => {
  try {
    // Create attempt history from assessments safely
    const safeAssessments = assessments ?? [];

    const attempts = safeAssessments
      .filter((a) => a?.status === "completed")
      .map((a) => ({
        testName: a?.title ?? "Unknown",
        score: a?.score ?? 0,
        date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        attempts: a?.attempts ?? 0,
        status: (a?.score ?? 0) >= 75 ? "Passed" : "Failed",
      }))
      .sort((a, b) => new Date(b?.date ?? 0) - new Date(a?.date ?? 0));

    return (
      <div className="bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Attempt History</h2>

        {attempts && attempts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Test Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Score</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Attempts</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((attempt, idx) => {
                  try {
                    return (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-all">
                        <td className="py-4 px-4">
                          <p className="font-semibold text-gray-900">{attempt?.testName ?? "N/A"}</p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <FiAward className="w-4 h-4 text-purple-600" />
                            <span className="font-bold text-gray-900">{attempt?.score ?? 0}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <FiCalendar className="w-4 h-4" />
                            {attempt?.date ?? "N/A"}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-gray-600">Attempt {attempt?.attempts ?? 0}</span>
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              attempt?.status === "Passed"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {attempt?.status ?? "Unknown"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <button className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold transition-colors">
                            <FiEye className="w-4 h-4" />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  } catch (error) {
                    console.error("Error rendering attempt row:", error);
                    return (
                      <tr key={idx} className="border-b border-gray-100">
                        <td colSpan="6" className="py-4 px-4 text-red-600">
                          Error loading attempt
                        </td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No attempt history yet. Start with an assessment!</p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("AttemptHistory Error:", error);
    return (
      <div className="bg-red-50 rounded-2xl shadow-md p-8 border border-red-200">
        <p className="text-red-700 font-semibold">Error loading attempt history</p>
        <p className="text-red-600 text-sm mt-2">{error?.message}</p>
      </div>
    );
  }
};

export default AttemptHistory;
