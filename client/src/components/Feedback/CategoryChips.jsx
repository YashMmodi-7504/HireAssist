import React from "react";

const CategoryChips = ({ options = [], selected, onChange, multi = false }) => {
  const isSelected = (opt) =>
    multi ? Array.isArray(selected) && selected.includes(opt) : selected === opt;

  const toggle = (opt) => {
    if (multi) {
      const arr = Array.isArray(selected) ? selected : [];
      if (arr.includes(opt)) onChange(arr.filter((x) => x !== opt));
      else onChange([...arr, opt]);
    } else {
      onChange(opt === selected ? null : opt);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = isSelected(opt);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200 active:scale-[0.97] ${
              active
                ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                : "bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:text-purple-700"
            }`}
            aria-pressed={active}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryChips;
