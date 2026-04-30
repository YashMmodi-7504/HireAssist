import React, { useState } from "react";
import { FiStar } from "react-icons/fi";

const sizeMap = {
  sm: "w-5 h-5",
  md: "w-7 h-7",
  lg: "w-9 h-9",
};

const labels = ["Poor", "Fair", "Good", "Great", "Excellent"];

const RatingStars = ({ value = 0, onChange, max = 5, size = "md", showLabel = true }) => {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="inline-flex gap-1.5" onMouseLeave={() => setHover(0)}>
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => {
          const active = n <= display;
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange?.(n === value ? 0 : n)}
              onMouseEnter={() => setHover(n)}
              className="transition-transform duration-150 hover:scale-110 active:scale-95"
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
            >
              <FiStar
                className={`${sizeMap[size] || sizeMap.md} transition-colors duration-200 ${
                  active ? "fill-amber-400 text-amber-400" : "text-gray-300"
                }`}
              />
            </button>
          );
        })}
      </div>
      {showLabel && display > 0 && (
        <span className="text-sm font-semibold text-gray-700">
          {labels[display - 1] || ""}
        </span>
      )}
    </div>
  );
};

export default RatingStars;
