import React from "react";

// Softer, tonal gradients — keep the colour identity, dial back saturation contrast.
const gradients = {
  blue: "from-blue-500 to-blue-400",
  purple: "from-violet-500 to-violet-400",
  pink: "from-pink-500 to-pink-400",
  orange: "from-orange-500 to-orange-400",
  green: "from-emerald-500 to-emerald-400",
  red: "from-red-500 to-red-400",
  indigo: "from-indigo-500 to-indigo-400",
};

const GradientCard = ({
  icon: Icon,
  label,
  value,
  sublabel,
  color = "purple",
  progress,
  trend,
  onClick,
  className = "",
  children,
}) => {
  const Wrapper = onClick ? "button" : "div";
  const gradient = gradients[color] || gradients.purple;

  return (
    <Wrapper
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl p-4 h-[140px] text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 bg-gradient-to-br ${gradient} ${
        onClick ? "text-left w-full" : ""
      } ${className}`}
    >
      <div className="relative flex flex-col h-full">
        {/* Top row: icon + trend badge */}
        <div className="flex items-center justify-between">
          {Icon ? (
            <div className="bg-white/20 backdrop-blur-sm p-1.5 rounded-lg">
              <Icon className="w-5 h-5 text-white" />
            </div>
          ) : (
            <span />
          )}
          {trend != null && (
            <span className="text-[11px] font-semibold bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded">
              {trend}
            </span>
          )}
        </div>

        {/* Middle: number + label centered in remaining space */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          {value != null && (
            <p className="text-2xl md:text-3xl font-semibold tracking-tight leading-none">
              {value}
            </p>
          )}
          {label && (
            <p className="text-sm text-white/80 mt-1.5">{label}</p>
          )}
          {sublabel && (
            <p className="text-xs text-white/70 mt-0.5">{sublabel}</p>
          )}
          {children}
        </div>

        {/* Bottom: subtle progress bar */}
        {progress != null && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-white/70">Progress</span>
              <span className="text-xs font-semibold text-white/90">{progress}%</span>
            </div>
            <div className="h-1.5 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default GradientCard;
