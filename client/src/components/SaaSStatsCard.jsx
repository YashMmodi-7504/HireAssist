import React from "react";

const SaaSStatsCard = ({ icon: Icon, label, value, trend }) => {
  const trendColor = trend > 0 ? "text-green-600" : "text-red-600";
  const trendBg = trend > 0 ? "bg-green-50" : "bg-red-50";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition-shadow duration-200">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center text-lg text-purple-600 flex-shrink-0">
          <Icon />
        </div>
        {trend !== 0 && (
          <span
            className={`text-sm font-semibold px-3 py-1 rounded-lg whitespace-nowrap flex-shrink-0 ${trendBg} ${trendColor}`}
          >
            {trend > 0 ? "+" : ""}{trend}%
          </span>
        )}
      </div>
      <p className="text-gray-600 text-sm font-medium mb-2 min-h-[20px]">{label}</p>
      <p className="text-3xl font-bold text-gray-900 tabular-nums">{value}</p>
    </div>
  );
};

export default SaaSStatsCard;
