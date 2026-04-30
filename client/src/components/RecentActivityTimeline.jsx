import React from "react";
import { formatTimestamp, getActivityIcon } from "../utils/helpers";

const RecentActivityTimeline = ({ recentActivity = [] }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        {recentActivity.length > 0 ? (
          <div className="space-y-4">
            {recentActivity.map((activity, idx) => {
              const { emoji, color, bgColor } = getActivityIcon(activity.type);

              return (
                <div
                  key={activity.id || idx}
                  className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  {/* Timeline dot and line */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center text-lg font-bold ${color}`}
                    >
                      {emoji}
                    </div>
                    {idx !== recentActivity.length - 1 && (
                      <div className="w-1 h-8 bg-gray-200 mt-2" />
                    )}
                  </div>

                  {/* Activity details */}
                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-gray-900">
                        {activity.type === "lesson_completed" && `Completed: ${activity.topic}`}
                        {activity.type === "quiz_attempted" && `Quiz: ${activity.module || "Assessment"}`}
                        {activity.type === "badge_earned" && `Earned: ${activity.badge}`}
                        {activity.type === "streak_milestone" && "Streak Milestone 🔥"}
                        {activity.type === "course_started" && `Started: ${activity.module}`}
                      </p>
                      <span className="text-xs text-gray-500 flex-shrink-0 whitespace-nowrap">
                        {formatTimestamp(activity.timestamp)}
                      </span>
                    </div>

                    {/* Additional info */}
                    <p className="text-sm text-gray-600 mt-1">
                      {activity.type === "lesson_completed" && `in ${activity.module || "Module"}`}
                      {activity.type === "quiz_attempted" && `Score: ${activity.score || "–"}%`}
                      {activity.type === "badge_earned" && `${activity.description || ""}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No recent activity yet</p>
            <p className="text-gray-500 text-sm mt-1">Start learning to see your activities here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivityTimeline;
