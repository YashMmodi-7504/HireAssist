import React from "react";
import { FiCheck, FiX } from "react-icons/fi";

/**
 * Single MCQ display.
 *
 * Modes:
 *   - "answering" (default): user can pick an option, no correctness shown
 *   - "review":              shows the correct answer, the user's pick, and
 *                            optional explanation; options are non-clickable
 *
 * Props:
 *   question   { id, question, options[4], correctAnswer, explanation? }
 *   selected   number | undefined  - index user picked
 *   onSelect   (idx) => void
 *   mode       "answering" | "review"
 *   index      number  - 1-based position to display in the header
 *   total      number  - total count for the header
 */

const optionLabel = (i) => String.fromCharCode(65 + i); // A, B, C, D

const QuestionCard = ({
  question,
  selected,
  onSelect,
  mode = "answering",
  index,
  total,
}) => {
  const isReview = mode === "review";

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="text-[11px] font-bold uppercase tracking-widest text-purple-700 bg-purple-50 border border-purple-100 px-2.5 py-1 rounded-full">
          Question {index} of {total}
        </span>
      </div>

      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 leading-snug">
        {question.question}
      </h2>

      <div className="mt-6 space-y-2.5">
        {question.options.map((opt, i) => {
          const picked = selected === i;
          const correct = i === question.correctAnswer;

          // Tone classes per state
          let stateClass = "border-gray-200 hover:border-purple-300 hover:bg-purple-50/40";
          let badgeClass =
            "bg-gray-100 text-gray-600 border-gray-200 group-hover:bg-purple-100 group-hover:text-purple-700 group-hover:border-purple-200";
          let trailing = null;

          if (isReview) {
            if (correct) {
              stateClass = "border-emerald-200 bg-emerald-50/60";
              badgeClass = "bg-emerald-100 text-emerald-700 border-emerald-200";
              trailing = (
                <FiCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              );
            } else if (picked && !correct) {
              stateClass = "border-red-200 bg-red-50/60";
              badgeClass = "bg-red-100 text-red-700 border-red-200";
              trailing = <FiX className="w-4 h-4 text-red-600 flex-shrink-0" />;
            } else {
              stateClass = "border-gray-200 opacity-70";
            }
          } else if (picked) {
            stateClass = "border-purple-300 bg-purple-50";
            badgeClass = "bg-purple-100 text-purple-700 border-purple-200";
          }

          const Tag = isReview ? "div" : "button";

          return (
            <Tag
              key={i}
              type={isReview ? undefined : "button"}
              onClick={isReview ? undefined : () => onSelect?.(i)}
              className={`group w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${
                isReview ? "" : "active:scale-[0.99]"
              } ${stateClass}`}
            >
              <span
                className={`inline-flex w-8 h-8 rounded-lg items-center justify-center text-xs font-bold border flex-shrink-0 transition-colors ${badgeClass}`}
              >
                {optionLabel(i)}
              </span>
              <span className="flex-1 text-sm text-gray-800">{opt}</span>
              {trailing}
            </Tag>
          );
        })}
      </div>

      {isReview && question.explanation && (
        <div className="mt-5 px-4 py-3 rounded-xl bg-purple-50/60 border border-purple-100">
          <p className="text-[11px] font-bold uppercase tracking-wider text-purple-700 mb-1">
            Why
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
