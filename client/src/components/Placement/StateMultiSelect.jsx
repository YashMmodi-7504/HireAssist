import React, { useEffect, useMemo, useRef, useState } from "react";
import { FiX, FiChevronDown, FiSearch, FiCheck } from "react-icons/fi";

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

const StateMultiSelect = ({ value = [], onChange, max = 3, error }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlight, setHighlight] = useState(0);
  const [showLimit, setShowLimit] = useState(false);
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

  // Auto-focus search and reset highlight when opening
  useEffect(() => {
    if (open) {
      setHighlight(0);
      setSearch("");
      // Defer focus to next tick so the input is mounted
      setTimeout(() => searchRef.current?.focus(), 0);
    }
  }, [open]);

  // Auto-clear the limit warning after a moment
  useEffect(() => {
    if (!showLimit) return undefined;
    const t = setTimeout(() => setShowLimit(false), 2200);
    return () => clearTimeout(t);
  }, [showLimit]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? STATES.filter((s) => s.toLowerCase().includes(q)) : STATES;
  }, [search]);

  const isSelected = (s) => value.includes(s);
  const isDisabled = (s) => !isSelected(s) && value.length >= max;

  const toggle = (s) => {
    if (isSelected(s)) {
      onChange?.(value.filter((x) => x !== s));
    } else if (value.length < max) {
      onChange?.([...value, s]);
    } else {
      setShowLimit(true);
    }
  };

  const remove = (s) => {
    onChange?.(value.filter((x) => x !== s));
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
      if (s) toggle(s);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger / chip box */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`w-full px-3 py-2 rounded-lg border bg-white text-left transition-all duration-200 focus:outline-none ${
          error
            ? "border-red-300 focus:ring-2 focus:ring-red-500"
            : "border-gray-300 hover:border-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
        }`}
      >
        <div className="flex items-center gap-2">
          <div className="flex flex-wrap gap-1.5 flex-1 min-w-0 py-0.5">
            {value.length === 0 ? (
              <span className="text-sm text-gray-400 py-1 px-1">
                Select up to {max} states
              </span>
            ) : (
              value.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {s}
                  <span
                    role="button"
                    tabIndex={-1}
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(s);
                    }}
                    className="hover:text-purple-900 transition-colors cursor-pointer inline-flex"
                    aria-label={`Remove ${s}`}
                  >
                    <FiX className="w-3 h-3" />
                  </span>
                </span>
              ))
            )}
          </div>
          <FiChevronDown
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {showLimit && (
        <p className="text-xs text-amber-700 mt-1.5 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Maximum {max} locations allowed
        </p>
      )}

      {/* Dropdown */}
      {open && (
        <div
          className="absolute z-30 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
          role="listbox"
        >
          {/* Search */}
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

          {/* Options */}
          <div className="max-h-64 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="px-4 py-6 text-sm text-gray-500 text-center">
                No states match "{search}"
              </p>
            ) : (
              filtered.map((s, i) => {
                const sel = isSelected(s);
                const dis = isDisabled(s);
                const active = i === highlight;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggle(s)}
                    onMouseEnter={() => setHighlight(i)}
                    disabled={dis}
                    role="option"
                    aria-selected={sel}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors duration-100 ${
                      sel
                        ? "bg-purple-50 text-purple-700 font-semibold"
                        : dis
                        ? "text-gray-300 cursor-not-allowed"
                        : active
                        ? "bg-gray-50 text-gray-900"
                        : "text-gray-700"
                    }`}
                  >
                    <span>{s}</span>
                    {sel && <FiCheck className="w-4 h-4 text-purple-600" />}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-3 py-2 border-t border-gray-100 flex items-center justify-between bg-gray-50">
            <span className="text-xs text-gray-500">
              <span className="font-semibold text-gray-700">{value.length}</span> of {max} selected
            </span>
            {value.length > 0 && (
              <button
                type="button"
                onClick={() => onChange?.([])}
                className="text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StateMultiSelect;
