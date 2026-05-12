import React, { useMemo } from "react";
import {
  FiAlertTriangle,
  FiTarget,
  FiZap,
  FiArrowRight,
  FiCpu,
} from "react-icons/fi";

// Derive the single highest-priority next action from dashboard state.
//   1. Today/tomorrow deadline → tackle that
//   2. Lowest skill below 60% → drill that skill
//   3. Strong streak (≥7) → suggest a quiz to test depth
//   4. Default → continue current course
const pickAction = ({ deadlines = [], skills = [], streak = 0 } = {}) => {
  const urgentDeadline = deadlines.find((d) => d.status === "urgent");
  if (urgentDeadline) {
    return {
      key: "deadline",
      icon: FiAlertTriangle,
      tone: {
        bg: "bg-gradient-to-br from-red-50 to-orange-50",
        ring: "ring-red-100",
        chip: "bg-red-100 text-red-700",
      },
      label: "Urgent — due " + urgentDeadline.due.toLowerCase(),
      title: `Tackle "${urgentDeadline.title}"`,
      subtitle: `${urgentDeadline.course} · let's break it down step by step.`,
      ctaText: "Plan it with AI Tutor",
      prompt: `Help me plan and complete "${urgentDeadline.title}" for ${urgentDeadline.course}. Walk me through the approach.`,
    };
  }

  const weakest = [...skills]
    .filter((s) => typeof s.value === "number")
    .sort((a, b) => a.value - b.value)[0];
  if (weakest && weakest.value < 60) {
    return {
      key: "skill-gap",
      icon: FiTarget,
      tone: {
        bg: "bg-gradient-to-br from-amber-50 to-yellow-50",
        ring: "ring-amber-100",
        chip: "bg-amber-100 text-amber-700",
      },
      label: `Skill gap · ${weakest.value}%`,
      title: `Strengthen ${weakest.name}`,
      subtitle: `Your weakest area right now — closing this lifts your overall readiness fastest.`,
      ctaText: "Drill with AI Tutor",
      prompt: `Help me improve at ${weakest.name}. Explain key concepts simply and quiz me to find weak spots.`,
    };
  }

  if (streak >= 7) {
    return {
      key: "streak",
      icon: FiZap,
      tone: {
        bg: "bg-gradient-to-br from-emerald-50 to-teal-50",
        ring: "ring-emerald-100",
        chip: "bg-emerald-100 text-emerald-700",
      },
      label: `🔥 ${streak}-day streak`,
      title: "You're on a roll — push for depth",
      subtitle: `Keep momentum: a short quiz now will lock in what you've been learning.`,
      ctaText: "Quiz me with AI",
      prompt: "Quiz me on what I've been learning recently. 5 mixed-difficulty questions, no answers shown until I reply.",
    };
  }

  return {
    key: "continue",
    icon: FiCpu,
    tone: {
      bg: "bg-gradient-to-br from-purple-50 to-indigo-50",
      ring: "ring-purple-100",
      chip: "bg-purple-100 text-purple-700",
    },
    label: "Recommended",
    title: "Continue your current course",
    subtitle: "Pick up where you left off and ask AI Tutor for help when you get stuck.",
    ctaText: "Ask AI Tutor",
    prompt: "What should I learn next based on the HireAssist syllabus? Give me one focused next step.",
  };
};

const NextBestAction = ({ deadlines, skills, streak, onAskAI }) => {
  const action = useMemo(
    () => pickAction({ deadlines, skills, streak }),
    [deadlines, skills, streak]
  );
  const Icon = action.icon;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl ring-1 ${action.tone.ring} ${action.tone.bg} p-5 sm:p-6 shadow-sm`}
    >
      {/* AI label chip in the corner */}
      <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-white/80 backdrop-blur-sm border border-purple-100 px-2 py-0.5 rounded-full shadow-sm">
        <FiCpu className="w-3 h-3" />
        AI Suggestion
      </div>

      <div className="flex items-start gap-4">
        <span className="inline-flex w-11 h-11 rounded-xl bg-white text-gray-700 items-center justify-center shadow-sm flex-shrink-0">
          <Icon className="w-5 h-5" />
        </span>
        <div className="flex-1 min-w-0 pr-24 sm:pr-28">
          <span
            className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${action.tone.chip}`}
          >
            {action.label}
          </span>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mt-2 leading-tight">
            {action.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">
            {action.subtitle}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={() => onAskAI?.(action.prompt)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(124,58,237,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          {action.ctaText}
          <FiArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default NextBestAction;
