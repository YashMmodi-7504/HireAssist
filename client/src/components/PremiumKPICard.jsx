import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const PremiumKPICard = ({ icon: Icon, label, value, trend, color = "purple" }) => {
  const colorSchemes = {
    purple: {
      gradient: "from-purple-500 to-indigo-600",
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200",
      accent: "from-purple-400 to-purple-600",
    },
    blue: {
      gradient: "from-blue-500 to-cyan-600",
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
      accent: "from-blue-400 to-blue-600",
    },
    emerald: {
      gradient: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      accent: "from-emerald-400 to-emerald-600",
    },
    orange: {
      gradient: "from-orange-500 to-rose-600",
      bg: "bg-orange-50",
      text: "text-orange-700",
      border: "border-orange-200",
      accent: "from-orange-400 to-orange-600",
    },
  };

  const scheme = colorSchemes[color];
  const isPositiveTrend = trend >= 0;

  return (
    <div
      className={`relative group p-6 rounded-2xl border ${scheme.border} ${scheme.bg} backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer`}
    >
      {/* Animated gradient background on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${scheme.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
      />

      <div className="relative z-10">
        {/* Icon */}
        <div
          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${scheme.accent} flex items-center justify-center text-white mb-4 group-hover:shadow-lg transition-all duration-300 group-hover:scale-110`}
        >
          <Icon className="text-2xl" />
        </div>

        {/* Label */}
        <p className={`text-sm font-medium ${scheme.text} mb-1`}>{label}</p>

        {/* Value */}
        <p className="text-3xl font-bold text-gray-900 mb-3">{value}</p>

        {/* Trend */}
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-semibold ${
              isPositiveTrend
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isPositiveTrend ? (
              <FaArrowUp className="text-xs" />
            ) : (
              <FaArrowDown className="text-xs" />
            )}
            <span>{Math.abs(trend)}%</span>
          </div>
          <span className="text-xs text-gray-500">from last week</span>
        </div>
      </div>

      {/* Subtle shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 group-hover:translate-x-full transition-transform duration-700" />
    </div>
  );
};

export default PremiumKPICard;
