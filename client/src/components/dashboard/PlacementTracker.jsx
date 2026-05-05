import React, { useEffect, useState } from "react";
import {
  FiSend,
  FiCheckCircle,
  FiVideo,
  FiAward,
  FiXCircle,
} from "react-icons/fi";

const STAGE_TONES = {
  applied: {
    bar: "from-blue-500 to-indigo-500",
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  shortlisted: {
    bar: "from-purple-500 to-violet-500",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  interview: {
    bar: "from-amber-500 to-orange-500",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  selected: {
    bar: "from-emerald-500 to-teal-500",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
};

const statusBadge = {
  Applied: "text-blue-700 bg-blue-50",
  Shortlisted: "text-purple-700 bg-purple-50",
  Rejected: "text-red-700 bg-red-50",
  Interview: "text-amber-700 bg-amber-50",
  Selected: "text-emerald-700 bg-emerald-50",
};

const PlacementTracker = ({ stats = {}, recent = [], onCompanyClick }) => {
  // 4-stage funnel: every later stage is a subset of "applied", so use applied
  // as the denominator for bar widths. Falls back to 1 to avoid div-by-zero.
  const applied = Math.max(1, stats.applied ?? 0);
  const stages = [
    {
      key: "applied",
      label: "Applied",
      value: stats.applied ?? 0,
      icon: FiSend,
    },
    {
      key: "shortlisted",
      label: "Shortlisted",
      value: stats.shortlisted ?? 0,
      icon: FiCheckCircle,
    },
    {
      key: "interview",
      label: "Interview",
      value: stats.interview ?? 0,
      icon: FiVideo,
    },
    {
      key: "selected",
      label: "Selected",
      value: stats.selected ?? 0,
      icon: FiAward,
    },
  ];

  // Bars animate from 0 to target on mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 h-full">
      <div className="flex items-start justify-between mb-5 gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Placement Tracker</h3>
          <p className="text-xs text-gray-500 mt-0.5">Application funnel</p>
        </div>
        {stats.rejected != null && (
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-red-700 bg-red-50 border border-red-100 rounded-full px-2.5 py-1">
            <FiXCircle className="w-3 h-3" />
            {stats.rejected} rejected
          </span>
        )}
      </div>

      {/* Funnel */}
      <div className="space-y-3 mb-6">
        {stages.map((stage) => {
          const tone = STAGE_TONES[stage.key];
          const Icon = stage.icon;
          const pct = (stage.value / applied) * 100;
          return (
            <div key={stage.key}>
              <div className="flex items-center justify-between mb-1.5 gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`inline-flex p-1.5 rounded-lg ${tone.iconBg} ${tone.iconColor} flex-shrink-0`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {stage.label}
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900 tabular-nums">
                  {stage.value}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${tone.bar} rounded-full transition-[width] duration-1000 ease-out`}
                  style={{ width: `${mounted ? pct : 0}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent applications */}
      <div>
        <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-3">
          Recent
        </p>
        <div className="space-y-2.5">
          {recent.length === 0 && (
            <p className="text-sm text-gray-500">No recent applications</p>
          )}
          {recent.map((r) => (
            <button
              type="button"
              key={r.id}
              onClick={() => onCompanyClick?.(r)}
              className="w-full flex items-center justify-between gap-3 px-2 py-1.5 -mx-2 rounded-lg hover:bg-purple-50/40 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300"
            >
              <span className="text-sm text-gray-800 truncate">{r.company}</span>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                  statusBadge[r.status] || "text-gray-700 bg-gray-50"
                }`}
              >
                {r.status}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlacementTracker;
