import React from "react";

const Tabs = ({ tabs = [], activeId, onChange, className = "" }) => {
  return (
    <div
      role="tablist"
      className={`flex items-center gap-1 border-b border-gray-200 ${className}`}
    >
      {tabs.map((t) => {
        const Icon = t.icon;
        const active = t.id === activeId;
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange?.(t.id)}
            className={`relative inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
              active
                ? "text-purple-700"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {Icon && <Icon className="w-4 h-4" />}
            {t.label}
            {t.count != null && (
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                  active
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {t.count}
              </span>
            )}
            {active && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-t" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
