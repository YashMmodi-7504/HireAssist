import React, { useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";

/**
 * Clickable chip cluster that lets the user fire a follow-up question
 * with one tap. Used in two places in AIChat:
 *   - under the latest AI message (variant="post")
 *   - inside the empty-state hero (variant="hero")
 *
 * Props:
 *   suggestions  string[]                       - chip labels
 *   onPick(text) (text: string) => void         - fires when a chip is clicked
 *   label        string                         - eyebrow heading above chips
 *   variant      "post" | "hero"                - sizing / alignment preset
 *   tone         "purple" | "blue" | "yellow" | "pink"
 *                                               - tonal palette for `post` variant
 *   disabled     boolean                        - disables every chip
 */

// Per-tone palette table for the post variant. Each tone matches the
// gradient + border + hover-text + label colour to the chosen accent.
const TONES = {
  purple: {
    chip: "text-gray-700 hover:text-purple-800 bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border-purple-100/70 hover:border-purple-200",
    label: "text-purple-700",
  },
  blue: {
    chip: "text-gray-700 hover:text-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-100/80 hover:border-blue-200",
    label: "text-blue-700",
  },
  yellow: {
    chip: "text-gray-700 hover:text-amber-800 bg-gradient-to-r from-amber-50 to-yellow-50 hover:from-amber-100 hover:to-yellow-100 border-amber-100/80 hover:border-amber-200",
    label: "text-amber-700",
  },
  pink: {
    chip: "text-gray-700 hover:text-rose-800 bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 border-rose-100/80 hover:border-rose-200",
    label: "text-rose-700",
  },
};

const SuggestedQuestions = ({
  suggestions = [],
  onPick,
  label = "Continue Learning",
  variant = "post",
  tone = "purple",
  disabled = false,
}) => {
  const [picked, setPicked] = useState(null);

  if (!suggestions.length) return null;

  const isHero = variant === "hero";
  const palette = TONES[tone] || TONES.purple;

  // Briefly flash the picked chip (~150ms) before firing onPick, so the
  // click reads as acknowledged before the parent unmounts the cluster on
  // loading state. Long enough to perceive, short enough not to feel laggy.
  const handleClick = (s) => {
    if (disabled) return;
    setPicked(s);
    setTimeout(() => onPick?.(s), 150);
  };

  return (
    <div
      className={
        isHero
          ? "flex flex-wrap items-center justify-center gap-2 max-w-2xl"
          : "chat-bubble-in flex flex-wrap items-center gap-2"
      }
    >
      {!isHero && label && (
        <span
          className={`w-full text-[11px] font-semibold mb-1 ${palette.label}`}
        >
          {label}
        </span>
      )}
      {suggestions.map((s) => {
        const isPicked = picked === s;
        return (
          <button
            key={s}
            type="button"
            onClick={() => handleClick(s)}
            disabled={disabled || picked !== null}
            className={
              isHero
                ? `text-sm font-medium text-gray-700 bg-white hover:bg-purple-50 hover:text-purple-700 border border-gray-200 hover:border-purple-200 rounded-full px-4 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-purple-500/10 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isPicked ? "ring-2 ring-purple-400 scale-105" : ""
                  }`
                : `group inline-flex items-center gap-1 text-xs font-medium border rounded-full px-4 py-2 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed ${palette.chip} ${
                    isPicked ? "ring-2 ring-purple-400 scale-105 shadow-md" : ""
                  }`
            }
          >
            {s}
            {!isHero && (
              <FiArrowUpRight className="w-3 h-3 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default SuggestedQuestions;
