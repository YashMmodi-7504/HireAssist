import React, { useState } from "react";
import { FaChevronDown, FaCheckCircle } from "react-icons/fa";

const SaaSModuleCard = ({ module, onTopicToggle }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition-shadow duration-200">
      {/* Header - Always Stable */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 mb-3">{module.title}</h3>
          <div className="flex items-center gap-6">
            {/* Progress bar */}
            <div className="flex-1 max-w-xs">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-gray-600">Progress</span>
                <span className="text-sm font-bold text-purple-600 tabular-nums">{module.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${module.progress}%` }}
                />
              </div>
            </div>

            {/* Streak badge */}
            <div className="text-center px-4 py-2 bg-orange-50 rounded-xl flex-shrink-0 whitespace-nowrap">
              <p className="text-xs text-gray-600 font-medium">Streak</p>
              <p className="text-xl font-bold text-orange-600">{module.streak}🔥</p>
            </div>
          </div>
        </div>

        {/* Expand Button - Always Rendered, Never Removed */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg transition-colors duration-200 hover:bg-gray-100 p-0"
          aria-label={expanded ? "Collapse topics" : "Expand topics"}
        >
          <FaChevronDown
            className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Topics Section - Smooth Expand/Collapse with max-h */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          expanded ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-4">
            Topics
          </p>
          {module.topics.map((topic) => (
            <label
              key={topic.id}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors duration-200"
            >
              <input
                type="checkbox"
                checked={topic.completed}
                onChange={() => onTopicToggle(module.id, topic.id)}
                className="w-5 h-5 text-purple-600 rounded cursor-pointer accent-purple-600 flex-shrink-0"
              />
              <span
                className={`flex-1 font-medium text-sm transition-all duration-200 ${
                  topic.completed ? "line-through text-gray-400" : "text-gray-700"
                }`}
              >
                {topic.name}
              </span>
              {topic.completed && (
                <FaCheckCircle className="text-green-500 text-lg flex-shrink-0" />
              )}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SaaSModuleCard;
