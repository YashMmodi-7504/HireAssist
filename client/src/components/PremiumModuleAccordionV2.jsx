import React, { useState } from "react";
import { FiChevronDown, FiLock, FiCheck, FiZap } from "react-icons/fi";

const PremiumModuleAccordionV2 = ({ modules = [], onTopicToggle }) => {
  const [expandedModule, setExpandedModule] = useState(0);

  const getProgressColor = (progress) => {
    if (progress === 0) return "from-gray-400 to-gray-500";
    if (progress < 25) return "from-red-400 to-red-500";
    if (progress < 50) return "from-orange-400 to-orange-500";
    if (progress < 75) return "from-yellow-400 to-yellow-500";
    return "from-green-400 to-green-500";
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Learning Modules</h2>
        <p className="text-gray-600">Master topics and unlock new content</p>
      </div>

      <div className="space-y-3">
        {modules.map((module, idx) => (
          <div key={module.id} className="group">
            {/* Module Header */}
            <button
              onClick={() => setExpandedModule(expandedModule === idx ? -1 : idx)}
              className="w-full px-6 py-4 bg-white border border-gray-200 rounded-2xl hover:border-purple-300 hover:shadow-lg transition-all duration-300 group/header"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {/* Module Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getProgressColor(module.progress)} flex items-center justify-center text-white font-bold group-hover/header:scale-110 transition-transform`}>
                    {Math.ceil(module.progress / 25)}
                  </div>

                  <div className="text-left">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{module.title}</h3>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">
                        {module.topics.filter(t => t.completed).length}/{module.topics.length} topics
                      </span>
                      {module.streak > 0 && (
                        <span className="flex items-center gap-1 text-orange-600 font-semibold">
                          🔥 {module.streak} day streak
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Progress Ring */}
                  <div className="hidden md:block text-right">
                    <p className="text-2xl font-bold text-gray-900">{module.progress}%</p>
                    <p className="text-xs text-gray-500 font-semibold">Complete</p>
                  </div>

                  {/* Chevron */}
                  <FiChevronDown
                    className={`text-gray-400 text-2xl transition-transform duration-300 group-hover/header:text-purple-600 ${
                      expandedModule === idx ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${getProgressColor(module.progress)} transition-all duration-500`}
                  style={{ width: `${module.progress}%` }}
                />
              </div>
            </button>

            {/* Module Content (Expanded) */}
            {expandedModule === idx && (
              <div className="mt-2 bg-gradient-to-br from-purple-50/50 to-blue-50/50 border border-purple-100 rounded-2xl p-6 space-y-3 animate-in fade-in duration-200">
                {module.topics.map((topic) => (
                  <div
                    key={topic.id}
                    className={`group/topic flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                      topic.locked
                        ? "bg-gray-50 opacity-60 cursor-not-allowed"
                        : "bg-white hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 hover:shadow-md cursor-pointer border border-gray-200 hover:border-purple-200"
                    }`}
                  >
                    {/* Checkbox/Lock Icon */}
                    <button
                      onClick={() => !topic.locked && onTopicToggle?.(module.id, topic.id)}
                      className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all duration-200 ${
                        topic.locked
                          ? "border-gray-300 bg-gray-100 cursor-not-allowed"
                          : topic.completed
                          ? "border-green-500 bg-green-500"
                          : "border-gray-300 hover:border-purple-400 group-hover/topic:border-purple-400"
                      }`}
                      disabled={topic.locked}
                    >
                      {topic.locked ? (
                        <FiLock className="w-3 h-3 text-gray-500" />
                      ) : topic.completed ? (
                        <FiCheck className="w-4 h-4 text-white" />
                      ) : null}
                    </button>

                    {/* Topic Info */}
                    <div className="flex-1">
                      <p
                        className={`font-semibold transition-colors ${
                          topic.locked ? "text-gray-500" : topic.completed ? "text-gray-600 line-through" : "text-gray-900"
                        }`}
                      >
                        {topic.name}
                      </p>
                      {topic.locked && (
                        <p className="text-xs text-gray-500 mt-1">Complete previous topic to unlock</p>
                      )}
                    </div>

                    {/* XP Badge */}
                    {!topic.locked && (
                      <div
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-bold text-sm transition-all duration-200 ${
                          topic.completed
                            ? "bg-gray-100 text-gray-600"
                            : "bg-yellow-50 text-yellow-700 group-hover/topic:bg-yellow-100"
                        }`}
                      >
                        <FiZap className="w-4 h-4" />
                        {topic.xpReward} XP
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PremiumModuleAccordionV2;
