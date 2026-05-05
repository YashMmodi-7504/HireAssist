import React from "react";

const colorMap = {
  purple: "bg-purple-500",
  indigo: "bg-indigo-500",
  blue: "bg-blue-500",
  green: "bg-green-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
  gradient: "bg-gradient-to-r from-purple-500 to-indigo-500",
};

const sizeMap = {
  xs: "h-1",
  sm: "h-1.5",
  md: "h-2",
  lg: "h-2.5",
};

const autoColor = (value) => {
  if (value >= 85) return "green";
  if (value >= 75) return "amber";
  if (value >= 50) return "purple";
  return "red";
};

const ProgressBar = ({
  value = 0,
  max = 100,
  color,
  size = "sm",
  className = "",
  trackClassName = "",
  ariaLabel,
}) => {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const palette = color ?? autoColor(pct);
  const fillColor = colorMap[palette] || colorMap.purple;

  return (
    <div
      className={`w-full ${sizeMap[size] || sizeMap.sm} bg-gray-100 rounded-full overflow-hidden ${trackClassName}`}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
    >
      <div
        className={`h-full ${fillColor} rounded-full transition-all duration-700 ease-out ${className}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

export default ProgressBar;
