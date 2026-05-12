import React, { useMemo } from "react";
import {
  FiTrendingUp,
  FiAlertTriangle,
  FiZap,
  FiArrowUpRight,
  FiCpu,
} from "react-icons/fi";

// Build a 3-card insight set from the dashboard's current data shape.
// Each card carries a `prompt` that the parent fires through the AI tutor.
const buildInsights = ({ skills = [], streak = 0, longestStreak = 0 }) => {
  const ranked = [...skills]
    .filter((s) => typeof s.value === "number")
    .sort((a, b) => b.value - a.value);
  const strongest = ranked[0];
  const weakest = ranked[ranked.length - 1];

  const insights = [];

  if (strongest) {
    insights.push({
      key: "strength",
      icon: FiTrendingUp,
      label: "Top strength",
      tone: "emerald",
      title: `You're strongest in ${strongest.name}`,
      body: `${strongest.value}% mastery — try teaching it back to lock it in.`,
      cta: "Teach it back",
      prompt: `I want to consolidate my knowledge of ${strongest.name}. Quiz me with progressively harder questions.`,
    });
  }

  if (weakest && weakest.value < 70) {
    insights.push({
      key: "gap",
      icon: FiAlertTriangle,
      label: "Skill gap",
      tone: "amber",
      title: `Drill ${weakest.name}`,
      body: `Currently at ${weakest.value}% — closing this gap moves your score the most.`,
      cta: "Get a study plan",
      prompt: `Build me a focused study plan to improve at ${weakest.name}. Start with the most fundamental concept.`,
    });
  }

  insights.push({
    key: "streak",
    icon: FiZap,
    label: streak >= longestStreak && streak > 0 ? "Personal best" : "Momentum",
    tone: "purple",
    title:
      streak >= 7
        ? `${streak}-day streak — keep it alive`
        : streak > 0
        ? `${streak} days going — push past your longest (${longestStreak})`
        : "Restart your streak today",
    body:
      streak >= 7
        ? "Consistency compounds. A short session today extends the run."
        : "One focused session resets your streak counter.",
    cta: "Plan today's session",
    prompt:
      "Suggest a 30-minute focused study plan for me right now based on my current syllabus and recent activity.",
  });

  // Trim to 3 cards to keep the strip tight even when all paths fire.
  return insights.slice(0, 3);
};

const TONE_CLASSES = {
  emerald: {
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    chip: "bg-emerald-100 text-emerald-800",
    border: "border-emerald-100",
  },
  amber: {
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    chip: "bg-amber-100 text-amber-800",
    border: "border-amber-100",
  },
  purple: {
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    chip: "bg-purple-100 text-purple-800",
    border: "border-purple-100",
  },
};

const AiInsightPanel = ({ skills, streak, longestStreak, onAskAI }) => {
  const insights = useMemo(
    () => buildInsights({ skills, streak, longestStreak }),
    [skills, streak, longestStreak]
  );

  return (
    <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 items-center justify-center text-white shadow-sm">
            <FiCpu className="w-4 h-4" />
          </span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Tailored to your last 14 days of activity
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((ins) => {
          const tone = TONE_CLASSES[ins.tone] || TONE_CLASSES.purple;
          const Icon = ins.icon;
          return (
            <button
              type="button"
              key={ins.key}
              onClick={() => onAskAI?.(ins.prompt)}
              className={`group text-left bg-white border ${tone.border} rounded-xl p-4 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_rgba(124,58,237,0.18)] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-300`}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className={`inline-flex p-1.5 rounded-lg ${tone.iconBg} ${tone.iconColor}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${tone.chip}`}
                >
                  {ins.label}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-gray-900 leading-tight">
                {ins.title}
              </h4>
              <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                {ins.body}
              </p>
              <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-purple-700 group-hover:gap-2 transition-all">
                {ins.cta}
                <FiArrowUpRight className="w-3 h-3" />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default AiInsightPanel;
