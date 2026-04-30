import React from "react";

// Aligned with the unified GradientCard palette.
const colorBar = {
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  pink: "bg-pink-500",
  orange: "bg-orange-500",
  green: "bg-emerald-500",
  indigo: "bg-indigo-500",
  red: "bg-red-500",
};

const SubjectSection = ({ subject, count = 0, avg, color = "purple", children }) => {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={`w-1.5 h-6 rounded-full ${colorBar[color] || colorBar.purple}`}
            aria-hidden="true"
          />
          <h2 className="text-lg font-semibold text-gray-900">{subject}</h2>
          <span className="text-xs text-gray-500">
            · {count} test{count !== 1 ? "s" : ""}
          </span>
        </div>
        {avg != null && (
          <span className="text-xs font-semibold text-gray-700 bg-white border border-gray-100 px-2.5 py-1 rounded-md shadow-sm">
            Avg {avg}%
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {children}
      </div>
    </section>
  );
};

export default SubjectSection;
