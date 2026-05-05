import React from "react";
import { FiClock } from "react-icons/fi";

const statusStyle = {
  urgent: "text-red-700 bg-red-50 border-red-100",
  soon: "text-amber-700 bg-amber-50 border-amber-100",
  later: "text-gray-700 bg-gray-50 border-gray-200",
};

const UpcomingDeadlines = ({ items = [], onItemClick }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
          <p className="text-xs text-gray-500 mt-0.5">Don't miss these</p>
        </div>
        <FiClock className="w-5 h-5 text-gray-400" />
      </div>

      <div className="divide-y divide-gray-100">
        {items.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-6">No upcoming deadlines</p>
        )}
        {items.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => onItemClick?.(item)}
            className="w-full text-left py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 hover:bg-purple-50/40 -mx-2 px-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
              <p className="text-xs text-gray-500 mt-0.5 truncate">{item.course}</p>
            </div>
            <span
              className={`text-[11px] font-semibold px-2 py-1 rounded-md border whitespace-nowrap ${
                statusStyle[item.status] || statusStyle.later
              }`}
            >
              {item.due}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default UpcomingDeadlines;
