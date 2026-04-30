import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiChevronDown, FiSearch, FiCheck, FiX } from "react-icons/fi";

const STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const StateSelect = ({
  value = null,
  onChange,
  placeholder = "Select state",
  error,
  options = STATES,
  clearable = true,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlight, setHighlight] = useState(0);
  const containerRef = useRef(null);
  const searchRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Reset + focus search when opening
  useEffect(() => {
    if (open) {
      setSearch("");
      // Pre-highlight the currently selected option, or first
      const idx = value ? Math.max(0, options.indexOf(value)) : 0;
      setHighlight(idx);
      setTimeout(() => searchRef.current?.focus(), 0);
    }
  }, [open, value, options]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? options.filter((s) => s.toLowerCase().includes(q)) : options;
  }, [search, options]);

  const select = (s) => {
    onChange?.(s);
    setOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(filtered.length - 1, h + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(0, h - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const s = filtered[highlight];
      if (s) select(s);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`w-full px-3 py-2 rounded-lg border bg-white text-left transition-all duration-200 focus:outline-none ${
          error
            ? "border-red-300 focus:ring-2 focus:ring-red-400 focus:border-transparent"
            : "border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`flex-1 text-sm truncate ${
              value ? "text-gray-900" : "text-gray-400"
            }`}
          >
            {value || placeholder}
          </span>
          {clearable && value && (
            <span
              role="button"
              tabIndex={-1}
              onClick={(e) => {
                e.stopPropagation();
                onChange?.(null);
              }}
              className="p-0.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer inline-flex"
              aria-label="Clear selection"
            >
              <FiX className="w-3.5 h-3.5" />
            </span>
          )}
          <FiChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {open && (
        <div
          className="absolute z-30 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
          role="listbox"
        >
          <div className="px-3 py-2 border-b border-gray-100 relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setHighlight(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search states…"
              className="w-full pl-7 pr-2 py-1.5 text-sm bg-transparent outline-none placeholder:text-gray-400"
            />
          </div>

          <div className="max-h-64 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-4 py-6 text-sm text-gray-500 text-center">
                No states match "{search}"
              </p>
            ) : (
              filtered.map((s, i) => {
                const sel = value === s;
                const active = i === highlight;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => select(s)}
                    onMouseEnter={() => setHighlight(i)}
                    role="option"
                    aria-selected={sel}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors duration-100 ${
                      sel
                        ? "bg-purple-500 text-white font-semibold"
                        : active
                        ? "bg-purple-100 text-purple-900"
                        : "text-gray-700 hover:bg-purple-50"
                    }`}
                  >
                    <span>{s}</span>
                    {sel && <FiCheck className="w-4 h-4" />}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StateSelect;
