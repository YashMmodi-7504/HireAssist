import React, { useEffect, useState } from "react";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiMinus,
  FiCpu,
  FiCode,
  FiLayers,
  FiTarget,
  FiMessageSquare,
  FiBookOpen,
} from "react-icons/fi";

// Pick a sensible icon when one isn't supplied on the skill record.
const ICON_BY_KEYWORD = [
  { match: /algorithm|dsa|data struct/i, Icon: FiLayers },
  { match: /algo/i, Icon: FiCpu },
  { match: /web|html|css|react|frontend/i, Icon: FiCode },
  { match: /aptitude|reasoning/i, Icon: FiTarget },
  { match: /communicat|english|soft/i, Icon: FiMessageSquare },
];
const fallbackIcon = (name) => {
  const hit = ICON_BY_KEYWORD.find((r) => r.match.test(name || ""));
  return hit ? hit.Icon : FiBookOpen;
};

// Tonal tier per value — matches the existing color scale, swapped to gradients.
const tierFor = (value) => {
  if (value >= 85)
    return {
      bar: "from-emerald-500 to-teal-500",
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    };
  if (value >= 70)
    return {
      bar: "from-purple-500 to-indigo-500",
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    };
  if (value >= 50)
    return {
      bar: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    };
  return {
    bar: "from-amber-500 to-orange-500",
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  };
};

const trendChip = (delta) => {
  if (delta == null)
    return { Icon: FiMinus, label: "—", classes: "text-gray-500 bg-gray-50" };
  if (delta > 0)
    return {
      Icon: FiTrendingUp,
      label: `+${delta}`,
      classes: "text-emerald-700 bg-emerald-50",
    };
  if (delta < 0)
    return {
      Icon: FiTrendingDown,
      label: `${delta}`,
      classes: "text-red-700 bg-red-50",
    };
  return { Icon: FiMinus, label: "0", classes: "text-gray-600 bg-gray-50" };
};

const SkillDistribution = ({ skills = [], onSkillClick }) => {
  // Bars start at 0 and animate to their target value on mount.
  // Triggered via `mounted` flag so the CSS width transition runs.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  const interactive = typeof onSkillClick === "function";

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 h-full">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Skill Distribution</h3>
          <p className="text-xs text-gray-500 mt-0.5">Performance by skill area</p>
        </div>
        {interactive && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full">
            Click to ask AI
          </span>
        )}
      </div>

      <div className="space-y-4">
        {skills.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-8">No skill data yet</p>
        )}
        {skills.map((s) => {
          const tier = tierFor(s.value);
          const Icon = s.icon || fallbackIcon(s.name);
          const trend = trendChip(s.delta);
          const Wrapper = interactive ? "button" : "div";
          return (
            <Wrapper
              type={interactive ? "button" : undefined}
              key={s.name}
              onClick={interactive ? () => onSkillClick(s) : undefined}
              className={`block w-full text-left ${
                interactive
                  ? "rounded-lg -mx-2 px-2 py-1.5 hover:bg-purple-50/40 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300"
                  : ""
              }`}
            >
              <div className="flex items-center justify-between mb-1.5 gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`inline-flex p-1.5 rounded-lg ${tier.iconBg} ${tier.iconColor} flex-shrink-0`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-sm font-medium text-gray-700 truncate">
                    {s.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded ${trend.classes}`}
                  >
                    <trend.Icon className="w-2.5 h-2.5" />
                    {trend.label}
                  </span>
                  <span className="text-xs font-semibold text-gray-700 tabular-nums">
                    {s.value}%
                  </span>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${tier.bar} rounded-full transition-[width] duration-1000 ease-out`}
                  style={{ width: `${mounted ? s.value : 0}%` }}
                />
              </div>
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
};

export default SkillDistribution;
