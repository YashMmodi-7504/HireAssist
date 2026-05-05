import React from "react";
import { FiCheckCircle, FiXCircle, FiClock, FiTarget, FiArrowRight } from "react-icons/fi";

const ResultView = ({ assessment, onRetake, onBack }) => {
  const result = assessment.result;

  const performanceLevel =
    result.score >= 90
      ? { label: "Outstanding", color: "text-green-600" }
      : result.score >= 75
      ? { label: "Good", color: "text-blue-600" }
      : result.score >= 60
      ? { label: "Average", color: "text-yellow-600" }
      : { label: "Needs Improvement", color: "text-red-600" };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <button onClick={onBack} className="text-purple-600 hover:text-purple-700 font-semibold mb-6 flex items-center gap-2">
          <FiArrowRight className="w-5 h-5 rotate-180" />
          Back to Assessments
        </button>

        {/* Main Result Card */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{assessment.title}</h1>
            <p className="text-gray-600">Test completed successfully</p>
          </div>

          {/* Score Highlight */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8 text-center mb-8 border border-purple-200">
            <p className="text-sm text-gray-600 font-semibold mb-2">Your Score</p>
            <p className={`text-6xl font-bold mb-3 ${performanceLevel.color}`}>{result.score}%</p>
            <p className={`text-lg font-semibold ${performanceLevel.color}`}>{performanceLevel.label}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <FiCheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-xs text-gray-600 font-semibold">Correct</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{result.correctCount}</p>
              <p className="text-sm text-gray-600">out of {result.totalQuestions}</p>
            </div>

            <div className="bg-red-50 rounded-xl p-4 border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <FiXCircle className="w-5 h-5 text-red-600" />
                <span className="text-xs text-gray-600 font-semibold">Incorrect</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{result.totalQuestions - result.correctCount}</p>
              <p className="text-sm text-gray-600">out of {result.totalQuestions}</p>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <FiTarget className="w-5 h-5 text-blue-600" />
                <span className="text-xs text-gray-600 font-semibold">Accuracy</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{result.accuracy}%</p>
              <p className="text-sm text-gray-600">of answers</p>
            </div>

            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <FiClock className="w-5 h-5 text-amber-600" />
                <span className="text-xs text-gray-600 font-semibold">Time Taken</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatTime(result.timeTaken)}</p>
              <p className="text-sm text-gray-600">to complete</p>
            </div>
          </div>
        </div>

        {/* Areas to Improve */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Areas to Improve</h2>
          <div className="space-y-3">
            {assessment.skills.map((skill, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-gray-900">{skill}</p>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">Practice</span>
                </div>
                <p className="text-sm text-gray-600">Review concepts and practice more problems related to {skill}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Skills */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Skills</h2>
          <div className="space-y-3">
            {assessment.skills.slice(0, 2).map((skill, idx) => (
              <div key={idx} className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-gray-900">{skill}</p>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Strong</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex gap-4">
          <button
            onClick={onRetake}
            className="flex-1 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all"
          >
            Retake Test
          </button>
          <button
            onClick={onBack}
            className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
          >
            View Solutions
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultView;
