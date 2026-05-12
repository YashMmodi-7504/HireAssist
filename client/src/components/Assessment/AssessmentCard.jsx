import React from "react";
import {
  FiClock,
  FiHelpCircle,
  FiAward,
  FiArrowRight,
  FiRotateCcw,
  FiTrendingUp,
  FiZap,
  FiStar,
} from "react-icons/fi";
import ProgressBar from "../ui/ProgressBar";

const difficultyStyle = {
  easy: "text-green-700 bg-green-50 border-green-100",
  medium: "text-amber-700 bg-amber-50 border-amber-100",
  hard: "text-red-700 bg-red-50 border-red-100",
};

const statusStyle = {
  completed: { label: "Completed", className: "text-green-700 bg-green-50" },
  "in-progress": { label: "In Progress", className: "text-amber-700 bg-amber-50" },
  "not-started": { label: "Not Started", className: "text-gray-600 bg-gray-100" },
};

// All CTAs share the same purple→indigo brand gradient — no more black
// "View Result" button. Completed cards now offer a clear "Retake test"
// path so the engine can be re-launched without leaving the dashboard.
const ctaStyle = {
  completed: {
    label: "Retake test",
    icon: FiRotateCcw,
    className:
      "text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 border border-transparent shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(124,58,237,0.45)]",
  },
  "in-progress": {
    label: "Resume",
    icon: FiRotateCcw,
    className:
      "text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 border border-transparent shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(59,130,246,0.45)]",
  },
  "not-started": {
    label: "Start test",
    icon: FiArrowRight,
    className:
      "text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 border border-transparent shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(124,58,237,0.45)]",
  },
};

// User-facing difficulty labels. Data still uses "easy"/"medium"/"hard"
// internally (for filter values + bank keys) but the rendered text is the
// friendlier set.
const DIFFICULTY_LABEL = {
  easy: "Easy",
  medium: "Intermediate",
  hard: "Hard",
};

const tagStyle = {
  recommended: {
    label: "Recommended",
    icon: FiStar,
    className:
      "text-purple-700 bg-purple-50 border-purple-200",
  },
  trending: {
    label: "Trending",
    icon: FiTrendingUp,
    className: "text-orange-700 bg-orange-50 border-orange-200",
  },
  "high-scoring": {
    label: "High Scoring",
    icon: FiZap,
    className: "text-green-700 bg-green-50 border-green-200",
  },
};

// Subject accent strip — mirrors the unified gradient palette.
const accentStripStyle = {
  blue: "bg-gradient-to-r from-blue-500 to-cyan-500",
  purple: "bg-gradient-to-r from-purple-500 to-indigo-500",
  pink: "bg-gradient-to-r from-pink-500 to-rose-500",
  orange: "bg-gradient-to-r from-orange-500 to-amber-500",
  green: "bg-gradient-to-r from-emerald-500 to-teal-500",
  indigo: "bg-gradient-to-r from-indigo-500 to-blue-500",
};

const AssessmentCard = ({ assessment, onAction, accentColor = "purple" }) => {
  const a = assessment || {};
  const status = statusStyle[a.status] || statusStyle["not-started"];
  const cta = ctaStyle[a.status] || ctaStyle["not-started"];
  const diff = difficultyStyle[a.difficulty] || difficultyStyle.medium;
  const tag = a.tag ? tagStyle[a.tag] : null;
  const CtaIcon = cta.icon;
  const TagIcon = tag?.icon;
  const stripClass = accentStripStyle[accentColor] || accentStripStyle.purple;

  return (
    <div className="group bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-[0_12px_32px_-12px_rgba(124,58,237,0.25)] hover:border-purple-200 hover:-translate-y-0.5 transition-all duration-200 p-6 pt-7 flex flex-col relative overflow-hidden">
      {/* Subject-colored accent strip — always visible */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-1 ${stripClass}`}
        aria-hidden="true"
      />

      {/* Top: difficulty + status */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded uppercase tracking-wide border ${diff}`}
        >
          {DIFFICULTY_LABEL[a.difficulty] || "—"}
        </span>
        <span
          className={`text-[11px] font-semibold px-2 py-0.5 rounded ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      {/* Smart Tag */}
      {tag && (
        <div className="mb-2">
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full border ${tag.className}`}
          >
            {TagIcon ? <TagIcon className="w-2.5 h-2.5" /> : null}
            {tag.label}
          </span>
        </div>
      )}

      {/* Title + description */}
      <h3 className="text-base font-semibold text-gray-900 leading-snug">
        {a.title || "Untitled"}
      </h3>
      {a.description && (
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{a.description}</p>
      )}

      {/* Meta */}
      <div className="flex items-center gap-4 mt-4 text-xs text-gray-600">
        <span className="inline-flex items-center gap-1.5">
          <FiClock className="w-3.5 h-3.5 text-gray-400" />
          {a.duration ?? 0} min
        </span>
        <span className="inline-flex items-center gap-1.5">
          <FiHelpCircle className="w-3.5 h-3.5 text-gray-400" />
          {a.questions ?? 0} questions
        </span>
      </div>

      {/* Status-specific middle block */}
      {a.status === "in-progress" && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-gray-500">Progress</span>
            <span className="text-xs font-semibold text-gray-700">
              {a.progress ?? 0}%
            </span>
          </div>
          <ProgressBar value={a.progress ?? 0} color="amber" size="sm" />
        </div>
      )}

      {a.status === "completed" && (
        <div className="mt-4 flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
          <FiAward className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">
              Score
            </p>
            <p className="text-lg font-semibold text-gray-900 leading-none">
              {a.score ?? 0}%
            </p>
          </div>
          {a.attempts ? (
            <span className="text-xs text-gray-500">
              {a.attempts} attempt{a.attempts > 1 ? "s" : ""}
            </span>
          ) : null}
        </div>
      )}

      {/* Spacer keeps CTA pinned to the bottom of the card */}
      <div className="flex-1" />

      <button
        type="button"
        onClick={() => onAction?.(a)}
        className={`mt-5 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 active:scale-[0.98] ${cta.className}`}
      >
        {cta.label}
        <CtaIcon className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default AssessmentCard;
