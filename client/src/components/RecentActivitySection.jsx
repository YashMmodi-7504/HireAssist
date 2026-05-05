import React from "react";
import {
  FaBook,
  FaCheckCircle,
  FaAward,
  FaComment,
  FaClipboardCheck,
} from "react-icons/fa";

const RecentActivitySection = ({ activities }) => {
  const activityIcon = {
    lesson: FaBook,
    completion: FaCheckCircle,
    badge: FaAward,
    discussion: FaComment,
    quiz: FaClipboardCheck,
  };

  const activityColor = {
    lesson: "from-blue-500 to-blue-600",
    completion: "from-green-500 to-green-600",
    badge: "from-yellow-500 to-orange-600",
    discussion: "from-purple-500 to-pink-600",
    quiz: "from-red-500 to-orange-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h2>

      <div className="space-y-4">
        {activities.map((activity, idx) => {
          const Icon = activityIcon[activity.type] || FaBook;
          const color = activityColor[activity.type] || "from-gray-500 to-gray-600";

          return (
            <div key={idx} className="flex gap-4 pb-4 border-b last:border-b-0">
              <div
                className={`w-12 h-12 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white flex-shrink-0`}
              >
                <Icon className="text-lg" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">
                  {activity.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-400 mt-2">{activity.time}</p>
              </div>
            </div>
          );
        })}

        {activities.length === 0 && (
          <p className="text-gray-500 text-center py-6">
            No recent activity. Start learning!
          </p>
        )}
      </div>
    </div>
  );
};

export default RecentActivitySection;
