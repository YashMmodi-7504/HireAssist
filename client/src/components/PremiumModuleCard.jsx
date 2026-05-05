import React, { useState } from "react";
import {
  FaPlay,
  FaCheckCircle,
  FaClock,
  FaLock,
  FaChevronDown,
  FaFire,
} from "react-icons/fa";

const PremiumModuleCard = ({ module, onTopicToggle }) => {
  const [expanded, setExpanded] = useState(false);
  const completedTopics = module.topics.filter((t) => t.completed).length;
  const isCompleted = module.progress === 100;
  const isLocked = module.progress === 0;

  const lockStatus = module.topics.map((t, i) => ({
    ...t,
    locked: i > completedTopics,
  }));

  return (
    <div
      className={`group relative rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-2xl ${
        isCompleted
          ? "border-emerald-200 bg-emerald-50"
          : "border-gray-200 bg-white hover:border-purple-200"
      }`}
    >
      {/* Gradient overlay on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-r from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-bold text-gray-900">{module.title}</h3>
              {isCompleted && (
                <div className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold flex items-center gap-1">
                  <FaCheckCircle className="text-sm" />
                  Completed
                </div>
              )}
              {isLocked && (
                <div className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold flex items-center gap-1">
                  <FaLock className="text-sm" />
                  Locked
                </div>
              )}
            </div>
            <p className="text-sm text-gray-600">
              {module.topics.length} topics • {module.status}
            </p>
          </div>
          <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {module.progress}%
          </span>
        </div>

        {/* Progress Bar with Animation */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${module.progress}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 text-sm mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <FaCheckCircle className="text-emerald-600 text-lg" />
            <div>
              <p className="text-xs text-gray-600">Completed</p>
              <p className="font-semibold text-gray-900">{completedTopics}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FaClock className="text-orange-600 text-lg" />
            <div>
              <p className="text-xs text-gray-600">Remaining</p>
              <p className="font-semibold text-gray-900">
                {module.topics.length - completedTopics}
              </p>
            </div>
          </div>
          {module.streak && (
            <div className="flex items-center gap-2">
              <FaFire className="text-red-600 text-lg" />
              <div>
                <p className="text-xs text-gray-600">Streak</p>
                <p className="font-semibold text-gray-900">{module.streak} days</p>
              </div>
            </div>
          )}
        </div>

        {/* Expand Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 transition-all duration-300 text-purple-700 font-semibold group/btn"
        >
          <span className="flex items-center gap-2">
            <FaPlay className="text-xs group-hover/btn:translate-x-1 transition-transform" />
            {expanded ? "Hide Topics" : "View Topics"}
          </span>
          <FaChevronDown
            className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
          />
        </button>

        {/* Topics List - Expandable */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 animate-in fade-in duration-300">
            {lockStatus.map((topic, idx) => (
              <div
                key={topic.id}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                  topic.locked
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50 cursor-pointer"
                }`}
              >
                {topic.locked ? (
                  <FaLock className="text-gray-400 text-sm" />
                ) : (
                  <input
                    type="checkbox"
                    checked={topic.completed}
                    onChange={() => onTopicToggle(module.id, topic.id)}
                    className="w-5 h-5 text-purple-600 rounded cursor-pointer accent-purple-600"
                  />
                )}
                <span
                  className={`flex-1 ${
                    topic.completed
                      ? "text-gray-400 line-through"
                      : "text-gray-700 font-medium"
                  }`}
                >
                  {topic.name}
                </span>
                {topic.completed && (
                  <FaCheckCircle className="text-emerald-500 text-sm" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PremiumModuleCard;
