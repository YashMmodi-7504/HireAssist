import React from "react";

const variantMap = {
  neutral: "text-gray-700 bg-gray-100 border-gray-200",
  purple: "text-purple-700 bg-purple-50 border-purple-100",
  indigo: "text-indigo-700 bg-indigo-50 border-indigo-100",
  blue: "text-blue-700 bg-blue-50 border-blue-100",
  green: "text-green-700 bg-green-50 border-green-100",
  amber: "text-amber-700 bg-amber-50 border-amber-100",
  red: "text-red-700 bg-red-50 border-red-100",
  cyan: "text-cyan-700 bg-cyan-50 border-cyan-100",
};

const sizeMap = {
  xs: "text-[10px] px-2 py-0.5",
  sm: "text-[11px] px-2.5 py-0.5",
  md: "text-xs px-2.5 py-1",
};

const Badge = ({
  children,
  variant = "neutral",
  size = "sm",
  bordered = true,
  uppercase = false,
  icon: Icon,
  className = "",
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold rounded ${
        sizeMap[size] || sizeMap.sm
      } ${variantMap[variant] || variantMap.neutral} ${
        bordered ? "border" : "border border-transparent"
      } ${uppercase ? "uppercase tracking-wider" : ""} ${className}`}
    >
      {Icon ? <Icon className="w-3 h-3" /> : null}
      {children}
    </span>
  );
};

export default Badge;
