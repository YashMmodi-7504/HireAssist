import React, { useMemo, useState } from "react";
import {
  FiAward,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiArrowLeft,
  FiRefreshCw,
  FiList,
  FiTrendingUp,
  FiTrendingDown,
  FiBarChart2,
} from "react-icons/fi";
import QuestionCard from "./QuestionCard";
import { summarizeByLevel } from "../../services/assessmentStore";

const formatDuration = (ms) => {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

const verdictFor = (pct) => {
  if (pct >= 85)
    return {
      label: "Excellent",
      tone: "from-emerald-500 to-teal-500",
      chip: "text-emerald-700 bg-emerald-50 border-emerald-100",
      icon: FiTrendingUp,
    };
  if (pct >= 70)
    return {
      label: "Strong",
      tone: "from-blue-500 to-indigo-500",
      chip: "text-blue-700 bg-blue-50 border-blue-100",
      icon: FiAward,
    };
  if (pct >= 50)
    return {
      label: "Decent — keep at it",
      tone: "from-amber-500 to-orange-500",
      chip: "text-amber-700 bg-amber-50 border-amber-100",
      icon: FiAward,
    };
  return {
    label: "Needs work",
    tone: "from-red-500 to-rose-500",
    chip: "text-red-700 bg-red-50 border-red-100",
    icon: FiTrendingDown,
  };
};

/**
 * Result summary + optional answer review.
 *
 * Props:
 *   result    {
 *     subjectName, subtopic, level,
 *     score, total, percentage,
 *     answers, questions, durationMs, completedAt
 *   }
 *   onRetake()  - launch the same setup again
 *   onHome()    - back to assessment dashboard
 */
const LEVEL_TONES = {
  easy: { bar: "from-emerald-500 to-teal-500", chip: "bg-emerald-100 text-emerald-700" },
  intermediate: { bar: "from-blue-500 to-indigo-500", chip: "bg-blue-100 text-blue-700" },
  hard: { bar: "from-rose-500 to-pink-500", chip: "bg-rose-100 text-rose-700" },
};

const ResultPage = ({ result, onRetake, onHome }) => {
  const [showReview, setShowReview] = useState(false);
  const verdict = useMemo(() => verdictFor(result.percentage), [result.percentage]);
  const Icon = verdict.icon;
  const wrong = result.total - result.score;

  // Level-wise breakdown across the user's full attempt history
  // (includes the test that was just submitted, since saveResult ran first).
  const levelBreakdown = useMemo(() => summarizeByLevel(), []);
  const hasAnyLevelData = levelBreakdown.some((l) => l.attempts > 0);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Hero score card */}
      <div
        className={`relative overflow-hidden rounded-2xl text-white shadow-md mb-5`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${verdict.tone}`} aria-hidden="true" />
        <div
          className="pointer-events-none absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/15 blur-3xl"
          aria-hidden="true"
        />
        <div className="relative px-6 sm:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full">
                <Icon className="w-3 h-3" />
                {verdict.label}
              </span>
              <h1 className="text-2xl sm:text-3xl font-semibold mt-3">
                {result.subjectName}
              </h1>
              <p className="text-sm text-white/85 mt-1">
                {result.subtopic} · <span className="capitalize">{result.level}</span> · {result.total} questions
              </p>
            </div>

            {/* Big score */}
            <div className="flex items-center gap-5 flex-shrink-0">
              <div className="text-right">
                <p className="text-5xl font-bold leading-none tracking-tight tabular-nums">
                  {result.percentage}
                  <span className="text-2xl font-semibold">%</span>
                </p>
                <p className="text-xs text-white/80 mt-1.5 uppercase tracking-wider font-semibold">
                  {result.score} of {result.total}
                </p>
              </div>
            </div>
          </div>

          {/* Tile row */}
          <div className="grid grid-cols-3 gap-3 mt-7">
            <div className="rounded-xl bg-white/15 backdrop-blur-sm border border-white/15 px-4 py-3">
              <div className="flex items-center gap-1.5 text-white/80 text-[10px] font-bold uppercase tracking-widest">
                <FiCheckCircle className="w-3 h-3" />
                Correct
              </div>
              <p className="text-2xl font-bold mt-1 tabular-nums">{result.score}</p>
            </div>
            <div className="rounded-xl bg-white/15 backdrop-blur-sm border border-white/15 px-4 py-3">
              <div className="flex items-center gap-1.5 text-white/80 text-[10px] font-bold uppercase tracking-widest">
                <FiXCircle className="w-3 h-3" />
                Wrong
              </div>
              <p className="text-2xl font-bold mt-1 tabular-nums">{wrong}</p>
            </div>
            <div className="rounded-xl bg-white/15 backdrop-blur-sm border border-white/15 px-4 py-3">
              <div className="flex items-center gap-1.5 text-white/80 text-[10px] font-bold uppercase tracking-widest">
                <FiClock className="w-3 h-3" />
                Time
              </div>
              <p className="text-2xl font-bold mt-1 tabular-nums">
                {formatDuration(result.durationMs)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Level-wise breakdown across the user's history */}
      {hasAnyLevelData && (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2.5 mb-4">
            <span className="inline-flex p-2 rounded-lg bg-purple-50 text-purple-600">
              <FiBarChart2 className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Level-wise progress</h3>
              <p className="text-[11px] text-gray-500">
                Average across all your attempts so far
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {levelBreakdown.map((row) => {
              const tone = LEVEL_TONES[row.level] || LEVEL_TONES.intermediate;
              const empty = row.attempts === 0;
              const pct = row.average ?? 0;
              return (
                <div key={row.level}>
                  <div className="flex items-center justify-between mb-1.5 gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${tone.chip}`}
                      >
                        {row.label}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        {empty
                          ? "no attempts yet"
                          : `${row.attempts} attempt${row.attempts > 1 ? "s" : ""}`}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-gray-900 tabular-nums">
                      {empty ? "—" : `${pct}%`}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${tone.bar} rounded-full transition-[width] duration-700 ease-out`}
                      style={{ width: empty ? "0%" : `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <button
          type="button"
          onClick={onHome}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          Back to assessments
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowReview((v) => !v)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-100 rounded-lg transition-colors"
          >
            <FiList className="w-4 h-4" />
            {showReview ? "Hide review" : "Review answers"}
          </button>
          <button
            type="button"
            onClick={onRetake}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 rounded-lg shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(124,58,237,0.45)] transition-all duration-200"
          >
            <FiRefreshCw className="w-4 h-4" />
            Retake test
          </button>
        </div>
      </div>

      {/* Answer review */}
      {showReview && (
        <div className="space-y-4">
          {result.questions.map((q, i) => (
            <QuestionCard
              key={q.id + ":" + i}
              question={q}
              selected={result.answers[q.id]}
              mode="review"
              index={i + 1}
              total={result.total}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultPage;
