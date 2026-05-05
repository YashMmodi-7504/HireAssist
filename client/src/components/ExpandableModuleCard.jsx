import React, { useState } from "react";
import { FaChevronDown, FaLock, FaStar, FaClock, FaCheckCircle } from "react-icons/fa";
import { isTopicLocked } from "../utils/helpers";

const ExpandableModuleCard = ({ module, onTopicToggle, onTopicClick }) => {
  const [expanded, setExpanded] = useState(false);
  const completedTopics = module.topics.filter(t => t.completed).length;
  const totalTopics = module.topics.length;

  const handleTopicToggle = (topicId) => {
    if (onTopicToggle) {
      onTopicToggle(module.id, topicId);
    }
    if (onTopicClick) {
      onTopicClick(module.id, topicId);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Module Header */}
      <div
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 mb-3">{module.title}</h3>

            {/* Stats Row */}
            <div className="flex items-center gap-6 flex-wrap">
              {/* Progress */}
              <div className="flex-1 min-w-max">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-gray-600">Progress</span>
                  <span className="text-sm font-bold text-purple-600">{module.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden max-w-xs">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${module.progress}%` }}
                  />
                </div>
              </div>

              {/* Topics */}
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-gray-900">{completedTopics}/{totalTopics}</span>
                <span className="text-gray-600">Topics</span>
              </div>

              {/* Streak */}
              <div className="flex items-center gap-2 px-3 py-1 bg-orange-50 rounded-lg">
                <span className="text-orange-600 font-bold">{module.streak}🔥</span>
              </div>

              {/* Time */}
              {module.estimatedTime && (
                <div className="flex items-center gap-1 text-gray-600 text-sm">
                  <FaClock className="w-4 h-4" />
                  <span>~{module.estimatedTime}h left</span>
                </div>
              )}
            </div>
          </div>

          {/* Expand Button */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors duration-200 p-0"
          >
            <FaChevronDown
              className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Topics List (Expanded) */}
      <div
        className={`transition-all duration-300 overflow-hidden ${
          expanded ? "max-h-96 border-t border-gray-200" : "max-h-0"
        }`}
      >
        <div className="p-6 space-y-3 bg-gray-50">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-4">Topics</p>

          {module.topics.map((topic) => {
            const topicLocked = isTopicLocked(topic, module);

            return (
              <div
                key={topic.id}
                className={`flex items-center gap-3 p-4 rounded-xl transition-all duration-200 ${
                  topicLocked
                    ? "bg-gray-200/50 cursor-not-allowed opacity-60"
                    : "bg-white hover:bg-purple-50 hover:border-purple-200 cursor-pointer border border-gray-200"
                }`}
              >
                {/* Checkbox or Lock */}
                {topicLocked ? (
                  <div className="flex-shrink-0">
                    <FaLock className="w-5 h-5 text-gray-400" />
                  </div>
                ) : (
                  <input
                    type="checkbox"
                    checked={topic.completed}
                    onChange={() => handleTopicToggle(topic.id)}
                    className="w-5 h-5 text-purple-600 rounded cursor-pointer accent-purple-600 flex-shrink-0"
                    disabled={topicLocked}
                  />
                )}

                {/* Topic Name */}
                <span
                  className={`flex-1 font-medium text-sm transition-all duration-200 ${
                    topic.completed ? "line-through text-gray-400" : "text-gray-700"
                  }`}
                >
                  {topic.name}
                </span>

                {/* XP Reward */}
                {topic.xpReward && (
                  <div className="flex items-center gap-1 text-yellow-600 text-sm flex-shrink-0">
                    <FaStar className="w-4 h-4" />
                    <span className="font-bold">{topic.xpReward}</span>
                  </div>
                )}

                {/* Completion Status */}
                {topic.completed ? (
                  <FaCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                ) : topicLocked ? (
                  <div
                    className="text-xs text-gray-500 flex-shrink-0"
                    title="Complete previous topic to unlock"
                  >
                    🔒
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExpandableModuleCard;
