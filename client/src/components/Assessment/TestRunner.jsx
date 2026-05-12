import React, { useEffect, useReducer, useRef, useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiClock,
  FiCheckCircle,
  FiAlertTriangle,
} from "react-icons/fi";
import QuestionCard from "./QuestionCard";

// ─── Reducer ─────────────────────────────────────────────────────────────
// Selection locks the question immediately — the student cannot change
// their answer once chosen. Visual feedback (green/red) renders right
// after lock via QuestionCard's "review" mode.
const initialState = (questions) => ({
  questions,
  currentIndex: 0,
  // answers: { [questionId]: selectedOptionIndex }
  answers: {},
  // locked: Set-like keyed object of questionIds that have been answered
  locked: {},
  startedAt: Date.now(),
});

function reducer(state, action) {
  switch (action.type) {
    case "SELECT": {
      const q = state.questions[state.currentIndex];
      if (!q) return state;
      // Hard guard: never allow a re-pick on an already-locked question.
      if (state.locked[q.id]) return state;
      return {
        ...state,
        answers: { ...state.answers, [q.id]: action.option },
        locked: { ...state.locked, [q.id]: true },
      };
    }
    case "NEXT":
      return {
        ...state,
        currentIndex: Math.min(state.currentIndex + 1, state.questions.length - 1),
      };
    case "PREV":
      return { ...state, currentIndex: Math.max(state.currentIndex - 1, 0) };
    case "JUMP":
      return {
        ...state,
        currentIndex: Math.max(0, Math.min(action.index, state.questions.length - 1)),
      };
    default:
      return state;
  }
}

// ─── Timer hook ──────────────────────────────────────────────────────────
const useElapsed = (startedAt) => {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return Math.max(0, now - startedAt);
};

const formatDuration = (ms) => {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60).toString().padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

// ─── Component ───────────────────────────────────────────────────────────
const TestRunner = ({ config, onSubmit, onCancel }) => {
  const [state, dispatch] = useReducer(reducer, config.questions, initialState);
  const { questions, currentIndex, answers, startedAt } = state;
  const elapsed = useElapsed(startedAt);

  // Confirm leave if user clicks Cancel mid-test
  const cancelClicks = useRef(0);
  const handleCancel = () => {
    cancelClicks.current += 1;
    if (cancelClicks.current === 1) {
      // First click: warn
      setTimeout(() => {
        cancelClicks.current = 0;
      }, 3000);
      return;
    }
    onCancel?.();
  };

  const total = questions.length;
  const current = questions[currentIndex];
  const answered = Object.keys(state.locked).length;
  const progressPct = ((currentIndex + 1) / total) * 100;
  const isLast = currentIndex === total - 1;
  const isFirst = currentIndex === 0;
  const currentLocked = current ? !!state.locked[current.id] : false;

  const handleSelect = (option) => dispatch({ type: "SELECT", option });
  const handleNext = () => dispatch({ type: "NEXT" });
  const handlePrev = () => dispatch({ type: "PREV" });
  const handleJump = (idx) => dispatch({ type: "JUMP", index: idx });

  const handleSubmit = () => {
    const correctCount = questions.reduce((acc, q) => {
      const picked = answers[q.id];
      return picked === q.correctAnswer ? acc + 1 : acc;
    }, 0);

    onSubmit?.({
      ...config,
      answers,
      questionIds: questions.map((q) => q.id),
      questions, // pass through so result can review without re-fetching
      score: correctCount,
      total,
      percentage: Math.round((correctCount / total) * 100),
      durationMs: Date.now() - startedAt,
      completedAt: Date.now(),
    });
  };

  // Keyboard navigation: arrow keys advance only when current is locked
  // (matches the disabled-Next rule), 1-4 to select while not yet locked.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight" && !isLast && currentLocked) handleNext();
      else if (e.key === "ArrowLeft" && !isFirst) handlePrev();
      else if (["1", "2", "3", "4"].includes(e.key) && !currentLocked) {
        const idx = parseInt(e.key, 10) - 1;
        if (current && idx < current.options.length) handleSelect(idx);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, current, currentLocked, isLast, isFirst]);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header strip */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 mb-4">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-widest text-gray-500">
              {config.subjectName} · {config.subtopic}
            </p>
            <p className="text-sm font-semibold text-gray-900 capitalize">
              {config.level} test
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-sm font-mono font-semibold text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg tabular-nums">
              <FiClock className="w-3.5 h-3.5 text-gray-400" />
              {formatDuration(elapsed)}
            </span>
            <button
              type="button"
              onClick={handleCancel}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                cancelClicks.current > 0
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {cancelClicks.current > 0 ? (
                <>
                  <FiAlertTriangle className="w-3 h-3" />
                  Click again to discard
                </>
              ) : (
                "Quit test"
              )}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-[width] duration-300 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-[11px] font-semibold text-gray-500 tabular-nums">
            {answered} / {total} answered
          </span>
        </div>
      </div>

      {/* Question — flips to "review" mode the moment the student answers */}
      {current && (
        <QuestionCard
          question={current}
          selected={answers[current.id]}
          onSelect={handleSelect}
          mode={currentLocked ? "review" : "answering"}
          index={currentIndex + 1}
          total={total}
        />
      )}

      {/* Footer nav */}
      <div className="flex items-center justify-between gap-3 mt-5">
        <button
          type="button"
          onClick={handlePrev}
          disabled={isFirst}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <FiArrowLeft className="w-4 h-4" />
          Previous
        </button>

        {/* Jump pills — only allow jumping to answered or current question.
            Forward jumps to unseen questions are blocked so students can't peek. */}
        <div className="hidden md:flex items-center gap-1.5 overflow-x-auto max-w-[55%]">
          {questions.map((q, i) => {
            const done = state.locked[q.id];
            const active = i === currentIndex;
            const reachable = done || i <= currentIndex;
            return (
              <button
                key={q.id + ":" + i}
                type="button"
                onClick={() => reachable && handleJump(i)}
                disabled={!reachable}
                className={`w-7 h-7 rounded-md text-[11px] font-bold transition-all flex-shrink-0 ${
                  active
                    ? "bg-purple-600 text-white shadow-sm scale-110"
                    : done
                    ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
                aria-label={`Question ${i + 1}${done ? " (answered)" : reachable ? "" : " (locked)"}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        {isLast ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!currentLocked}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow-[0_8px_24px_-6px_rgba(124,58,237,0.45)] disabled:hover:shadow-none transition-all duration-200"
          >
            <FiCheckCircle className="w-4 h-4" />
            Submit test
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            disabled={!currentLocked}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all duration-200"
          >
            Next
            <FiArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <p className="text-[11px] text-gray-400 text-center mt-4">
        Tip: use ← → to navigate · 1–4 to pick an option
      </p>
    </div>
  );
};

export default TestRunner;
