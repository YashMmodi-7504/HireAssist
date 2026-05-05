import React from "react";

const variantMap = {
  primary:
    "text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 active:from-purple-800 active:to-indigo-800 shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(124,58,237,0.45)]",
  amber:
    "text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(245,158,11,0.4)]",
  ghost:
    "text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300",
  dark:
    "text-white bg-gray-900 hover:bg-gray-800 active:bg-gray-700",
};

const sizeMap = {
  sm: "px-3.5 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-sm",
};

const GradientButton = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  type = "button",
  disabled = false,
  className = "",
  fullWidth = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
        variantMap[variant] || variantMap.primary
      } ${sizeMap[size] || sizeMap.md} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default GradientButton;
