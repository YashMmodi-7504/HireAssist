import React from "react";

const PremiumStatsCardV2 = ({ icon: Icon, label, value, trend, color = "purple" }) => {
  const colorMap = {
    purple: {
      bg: "from-purple-50 to-purple-50/50",
      border: "border-purple-200",
      icon: "bg-purple-100 text-purple-600",
      trend: "bg-purple-50 text-purple-600",
    },
    blue: {
      bg: "from-blue-50 to-blue-50/50",
      border: "border-blue-200",
      icon: "bg-blue-100 text-blue-600",
      trend: "bg-blue-50 text-blue-600",
    },
    green: {
      bg: "from-green-50 to-green-50/50",
      border: "border-green-200",
      icon: "bg-green-100 text-green-600",
      trend: "bg-green-50 text-green-600",
    },
    orange: {
      bg: "from-orange-50 to-orange-50/50",
      border: "border-orange-200",
      icon: "bg-orange-100 text-orange-600",
      trend: "bg-orange-50 text-orange-600",
    },
  };

  const c = colorMap[color] || colorMap.purple;
  const trendColor = trend > 0 ? "text-green-600" : "text-red-600";
  const trendBg = trend > 0 ? "bg-green-50" : "bg-red-50";

  return (
    <div className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${c.bg} border ${c.border} p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer`}>
      {/* Animated glow on hover */}
      <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className={`w-14 h-14 rounded-xl ${c.icon} flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
            <Icon />
          </div>
          {trend !== 0 && (
            <span className={`text-sm font-bold px-3 py-1.5 rounded-lg whitespace-nowrap flex-shrink-0 ${trendBg} ${trendColor} flex items-center gap-1`}>
              {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
            </span>
          )}
        </div>

        <div className="mb-3">
          <p className="text-gray-600 text-sm font-semibold mb-1">{label}</p>
          <p className="text-4xl font-bold text-gray-900 tracking-tight">{value}</p>
        </div>

        {/* Hover underline */}
        <div className="h-1 w-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full group-hover:w-12 transition-all duration-300" />
      </div>
    </div>
  );
};

export default PremiumStatsCardV2;
