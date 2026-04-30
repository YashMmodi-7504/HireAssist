import React from "react";
import { FiActivity } from "react-icons/fi";

const RecentActivity = ({ items = [] }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <p className="text-xs text-gray-500 mt-0.5">Last attempted tests</p>
        </div>
        <FiActivity className="w-5 h-5 text-gray-400" />
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">
          No activity yet
        </p>
      ) : (
        <div className="divide-y divide-gray-100">
          {items.map((item) => (
            <div
              key={item.id}
              className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {item.title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 truncate">
                  {item.subject} · {item.timeAgo}
                </p>
              </div>
              {item.score != null ? (
                <span className="text-sm font-semibold text-gray-900 flex-shrink-0">
                  {item.score}%
                </span>
              ) : (
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded flex-shrink-0">
                  In Progress
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
