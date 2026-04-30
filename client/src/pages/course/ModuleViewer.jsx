import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaTimes, FaCheckCircle, FaLock, FaCircle, FaArrowRight } from "react-icons/fa";

const ModuleViewer = ({ module: passedModule, onClose }) => {
  const navigate = useNavigate();
  const { moduleId } = useParams();
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [topicCompletion, setTopicCompletion] = useState({});
  const [module, setModule] = useState(passedModule || null);

  // Get module from navigation state or props
  useEffect(() => {
    if (!module && typeof window !== "undefined") {
      // Try to get from navigation state
      const state = window.history.state;
      if (state?.module) {
        setModule(state.module);
      }
    }

    // Set first topic as selected by default
    if (module && !selectedTopicId) {
      setSelectedTopicId(module.topics[0]?.id);
    }

    // Disable background scroll
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [module, selectedTopicId]);

  // Initialize topic completion
  useEffect(() => {
    if (module) {
      const completion = {};
      module.topics.forEach((topic) => {
        completion[topic.id] = topic.completed || false;
      });
      setTopicCompletion(completion);
    }
  }, [module]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  const isTopicLocked = (topicIndex) => {
    if (topicIndex === 0) return false;
    const previousTopic = module.topics[topicIndex - 1];
    return !topicCompletion[previousTopic.id];
  };

  const handleMarkComplete = () => {
    if (selectedTopicId) {
      setTopicCompletion({
        ...topicCompletion,
        [selectedTopicId]: true,
      });
    }
  };

  const handleNextTopic = () => {
    const currentIndex = module.topics.findIndex((t) => t.id === selectedTopicId);
    if (currentIndex < module.topics.length - 1) {
      const nextTopic = module.topics[currentIndex + 1];
      if (!isTopicLocked(currentIndex + 1)) {
        setSelectedTopicId(nextTopic.id);
      }
    }
  };

  const currentTopic = module?.topics.find((t) => t.id === selectedTopicId);
  const completedCount = Object.values(topicCompletion).filter(Boolean).length;
  const progress = Math.round((completedCount / module?.topics.length) * 100);

  if (!module) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <p className="text-gray-500">Loading module...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex">
      {/* 🔷 LEFT SIDEBAR - TOPICS LIST */}
      <div className="w-1/3 bg-gradient-to-b from-purple-50 to-purple-100 border-r border-gray-200 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-40">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <FaTimes className="w-5 h-5 text-gray-700" />
          </button>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">{module.title}</h1>
          <p className="text-sm text-gray-600 mb-4">{module.description}</p>

          {/* Progress Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="w-full bg-gray-300 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            <span className="text-sm font-bold text-purple-600 whitespace-nowrap">
              {progress}%
            </span>
          </div>
        </div>

        {/* Topics List */}
        <div className="p-6 space-y-2">
          {module.topics.map((topic, index) => {
            const isLocked = isTopicLocked(index);
            const isCompleted = topicCompletion[topic.id];
            const isActive = selectedTopicId === topic.id;

            return (
              <button
                key={topic.id}
                onClick={() => !isLocked && setSelectedTopicId(topic.id)}
                disabled={isLocked}
                className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-white border-2 border-purple-500 shadow-lg"
                    : "bg-white border border-gray-200 hover:border-purple-300"
                } ${isLocked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <div className="flex items-start gap-3">
                  {/* Status Icon */}
                  <div className="mt-1 flex-shrink-0">
                    {isCompleted ? (
                      <FaCheckCircle className="w-5 h-5 text-green-500" />
                    ) : isLocked ? (
                      <FaLock className="w-5 h-5 text-gray-400" />
                    ) : (
                      <FaCircle className="w-5 h-5 text-gray-300" />
                    )}
                  </div>

                  {/* Topic Info */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-semibold text-sm ${
                        isActive
                          ? "text-purple-600"
                          : isCompleted
                          ? "text-green-600 line-through"
                          : "text-gray-900"
                      }`}
                    >
                      {topic.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">⏱️ {topic.duration}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 🔷 RIGHT SIDE - MAIN CONTENT */}
      <div className="w-2/3 bg-white overflow-y-auto">
        <div className="p-8 max-w-4xl">
          {currentTopic ? (
            <>
              {/* Topic Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {currentTopic.name}
                </h1>
                <p className="text-gray-600">⏱️ Duration: {currentTopic.duration}</p>
              </div>

              {/* Video / Content Section */}
              <div className="mb-8 bg-gray-200 rounded-2xl overflow-hidden h-96 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎥</div>
                  <p className="text-gray-600">Video content would appear here</p>
                  <p className="text-sm text-gray-500 mt-2">
                    {currentTopic.name} - Learning video
                  </p>
                </div>
              </div>

              {/* Description / Content */}
              <div className="mb-8 bg-purple-50 rounded-xl p-6 border border-purple-200">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Overview</h2>
                <p className="text-gray-700 leading-relaxed">
                  This is the "{currentTopic.name}" lesson. In a real application, this section
                  would contain detailed explanations, examples, and learning materials related
                  to this topic.
                </p>
              </div>

              {/* Notes / Key Points */}
              <div className="mb-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h2 className="text-xl font-bold text-gray-900 mb-3">📌 Key Points</h2>
                <ul className="space-y-2 text-gray-700">
                  <li>✓ This topic covers {currentTopic.name.toLowerCase()}</li>
                  <li>✓ Estimated time to complete: {currentTopic.duration}</li>
                  <li>✓ Part of the {module.title} module</li>
                  <li>✓ Mark as complete to unlock the next topic</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-8 border-t border-gray-200">
                {!topicCompletion[currentTopic.id] ? (
                  <button
                    onClick={handleMarkComplete}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <FaCheckCircle className="w-5 h-5" />
                    Mark as Complete
                  </button>
                ) : (
                  <div className="flex-1 px-6 py-3 bg-green-50 border-2 border-green-500 text-green-600 font-bold rounded-lg flex items-center justify-center gap-2">
                    <FaCheckCircle className="w-5 h-5" />
                    Completed ✓
                  </div>
                )}

                <button
                  onClick={handleNextTopic}
                  disabled={
                    module.topics.findIndex((t) => t.id === selectedTopicId) ===
                    module.topics.length - 1
                  }
                  className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                >
                  Next Topic
                  <FaArrowRight className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Select a topic to begin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleViewer;
