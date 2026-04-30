import React, { useState } from "react";
import { FaPlay, FaCheckCircle, FaClock, FaChevronDown } from "react-icons/fa";

const ModuleCard = ({ module, onTopicToggle }) => {
  const [expanded, setExpanded] = useState(false);
  const completedTopics = module.topics.filter((t) => t.completed).length;
  const completionPercentage = Math.round(
    (completedTopics / module.topics.length) * 100
  );

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              {module.title}
            </h3>
            <p className="text-sm text-gray-500">
              {module.topics.length} topics • {module.status}
            </p>
          </div>
          <span className="text-2xl font-bold text-purple-600">
            {module.progress}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
            style={{ width: `${module.progress}%` }}
          />
        </div>

        {/* Stats */}
        <div className="flex gap-4 text-sm mb-4">
          <div className="flex items-center gap-1 text-green-600">
            <FaCheckCircle className="text-xs" />
            <span>{completedTopics} completed</span>
          </div>
          <div className="flex items-center gap-1 text-orange-600">
            <FaClock className="text-xs" />
            <span>{module.topics.length - completedTopics} remaining</span>
          </div>
        </div>

        {/* Expand Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-4 py-2 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all text-purple-600 font-medium"
        >
          <span className="flex items-center gap-2">
            <FaPlay className="text-xs" />
            {expanded ? "Hide Topics" : "View Topics"}
          </span>
          <FaChevronDown
            className={`transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>

        {/* Topics List */}
        {expanded && (
          <div className="mt-4 space-y-2 border-t pt-4">
            {module.topics.map((topic) => (
              <div
                key={topic.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all"
              >
                <input
                  type="checkbox"
                  checked={topic.completed}
                  onChange={() => onTopicToggle(module.id, topic.id)}
                  className="w-5 h-5 text-purple-600 rounded cursor-pointer"
                />
                <span
                  className={`flex-1 ${
                    topic.completed
                      ? "text-gray-400 line-through"
                      : "text-gray-700"
                  }`}
                >
                  {topic.name}
                </span>
                {topic.completed && (
                  <FaCheckCircle className="text-green-500 text-sm" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleCard;
