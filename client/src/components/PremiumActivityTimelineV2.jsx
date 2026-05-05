import React from "react";
import { getActivityIcon, formatTimestamp } from "../utils/helpers";
import { FaBook, FaCheckCircle, FaTrophy, FaFire } from "react-icons/fa";

const PremiumActivityTimelineV2 = ({ recentActivity = [] }) => {
  const getActivityDetails = (activity) => {
    const icons = {
      lesson_completed: { icon: FaBook, color: "from-blue-500 to-cyan-500", label: "Lesson Completed" },
      quiz_attempted: { icon: FaCheckCircle, color: "from-purple-500 to-pink-500", label: "Quiz Attempted" },
      badge_earned: { icon: FaTrophy, color: "from-yellow-500 to-orange-500", label: "Badge Earned" },
      course_started: { icon: FaFire, color: "from-indigo-500 to-purple-500", label: "Course Started" },
      streak_milestone: { icon: FaFire, color: "from-red-500 to-orange-500", label: "Streak Milestone" },
    };
    return icons[activity.type] || icons.lesson_completed;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Recent Activity</h2>
        <p className="text-gray-600">Your learning journey timeline</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-md">
        <div className="space-y-8">
          {recentActivity.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg font-medium">No recent activity yet. Start learning! 🚀</p>
            </div>
          ) : (
            recentActivity.map((activity, idx) => {
              const { icon: IconComponent, color, label } = getActivityDetails(activity);
              const isLast = idx === recentActivity.length - 1;

              return (
                <div key={activity.id} className="relative flex gap-6">
                  {/* Timeline Line */}
                  {!isLast && (
                    <div className="absolute left-6 top-16 w-0.5 h-12 bg-gradient-to-b from-purple-200 to-transparent" />
                  )}

                  {/* Icon */}
                  <div className="relative flex-shrink-0">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-bold text-gray-900 text-base mb-1">{label}</p>

                        {/* Activity Details */}
                        {activity.module && (
                          <p className="text-gray-700 font-medium">
                            {activity.topic ? `${activity.topic} in` : ""} <span className="text-purple-600">{activity.module}</span>
                          </p>
                        )}

                        {activity.score && (
                          <p className="text-gray-600 text-sm mt-1">
                            Score: <span className="font-bold text-green-600">{activity.score}%</span>
                          </p>
                        )}

                        {activity.badge && (
                          <p className="text-gray-600 text-sm mt-1">
                            Unlocked: <span className="font-bold">{activity.badge}</span>
                          </p>
                        )}

                        <p className="text-gray-500 text-xs mt-2 font-medium">{activity.timestamp}</p>
                      </div>

                      {/* Achievement Badge */}
                      {(activity.type === "badge_earned" || activity.type === "streak_milestone") && (
                        <div className="flex-shrink-0 px-3 py-1.5 rounded-full bg-yellow-50 border border-yellow-200">
                          <p className="text-sm font-bold text-yellow-700">✨ Achievement</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Load More Button */}
      {recentActivity.length > 0 && (
        <div className="text-center">
          <button className="px-8 py-3 rounded-lg border-2 border-purple-400 text-purple-700 font-semibold hover:bg-purple-50 transition-all duration-200">
            View Full History
          </button>
        </div>
      )}
    </div>
  );
};

export default PremiumActivityTimelineV2;
